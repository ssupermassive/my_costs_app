<template>
  <div id="app" class="flexbox justify-content-center">
    <app-layout/>
  </div>
</template>

<script>
import AppLayout from './components/app/AppLayout.vue'

export default {
  name: 'App',
  components: {
    AppLayout
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
}
</style>
