<template>
  <div class="bottom">
    <nuxt-link class="login" to="/login">
      <div class="btn">
        Login
      </div>
    </nuxt-link>
    <span class="line"></span>
    <nuxt-link class="register" to="/register">
      <div class="btn">
        Register
      </div>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  name: "AuthFooter"
};
</script>

<style scoped>
* {
  color: black;
}
.bottom {
  display: flex;
  position: absolute;
  bottom: 0;
}

.line {
  background-color: black;
  height: 3.5em;
  width: 1px;
}

.bottom > a {
  width: 50vw;
  background-color: #00ff85;
  display: flex;
  justify-content: center;
  align-items: center;
}

a:hover {
  background-color: #07bb64;
}

.btn {
  font-weight: 600;
}
</style>
