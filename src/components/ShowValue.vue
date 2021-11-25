// A component to get and display current day's bitcoin data from coingecko API
<template>
  <div class="wrapper">
    <p v-if="currentData.length === 0">Loading current data...</p>
    <div v-else>
      <header style="text-align: left">Current data</header>
      <div class="dataContent">
        <div>Current value: {{ currentData.eur }} EUR</div>
        <div>Market cap: {{ currentData.eur_market_cap }}</div>
        <div>24h volume: {{ currentData.eur_24h_vol }}</div>
        <div>
          Last updated at: {{ formatDate(currentData.last_updated_at) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import helpers from '../helpers.js';

export default {
  name: 'ShowValue',
  data() {
    return {
      simplePriceURL:
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur&include_market_cap=true&include_24hr_vol=true&include_last_updated_at=true',
      currentData: [],
    };
  },
  created() {
    // GET current data from the API
    const headers = { Accept: 'application/json' };
    fetch(this.simplePriceURL, { headers })
      .then((response) => response.json())
      .then((data) => (this.currentData = data.bitcoin));
  },
  methods: {
    formatDate: helpers.formatDate,
  },
};
</script>

<style scoped>
.wrapper {
  padding-top: 15px;
}
.dataContent {
  text-align: left;
  border: 1px lightgrey solid;
  padding: 2px;
}
</style>
