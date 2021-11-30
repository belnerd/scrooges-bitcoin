// A component to get and display current day's bitcoin data from coingecko API
<template>
  <div class="wrapper">
    <p v-if="currentData.length === 0 && !error">Loading current data...</p>
    <div v-else-if="!error">
      <table>
        <tbody>
          <tr>
            <td colspan="2">
              <u>Status at {{ formatDate(currentData.last_updated_at) }}</u>
            </td>
          </tr>
          <tr>
            <td class="leftAlign">Current value</td>
            <td class="rightAlign">{{ formatCurrency(currentData.eur) }}</td>
          </tr>
          <tr>
            <td class="leftAlign">Market cap</td>
            <td class="rightAlign">
              {{ formatCurrency(currentData.eur_market_cap) }}
            </td>
          </tr>
          <tr>
            <td class="leftAlign">24h volume</td>
            <td class="rightAlign">
              {{ formatCurrency(currentData.eur_24h_vol) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else>Error loading data: {{ error }}</p>
  </div>
</template>

<script>
import { formatDate, formatCurrency, getJSON } from '../helpers.js';

export default {
  name: 'ShowValue',
  data() {
    return {
      simplePriceURL:
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur&include_market_cap=true&include_24hr_vol=true&include_last_updated_at=true',
      currentData: [],
      error: '',
    };
  },
  created() {
    // GET current data from the API
    const headers = { Accept: 'application/json' };
    getJSON(this.simplePriceURL, headers).then((response) => {
      if (!response.error) {
        this.currentData = response.bitcoin;
      } else {
        this.error = response.error;
      }
    });
  },
  methods: {
    formatDate,
    formatCurrency,
  },
};
</script>

<style scoped>
.wrapper {
  padding-top: 15px;
}

header {
  margin-left: 25px;
  text-align: left;
}

table {
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  table-layout: fixed;
  width: 50%;
}

tr {
  height: 20px;
}

.leftAlign {
  text-align: left;
}

.rightAlign {
  text-align: right;
}
</style>
