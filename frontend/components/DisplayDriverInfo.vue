<template>
  <div>
    <div v-if="tripCompleted == true">
      <PassengerCompletedTrip
        :trip="trip"
        :socket="socket"
        :driverInfo="driverInfo"
      />
    </div>
    <div v-if="tripCompleted == false" class="Info">
      <span class="notification" v-if="notif == true">{{ notif_msg }}</span>

      <h1>YOUR DRIVER</h1>
      <div class="driver">
        <h2>{{ driverInfo.driver.name }}</h2>
        <input
          :value="driverInfo.driver.phone_number"
          readonly
          id="phn"
          @click="copyNumber"
        />
      </div>
      <div class="location">
        <h5>
          Currently At :
          <span>{{ driverInfo.locationInfo.address.label }}</span>
        </h5>
        <h5>
          Vehice : <span>{{ driverInfo.carInfo.vehicle }}</span>
        </h5>
      </div>
      <div class="plate">
        <h5>
          License Plate :
          <span class="plate-span">{{
            driverInfo.carInfo.vehicle_number
          }}</span>
        </h5>
      </div>
      <div class="control">
        <span v-if="tripStarted === false" class="margin-top start"
          >TRIP IS NOT STARTED</span
        >
        <span v-if="tripStarted === true" class="margin-top start started"
          >TRIP HAS STARTED</span
        >
        <button
          v-if="tripStarted === true"
          @click="exit"
          class="margin-top cancel"
        >
          CANCEL TRIP
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import PassengerCompletedTrip from "./PassengerCompletedTrip";

export default {
  name: "DisplayDriverInfo",
  props: { driverInfo: { type: Object }, socket: { type: Object } },
  components: { PassengerCompletedTrip },
  data() {
    return {
      notif: false,
      notif_msg: "",
      tripStarted: false,
      tripCompleted: false,
      received: false,
      cancelFare: "",
      trip: {}
    };
  },
  methods: {
    copyNumber() {
      /* Get the text field */
      var copyText = document.getElementById("phn");

      /* Select the text field */
      copyText.select();
      copyText.setSelectionRange(0, 99999); /*For mobile devices*/

      /* Copy the text inside the text field */
      document.execCommand("copy");

      this.notif = true;
      setTimeout(() => (this.notif = false), 2000);
      this.notif_msg = "Copied the Phone Number";
    },
    exit() {
      let id = JSON.parse(localStorage.data).phone_number;
      let data = true;
      this.socket.emit("cancelByPassenger", id, data);
    }
  },
  mounted() {
    this.socket.on("started", data => {
      if (data == true) {
        this.tripStarted = data;
        window.navigator.vibrate(300);
      }
    });

    this.socket.on("completed", (data, trip) => {
      console.log("completed");
      if (data == true) {
        this.trip = trip;
        this.tripCompleted = data;
        window.navigator.vibrate([300, 300]);
      }
    });

    this.socket.on("tripData", data => {
      console.log("drop it...", data);
      this.trip = data;
    });
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Montserrat&display=swap");

.notification {
  margin: 1em 0;
  background: #00ff85;
  padding: 1em;
  text-align: center;
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  animation: sad 3s ease-in-out forwards;
  color: black;
  font-weight: bold;
}

@keyframes sad {
  0% {
    opacity: 0;
    bottom: 0;
  }
  30% {
    opacity: 1;
    bottom: 1rem;
  }
  80% {
    opacity: 1;
    bottom: 1rem;
  }
  100% {
    opacity: 0;
    bottom: 0;
  }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

input {
  background-color: transparent;
  border: none;
}

input:focus {
  border: none;
  outline: none;
}

.start {
  width: 100%;
  border: 1px solid gray;
  color: gray;
  margin-bottom: 1em;
  padding: 0.6rem;
  text-align: center;
  transition: all 300ms ease-in-out;
  /* grid-row: 6; */
  display: flex;
  justify-content: center;
  align-items: center;
  height: min-content;
  opacity: 0;
  animation: slide_in 400ms ease-in-out 1500ms forwards;
}

.control {
  grid-row: 7;
}

.started {
  background-color: #00ff85;
  color: #1d0c0c;
  transition: all 300ms ease-in-out;
}

.cancel {
  background-color: #ff3a3a;
  color: #fff;
  width: 100%;
  padding: 0.8rem;
  font-weight: bold;
  letter-spacing: 0.1em;
  font-size: 1rem;
  /* grid-row: 7; */
  height: min-content;
  opacity: 0;
  animation: slide_in 400ms ease-in-out 1800ms forwards;
}

.margin-top {
  margin-top: 1rem;
}

h1 {
  font-family: Montserrat;
  font-size: 0.8em;
  font-weight: lighter;
  letter-spacing: 0.25em;
  margin-bottom: 1em;
  padding-left: 1em;
  border-left: 1px solid #00ff85;
  opacity: 0;
  animation: slide_right 400ms ease-in-out forwards;
}

.Info {
  padding: 0 2rem;
  font-family: "Inter", sans-serif;
  height: calc(85vh - 1rem);
  display: grid;
  grid-template-rows: 0.05fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
}

.driver {
  opacity: 0;
  animation: slide_in 500ms ease-in-out 200ms forwards;
  margin-bottom: 1em;
}

h2 {
  font-size: 2em;
}

.location {
  opacity: 0;
  animation: slide_in 400ms ease-in-out 500ms forwards;
  padding: 0;
  font-weight: lighter;
}

.plate {
  opacity: 0;
  animation: slide_in 400ms ease-in-out 1000ms forwards;
}

.plate-span {
  background-color: yellow;
  color: black;
  font-weight: bold;
  padding: 0.3em 0.5em;
}

h5 {
  margin-bottom: 1em;
  margin-top: 2em;
}

span {
  font-weight: lighter;
  font-weight: 400;
}

@keyframes slide_in {
  0% {
    transform: translateY(0.8rem);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide_right {
  0% {
    opacity: 0;
    transform: translateX(-0.8rem);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
