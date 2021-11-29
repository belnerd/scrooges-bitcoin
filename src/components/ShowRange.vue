// A component to get data for a specified date range from coingeck API and
process and display that data.
<template>
  <div>
    <div v-if="!startDate || !endDate">Please selects dates</div>
    <div v-else-if="rangeData.length === 0">Loading data</div>
    <div v-else>
      <p>Longest downward trend was {{ downDays }} days</p>
      <p>
        Highest volume was {{ volume.volume.toFixed(0) }} EUR at
        {{ volume.date }}
      </p>
    </div>
  </div>
</template>

<script>
import {
  formatDate,
  transformToDaily,
} from '../helpers.js';

export default {
  name: 'ShowRange',
  props: ['startDate', 'endDate'],
  data() {
    return {
      rangeData: [],
      from: this.startDate,
      to: this.endDate,
      downDays: '',
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
    },
  },
  methods: {
    // Get data from coingeck API
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
  },
};
</script>
