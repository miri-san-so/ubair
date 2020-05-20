<template>
  <div class="init">
    <div v-if="selected == false" class="register-as">
      <h1>Register as?</h1>
      <button @click="changeFormToPassenger()">
        As Passenger
      </button>
      <button @click="changeFormToDriver()">As Driver</button>
    </div>
    <div class="form">
      <div class="passenger-form">
        <PassengerRegistration v-if="this.passenger == true" />
      </div>
      <div class="driver-form">
        <DriverRegistration v-if="this.passenger == false" />
      </div>
    </div>
  </div>
</template>

<script>
import PassengerRegistration from "../../components/PassengerRegistration";
import DriverRegistration from "../../components/DriverRegistration";

export default {
  methods: {
    changeFormToPassenger() {
      this.passenger = true;
      this.selected = true;
    },
    changeFormToDriver() {
      this.passenger = false;
      this.selected = true;
    }
  },
  data() {
    return {
      passenger: null,
      selected: false
    };
  },
  components: {
    PassengerRegistration,
    DriverRegistration
  }
};
</script>

<style scoped>
.register-as button {
  border: 1px solid white;
  background-color: transparent;
  padding: 1rem 0;
  width: 30%;
  margin: 1rem 0;
  background: linear-gradient(
    to left,
    rgb(0, 0, 0) 50%,
    rgb(255, 255, 255) 50%
  );
  background-size: 200% 100%;
  background-position: right bottom;
  margin-left: 10px;
  transition: all 300ms ease-in;
  cursor: pointer;
}

.register-as button:hover {
  background-position: left bottom;
  color: black;
}

h1 {
  font-family: "Inter";
  font-weight: 400;
  font-size: 2rem;
  margin-bottom: 1rem;
}

button:focus {
  outline: none;
}

.fill {
  background-color: #00ff85;
  color: black;
}

.form,
.init,
.register-as {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.register-as {
  width: 100%;
}

.form {
  margin-top: 2rem;
}
</style>
