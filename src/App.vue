<template>
  <div>
    <div class="row">
      <Header class="header col-12" />
    </div>
    <div class="row">
      <ShowValue class="col-3" style="width: fit-content" />
      <div class="col-9" style="width: fit-content">
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
        <ShowRange
          :startDate="startDate"
          :endDate="endDate"
          :submitValue="submitValue"
        />
      </div>
    </div>
    <div class="row">
      <Footer class="footer col-12" />
    </div>
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
  box-sizing: border-box;
}

html {
  font-family: arial, sans-serif;
}

.header,
.footer {
  background: linear-gradient(to bottom, #007dc1 5%, #0061a7 100%);
  color: #ffffff;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
}

.button {
  margin-top: 10px;
  box-shadow: inset 0px 1px 0px 0px #54a3f7;
  background: linear-gradient(to bottom, #007dc1 5%, #0061a7 100%);
  background-color: #007dc1;
  border-radius: 3px;
  border: 1px solid #124d77;
  display: inline-block;
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

input,
label {
  display: block;
}

input {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 20px;
  color: black;
}
.row::after {
  content: '';
  clear: both;
  display: table;
}

[class*='col-'] {
  float: left;
  padding: 15px;
}

.col-1 {
  width: 8.33%;
}
.col-2 {
  width: 16.66%;
}
.col-3 {
  width: 25%;
}
.col-4 {
  width: 33.33%;
}
.col-5 {
  width: 41.66%;
}
.col-6 {
  width: 50%;
}
.col-7 {
  width: 58.33%;
}
.col-8 {
  width: 66.66%;
}
.col-9 {
  width: 75%;
}
.col-10 {
  width: 83.33%;
}
.col-11 {
  width: 91.66%;
}
.col-12 {
  width: 100%;
}
</style>
