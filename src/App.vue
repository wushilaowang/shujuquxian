<template>
  <div id="app" :class="'mdui-theme-primary-'+themeColor">
    <router-view></router-view>
  </div>
</template>

<script>
  import Login from "./views/Login";
  export default {
    name: "App",
    data() {
      return {
        themeColor: 'blue-grey'
      }
    },
    components: {
      Login
    }
  }
</script>

<style>
  @import "../node_modules/mdui/dist/css/mdui.css";
  /*@import "assets/css/normalize.css";*/
</style>
