<template>
  <div class="form">
    <LoginForm />
  </div>
</template>

<script>
import LoginForm from "../../components/LoginForm";

export default {
  components: {
    LoginForm
  }
};
</script>

<style>
.form {
  width: 100%;
  margin-top: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
