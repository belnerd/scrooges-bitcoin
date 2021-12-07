<template>
  <div>
    <div class="row">
      <Header class="header col-12" />
    </div>
    <div class="row">
      <ShowValue class="col-3" style="width: fit-content" />
      <div class="col-9" style="width: fit-content">
        <RangeForm @submitRange="handleSubmit" />
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
import RangeForm from './components/RangeForm.vue';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    ShowValue,
    ShowRange,
    RangeForm,
  },
  data() {
    return {
      startDate: '',
      endDate: '',
      submitValue: '',
    };
  },
  errorCaptured: function (err) {
    console.log('Caught error: ', err.message);
    return false;
  },
  methods: {
    // Handle data received from RangeForm component
    handleSubmit(event) {
      this.startDate = event.startDate;
      this.endDate = event.endDate;
      this.submitValue = event.submitValue;
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
