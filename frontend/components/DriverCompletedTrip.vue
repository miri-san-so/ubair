<template>
  <div class="info">
    <div class="payment-request">
      <span>Please Collect The Money From The Passenger</span>
    </div>

    <div class="payment-info">
      <h3>TRIP COMPLETED</h3>
      <h1 v-if="cancelFare == undefined">Rs. {{ tripFare.toFixed(2) }}</h1>
      <h1 v-if="cancelFare != undefined">Rs. {{ cancelFare }}</h1>
      <button @click="received" class="received">RECEIVED</button>
    </div>

    <div class="rating">
      <h3>RATE Passenger</h3>
      <div>
        <input
          :disabled="!is_received"
          type="range"
          min="1"
          max="5"
          value="1"
          class="slider"
          id="rating"
          @change="ratingVal"
        />
        <span class="rating_text" v-if="rating_value == 1"
          >😭 &nbsp; Really Bad</span
        >
        <span class="rating_text" v-if="rating_value == 2"
          >😔 &nbsp; Not So Good</span
        >
        <span class="rating_text" v-if="rating_value == 3">😐 &nbsp; Ok</span>
        <span class="rating_text" v-if="rating_value == 4">😄 &nbsp; Good</span>
        <span class="rating_text" v-if="rating_value == 5"
          >😝 &nbsp; Awesome</span
        >
      </div>
    </div>
    <button :disabled="!is_received" @click="exit" class="btn">
      EXIT
      <svg
        width="10"
        height="13"
        viewBox="0 0 10 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M1 1L8.5 7L1 12.5" stroke="black" />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: "PassengerCompletedTrip.vue",
  data() {
    return {
      rating_value: null,
      is_received: false,
      tripFare: 0
    };
  },
  props: {
    socket: { type: Object },
    passengerInfo: { type: Object },
    cancelFare: { type: String, default: null },
    trip: { type: Object }
  },
  methods: {
    received() {
      this.is_received = true;
      console.log("recieved");
      let data = true;
      let id = this.passengerInfo.phone_number;
      this.socket.emit("receive", id, data);
    },
    exit() {
      this.socket.disconnect();
      var myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        "Bearer " + JSON.parse(localStorage.data).token
      );
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        phone_number: this.passengerInfo.phone_number,
        rating_value: Number(this.rating_value)
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      fetch("http://localhost:4002/rating", requestOptions)
        .then(response => response.text())
        .then(result => {
          this.$router.push({ path: "/profile" });
        })
        .catch(error => console.log("error", error));
    },
    ratingVal(event) {
      this.rating_value = event.target.value;
    }
  },

  created() {
    // Getting Trip's Fare
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "Bearer " + JSON.parse(localStorage.data).token
    );
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ tripId: this.trip._id });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("http://localhost:4003/completed", requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result);
        this.tripFare = JSON.parse(result).fare;
      })
      .catch(error => console.log("error", error));
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@600;700&family=Montserrat:ital,wght@0,700;1,500&display=swap");
* {
  font-family: "Inter", sans-serif;
}

.slidecontainer {
  width: 100%;
}

.slider {
  -webkit-appearance: none;
  width: calc(100vw - 4rem);
  height: 0.1rem;
  border-radius: 5px;
  background: #ffffff;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  margin-bottom: 3rem;
  margin-top: 2rem;
}

.slider:hover {
  opacity: 1;
}

h1 {
  font-weight: bold;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 1rem;
  height: 1rem;
  background: #fff;
  cursor: pointer;
  border-radius: 0.5rem;
}

.slider::-moz-range-thumb {
  width: 1rem;
  height: 1rem;
  border-radius: 0.5rem;
  background: #fff;
  cursor: pointer;
}

svg {
  transform: translateY(3px);
  margin-left: 1rem;
}

span {
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.7rem;
  border: 1px solid #4c4c4c;
  font-weight: 500;
  font-family: "Montserrat", sans-serif;
  margin-bottom: 2rem;
}

.info {
  padding: 0 2rem;
  height: calc(85vh - 1rem);
  display: grid;
  grid-template-rows: 1fr 2fr 2.5fr 0.5fr 1fr;
  gap: 1rem;
}

.payment-request {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.received {
  height: max-content;
  place-self: self-start;
}

.payment-info {
  display: grid;
}

.rating_text {
  font-size: 1rem;
  border-radius: 2.5rem;
  padding: 1rem 2rem;
  align-self: center;
  opacity: 0;
  animation: slideup 300ms ease-in-out forwards;
}

h3 {
  font-family: "Montserrat", sans-serif;
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.5em;
}

.rating {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

button {
  font-family: "Montserrat", sans-serif;
  width: max-content !important;
  padding: 1rem 1.5rem;
  background-color: #00ff85;
  border: 1px solid #4c4c4c;
  color: black;
  font-weight: 500;
  text-align: center;
  border-radius: 5px;
  justify-self: self-end;
  height: fit-content;
  grid-row: 5;
}

button:disabled {
  filter: grayscale(50);
}

.btn {
  transition: 300ms ease-in-out finite;
}

@keyframes slideup {
  0% {
    opacity: 0;
    margin-left: -50px;
  }
  100% {
    opacity: 1;
    margin-left: 0;
  }
}
</style>
