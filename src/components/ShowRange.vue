// A component to get data for a specified date range from coingeck API and process and display that data.
<template>
  <div>
    <div v-if="!startDate || !endDate">Please selects dates</div>
    <div v-else-if="rangeData.length === 0">Loading data</div>
    <div v-else>
      <p>Longest downward trend was {{ downDays }} days</p>
    </div>
  </div>
</template>

<script>
import { formatDateUTCObject } from '../helpers.js';

export default {
  name: 'ShowRange',
  props: ['startDate', 'endDate'],
  data() {
    return {
      rangeData: [],
      from: this.startDate,
      to: this.endDate,
      downDays: '',
    };
  },
  // Watch for changes in props to fetch new data from the API
  watch: {
    startDate: function () {
      this.from = this.startDate;
      this.to = this.endDate;
      this.getData(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=${this.from}&to=${this.to+3600}`
      );
    },
    endDate: function () {
      this.to = this.endDate;
      this.from = this.startDate;
      this.getData(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=${this.from}&to=${this.to+3600}`
      );
    },
    rangeData: function () {
      this.findDownwardTrend();
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
    // Find the longest downward trend from the data
    findDownwardTrend() {
      const prices = this.rangeData.prices;
      let i;
      let day = formatDateUTCObject(prices[0][0]).date; // Set the first day
      let prevPrice = prices[0][1]; // Set the first price
      let downDays = 0;
      let streak = 0;
      for (i = 0; i < prices.length; i++) {
        let dayCounter = formatDateUTCObject(prices[i][0]).date;
        // Check if the day has changed
        if (dayCounter !== day) {
          console.log(formatDateUTCObject(prices[i][0]))
          day = dayCounter;
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
      }
      this.downDays = downDays;
    },
  },
};
</script>
