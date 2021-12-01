// A component to find and show highest volume from range
<template>
  <div>
    <p>
      Highest volume was {{ formatCurrency(volume.volume) }} at
      {{ volume.date }}
    </p>
  </div>
</template>

<script>
import { formatDate, formatCurrency } from '../helpers.js';

export default {
  name: 'ShowVolume',
  props: ['volumes'],
  data() {
    return {
      volume: {},
    };
  },
  created() {
    this.findHighestVolume();
  },
  methods: {
    // Find the highest trading volume from the data that has been transformed to daily data (at 00:00 UTC)
    findHighestVolume() {
      const volumes = this.volumes;
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
    formatCurrency,
  },
};
</script>
