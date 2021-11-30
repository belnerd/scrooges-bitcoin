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
        <button class="button" type="submit">Get data</button>
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
      today: new Date().toLocaleDateString('en-ca'), // Prevent user to select dates from the future
      minDate: '2013-04-28',
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
          [this.$refs.startDate.value, this.$refs.endDate.value] = [
            this.$refs.endDate.value,
            this.$refs.startDate.value,
          ];
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
  min-width: 400px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* position: relative;
  min-height: 100vh; */
  max-width: 50%;
  margin: auto;
  border: 1px solid black;
  padding: 2px;
}
.rangeSelector {
  text-align: left;
}

.button {
  box-shadow: inset 0px 1px 0px 0px #54a3f7;
  background: linear-gradient(to bottom, #007dc1 5%, #0061a7 100%);
  background-color: #007dc1;
  border-radius: 3px;
  border: 1px solid #124d77;
  display: inline-block;
  width: 100%;
  cursor: pointer;
  color: #ffffff;
  font-family: Arial;
  font-size: 13px;
  padding: 6px 24px;
  text-decoration: none;
  text-shadow: 0px 1px 0px #154682;
}
.button:hover {
  background: linear-gradient(to bottom, #0061a7 5%, #007dc1 100%);
  background-color: #0061a7;
}
.button:active {
  position: relative;
  top: 1px;
}

.header {
  background-color: #007dc1;
  color: #ffffff;
}
.footer {
  background-color: #007dc1;
  color: #ffffff;
  margin-top: 100%;
}
</style>
