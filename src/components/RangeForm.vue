// A form component to select range of dates
<template>
  <form @submit.prevent="submitRange">
    <div>
      <label for="startDate">Starting date</label>
      <input type="date" ref="startDate" :min="minDate" :max="today" />
    </div>
    <div>
      <label for="endDate">Ending date</label>
      <input type="date" ref="endDate" :min="minDate" :max="today" />
    </div>
    <div>
      <button class="button" type="submit">GET DATA</button>
    </div>
  </form>
</template>

<script>
import { formatDateUnix } from '../helpers.js';

export default {
  name: 'RangeForm',
  data() {
    return {
      submitObj: {
        startDate: '',
        endDate: '',
        submitValue: '',
      },
      today: new Date().toLocaleDateString('en-ca'), // Prevent user to select dates from the future
      minDate: '2013-04-28',
    };
  },
  methods: {
    // Get data from form inputs and emit it to parent
    // Also format the date as UNIX timestamp
    submitRange() {
      // Check that dates are actually set
      if (this.$refs.startDate.value && this.$refs.endDate.value) {
        // Swap dates by destructuring if they are backwards
        if (this.$refs.startDate.value > this.$refs.endDate.value) {
          [this.$refs.startDate.value, this.$refs.endDate.value] = [
            this.$refs.endDate.value,
            this.$refs.startDate.value,
          ];
        }
        this.submitObj.startDate = formatDateUnix(this.$refs.startDate.value);
        this.submitObj.endDate = formatDateUnix(this.$refs.endDate.value);
        this.submitObj.submitValue = Math.random();
        this.$emit('submitRange', this.submitObj);
      }
    },
  },
};
</script>
