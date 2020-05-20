<template>
  <div>
    <AppHeader />
    <nuxt />
  </div>
</template>

<script>
import AppHeader from "../components/AppHeader";
export default {
  head: {
    script: [
      {
        src:
          "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js"
      }
    ]
  },
  components: {
    AppHeader
  }
};
</script>

<style>
html {
  overflow-x: hidden;
}
body {
  background-color: black;
}
* {
  color: white;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
a {
  text-decoration: none;
}
</style>
