<template>
  <div>
    <Header />
    <ShowValue />
    <div class="rangeSelector">
      <form @submit.prevent="submitRange">
        <label for="startDate">Starting date</label>
        <input type="date" ref="startDate" :min="minDate" :max="today" />
        <label for="endDate">Ending date</label>
        <input type="date" ref="endDate" :min="minDate" :max="today" />
        <button type="submit">Get data</button>
      </form>
    </div>
    <ShowRange
      :startDate="startDate"
      :endDate="endDate"
      :submitValue="submitValue"
    />
    <Footer />
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import ShowValue from './components/ShowValue.vue';
import ShowRange from './components/ShowRange.vue';
import { formatDateUnix } from './helpers.js';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    ShowValue,
    ShowRange,
  },
  data() {
    return {
      startDate: '',
      endDate: '',
      submitValue: '',
      today: new Date().toLocaleDateString('en-ca'),  // Prevent user to select dates from the future
      minDate: '2013-04-28'
    };
  },
  methods: {
    // Get data from form inputs to be used in ShowRange component
    // Also format the date as UNIX timestamp
    submitRange() {
      // Check that dates are input
      if (this.$refs.startDate.value && this.$refs.endDate.value) {
        // Swap dates by destructuring if they are backwards
        if (this.$refs.startDate.value > this.$refs.endDate.value) {
          [this.$refs.startDate.value, this.$refs.endDate.value] = [this.$refs.endDate.value, this.$refs.startDate.value]
        }
        this.startDate = formatDateUnix(this.$refs.startDate.value);
        this.endDate = formatDateUnix(this.$refs.endDate.value);
        this.submitValue = Math.random();
      }
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
  min-height: 100vh;
  max-width: 50%;
  margin: auto;
}
.rangeSelector {
  text-align: left;
}
</style>
