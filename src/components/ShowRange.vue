// A component to get data for a specified date range from coingecko API and
// process and display that data (with further components).
<template>
  <div v-if="!error">
    <div v-if="!startDate || !endDate">Please select dates</div>
    <div v-else-if="isLoading">Loading data</div>
    <div v-else>
      <ShowBearish :prices="prices" />
      <ShowVolume :volumes="volumes" />
      <ShowTradeDays :prices="prices" />
    </div>
  </div>
  <div v-else>{{ error }}</div>
</template>

<script>
import ShowBearish from './ShowBearish.vue';
import ShowVolume from './ShowVolume.vue';
import ShowTradeDays from './ShowTradeDays.vue';

import {
  transformToDaily,
  getJSON,
} from '../helpers.js';

export default {
  name: 'ShowRange',
  components: { ShowBearish, ShowVolume, ShowTradeDays },
  props: ['startDate', 'endDate', 'submitValue'],
  data() {
    return {
      rangeData: [],
      from: this.startDate,
      to: this.endDate,
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
    },
  },
};
</script>
