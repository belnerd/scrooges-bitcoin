// A component to get data for a specified date range from coingeck API and
process and display that data.
<template>
  <div v-if="!error">
    <div v-if="!startDate || !endDate">Please select dates</div>
    <div v-else-if="isLoading">Loading data</div>
    <div v-else>
      <ShowBearish :prices="prices" />
      <ShowVolume :volumes="volumes" />
      <div v-if="!hold">
        <p>
          You should buy at {{ buyDay.timestamp }} when price was
          {{ formatCurrency(buyDay.price) }}
        </p>
        <p>
          You should sell at {{ sellDay.timestamp }} when price was
          {{ formatCurrency(sellDay.price) }}
        </p>
      </div>
      <p v-else>You shouldn't buy or sell during this time period.</p>
    </div>
  </div>
  <div v-else>{{ error }}</div>
</template>

<script>
import ShowBearish from './ShowBearish.vue';
import ShowVolume from './ShowVolume.vue';

import {
  formatDate,
  transformToDaily,
  formatCurrency,
  getJSON,
} from '../helpers.js';

export default {
  name: 'ShowRange',
  components: { ShowBearish, ShowVolume },
  props: ['startDate', 'endDate', 'submitValue'],
  data() {
    return {
      rangeData: [],
      from: this.startDate,
      to: this.endDate,
      buyDay: {
        timestamp: '',
        price: '',
      },
      sellDay: {
        timestamp: '',
        price: '',
      },
      hold: false,
      isLoading: false,
      prices: {},
      volumes: {},
      error: '',
    };
  },
  // Watch for changes in props to fetch new data from the API
  watch: {
    submitValue: function () {
      this.isLoading = true;
      this.from = this.startDate;
      this.to = this.endDate;
      const headers = { Accept: 'application/json' };
      getJSON(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=${
          this.from
        }&to=${this.to + 3600}`,
        headers
      ).then((response) => {
        if (!response.error) {
          this.rangeData = response;
          this.isLoading = false;
        } else {
          this.error = response.error;
          this.isLoading = false;
        }
      });
    },
    rangeData: function () {
      this.hold = false;
      this.prices = transformToDaily(this.rangeData, 'prices');
      this.volumes = transformToDaily(this.rangeData, 'total_volumes');
      this.findTradeDays();
    },
  },
  methods: {
    // Find best days to buy (lowest price) and sell (highest price)
    findTradeDays() {
      const prices = this.prices;
      let decreasing = true;
      // Set the min and max price as first values at range
      let min = {
        timestamp: prices[0][0],
        price: prices[0][1],
      };
      let max = {
        timestamp: prices[0][0],
        price: prices[0][1],
      };
      let maxDiff = 0;
      for (let i = 0; i < prices.length; i++) {
        // Check if price keeps decreasing
        if (i > 0) {
          if (prices[i][1] < prices[i - 1][1] && decreasing) {
            decreasing = true;
          } else {
            decreasing = false;
          }
        }
        for (let j = i + 1; j < prices.length; j++) {
          if (prices[j][1] - prices[i][1] > maxDiff) {
            maxDiff = prices[j][1] - prices[i][1];
            min.timestamp = prices[i][0];
            min.price = prices[i][1];
            max.timestamp = prices[j][0];
            max.price = prices[j][1];
          }
        }
      }
      // If price wasn't decreasing the whole period, save data, else recommend holding action.
      if (!decreasing) {
        this.hold = false;
        this.buyDay = {
          timestamp: formatDate(min.timestamp, 'fi', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          }),
          price: min.price,
        };
        this.sellDay = {
          timestamp: formatDate(max.timestamp, 'fi', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          }),
          price: max.price,
        };
      } else {
        this.hold = true;
      }
    },
    formatCurrency,
  },
};
</script>
