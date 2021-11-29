// A component to get data for a specified date range from coingeck API and
process and display that data.
<template>
  <div>
    <div v-if="!startDate || !endDate">Please select dates</div>
    <div v-else-if="rangeData.length === 0">Loading data</div>
    <div v-else>
      <p>Longest downward trend was {{ downDays }} days</p>
      <p>
        Highest volume was {{ volume.volume.toFixed(0) }} EUR at
        {{ volume.date }}
      </p>
      <div v-if="!hold">
        <p>
          You should buy at {{ buyDay.timestamp }} when price is
          {{ formatCurrency(buyDay.price) }}
        </p>
        <p>
          You should sell at {{ sellDay.timestamp }} when price is
          {{ formatCurrency(sellDay.price) }}
        </p>
      </div>
      <p v-else>You shouldn't buy or sell during this time period.</p>
    </div>
  </div>
</template>

<script>
import { formatDate, transformToDaily, formatCurrency } from '../helpers.js';

export default {
  name: 'ShowRange',
  props: ['startDate', 'endDate'],
  data() {
    return {
      rangeData: [],
      from: this.startDate,
      to: this.endDate,
      downDays: '',
      buyDay: {
        timestamp: '',
        price: '',
      },
      sellDay: {
        timestamp: '',
        price: '',
      },
      hold: false,
      volume: {},
      prices: {},
    };
  },
  // Watch for changes in props to fetch new data from the API
  watch: {
    startDate: function () {
      this.from = this.startDate;
      this.to = this.endDate;
      this.getData(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=${
          this.from
        }&to=${this.to + 3600}`
      );
    },
    endDate: function () {
      this.to = this.endDate;
      this.from = this.startDate;
      this.getData(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=${
          this.from
        }&to=${this.to + 3600}`
      );
    },
    rangeData: function () {
      this.prices = transformToDaily(this.rangeData, 'prices');
      this.findBearish();
      this.findHighestVolume();
      this.findTradeDays();
    },
  },
  methods: {
    // Get data from Coingecko API
    getData(url) {
      const headers = { Accept: 'application/json' };
      fetch(url, { headers })
        .then((response) => response.json())
        .then((data) => (this.rangeData = data));
    },
    // Find the longest downward trend from the data that has been transformed to daily data
    findBearish() {
      const prices = this.prices;
      let prevPrice = prices[0][1]; // Set the first price
      let downDays = 0;
      let streak = 0;
      for (let i = 1; i < prices.length; i++) {
        // Check if the previous price is higher than first price of a new day
        if (prevPrice >= prices[i][1]) {
          streak++;
          prevPrice = prices[i][1];
          // Check if streak is higher than previous high streak
          if (streak > downDays) {
            downDays = streak;
          }
          // Check if downward trend ends
        } else if (prevPrice <= prices[i][1]) {
          if (streak >= downDays) {
            downDays = streak;
          }
          streak = 0;
          prevPrice = prices[i][1];
        } else {
          if (streak > downDays) {
            downDays = streak;
            streak = 0;
            prevPrice = prices[i][1];
          }
        }
      }
      this.downDays = downDays;
    },
    // Find the highest trading volume from the data that has been transformed to daily data (at 00:00 UTC)
    findHighestVolume() {
      const volumes = transformToDaily(this.rangeData, 'total_volumes');
      let max = {
        volume: volumes[0][1],
        timestamp: volumes[0][0],
      };
      for (let i = 1; i < volumes.length; i++) {
        if (volumes[i][1] > max.volume) {
          max.volume = volumes[i][1];
          max.timestamp = volumes[i][0];
        }
      }
      this.volume = {
        volume: max.volume,
        date: formatDate(max.timestamp, 'fi', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        }),
      };
    },
    // Find best days to buy (lowest price) and sell (highest price)
    findTradeDays() {
      const prices = this.prices;
      console.log(prices);
      // Set the min and max price as first values at range
      let min = {
        timestamp: prices[0][0],
        price: prices[0][1],
      };
      let max = {
        timestamp: prices[0][0],
        price: prices[0][1],
      };
      // Set the first difference in daily prices, then compare each element to find maximum difference for best profit
      let maxDiff = prices[1][1] - prices[0][1];
      for (let i = 0; i < prices.length; i++) {
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
      // Check if price does change or just decreases during the time period
      if (min.price < max.price) {
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
