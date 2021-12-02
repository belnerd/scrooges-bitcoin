// A component to find and show best possible days to buy and sell, or to hold
// action.
<template>
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
</template>

<script>
import { formatDate, formatCurrency } from '../helpers.js';

export default {
  name: 'ShowTradeDays',
  props: ['prices'],
  data() {
    return {
      hold: false,
      buyDay: {
        timestamp: '',
        price: '',
      },
      sellDay: {
        timestamp: '',
        price: '',
      },
    };
  },
  created() {
    this.findTradeDays();
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
