// A component to find and show longest downward trend (bearish)
<template>
  <div>
    <p>Longest downward trend was {{ downDays }} day(s)</p>
  </div>
</template>

<script>
export default {
  name: 'ShowBearish',
  props: ['prices'],
  data() {
    return {
      downDays: '',
    };
  },
  created() {
      this.findBearish()
  },
  methods: {
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
  },
};
</script>
