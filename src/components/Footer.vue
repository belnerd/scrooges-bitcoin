// A footer component
<template>
  <div class="footer">
    <i class="footer-text">2021 Tapio Ekman</i>
  </div>
</template>

<script>
export default {
  name: 'Footer',
};
</script>

<style scoped>
.footer {
  background-color: lightgrey;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 2.5rem
}

.footer-text {
  justify-content: left;
}

</style>
