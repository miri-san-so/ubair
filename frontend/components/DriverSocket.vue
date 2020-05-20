<template>
  <div>
    <span class="notification" v-if="notif == true">{{ notif_msg }}</span>
    <div v-if="tripCompleted == true">
      <DriverCompletedTrip
        :cancelFare="cancelFare"
        :passengerInfo="passengerInfo"
        :socket="socket"
        :trip="trip"
      />
    </div>
    <div v-if="tripCompleted == false" class="trip">
      <div v-if="tripStarted == false" class="passengerDetils">
        <strong class="detailsHeading">PASSENGER DETAILS</strong>
        <div class="data">
          <span
            ><strong class="bold">Name: </strong
            >{{ this.passengerInfo.name }}</span
          >
          <span
            ><strong class="bold">Phone Number: </strong
            ><input@click="copyNumber"readonlytype="text"id="phn":value="passengerInfo.phone_number"/></span
          >
        </div>
      </div>
      <div class="TripDetails">
        <strong class="detailsHeading">TRIP DETAILS</strong>
        <div class="data">
          <div class="margin-bottom pickup-info">
            <h3 class="bold">Pickup:</h3>
            <h4>{{ tripDetails.pickup_location.address.label }}</h4>
          </div>

          <div class="margin-bottom drop-info">
            <h3 class="bold">Dropoff:</h3>
            <h4>{{ tripDetails.drop_location.address.label }}</h4>
          </div>

          <span class="margin-bottom bold"
            >Estimated fare is : Rs.{{
              ((tripDetails.trip_distance / 1000) * 17).toFixed(2)
            }}</span
          >

          <span class="margin-bottom bold">{{ tripDetails.trip_info }}</span>
        </div>
      </div>
      <a
        target="_blank"
        rel="noopener noreferrer"
        class="gmap"
        :href="
          'https://www.google.com/maps/dir/' +
            tripDetails.pickup_location.address.label +
            '/' +
            tripDetails.drop_location.address.label
        "
      >
        Google Maps Direction for Trip
      </a>
      <button v-if="tripStarted == false" @click="startTrip" class="green">
        Start Trip
      </button>
      <div class="controls">
        <button
          v-if="tripStarted == true"
          class="cancel-btn btn"
          @click="cancelTrip"
        >
          CANCEL TRIP
        </button>
        <button
          v-if="tripStarted == true"
          class="complete-btn btn"
          @click="completeTrip"
        >
          TRIP COMPLETED
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import DriverCompletedTrip from "./DriverCompletedTrip";
export default {
  name: "DriverSocket",
  components: { DriverCompletedTrip },
  props: {
    tripDetails: { type: Object },
    socket: { type: Object }
  },
  data() {
    return {
      passengerInfo: {},
      num: 0,
      notif: false,
      notif_msg: "",
      tripStarted: false,
      tripCompleted: false,
      cancelFare: null,
      trip: { type: Object }
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
    getPassengerInfo() {
      var myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        "Bearer " + JSON.parse(localStorage.data).token
      );
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({ id: this.tripDetails._id });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      fetch("http://localhost:4003/getTrip", requestOptions)
        .then(response => response.text())
        .then(result => {
          if (result != null) {
            this.passengerInfo = JSON.parse(result);
            this.num = JSON.parse(result).phone_number;
          }
        })
        .catch(error => console.log("error", error));
    },
    startTrip() {
      this.tripStarted = true;
      let data = true;
      let id = this.passengerInfo.phone_number;
      this.socket.emit("start", id, data);
    },
    cancelTrip() {
      if (navigator.geolocation != {}) {
        navigator.geolocation.getCurrentPosition(data => {
          let lat = data.coords.latitude;
          let long = data.coords.longitude;

          var myHeaders = new Headers();
          myHeaders.append(
            "Authorization",
            "Bearer " + JSON.parse(localStorage.data).token
          );
          myHeaders.append("Content-Type", "application/json");

          var raw = JSON.stringify({
            lat: this.trip.pickup_lat,
            long: this.trip.pickup_long,
            dropoff: `${lat}, ${long}`
          });

          var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
          };

          fetch("http://localhost:4001/getPrice", requestOptions)
            .then(response => response.text())
            .then(result => {
              this.cancelFare = JSON.parse(result).fare;

              this.tripCompleted = true;
              let data = true;
              let id = this.passengerInfo.phone_number;
              this.trip.cancelFare = this.cancelFare;
              let trip = this.trip;
              console.log("emitting complete on cancel...");
              this.socket.emit("complete", id, data, trip);

              var myHeaders = new Headers();
              myHeaders.append(
                "Authorization",
                "Bearer " + JSON.parse(localStorage.data).token
              );
              myHeaders.append("Content-Type", "application/json");

              var raw = JSON.stringify({
                _id: this.trip._id,
                cancelFare: this.cancelFare
              });

              var requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
              };

              fetch("http://localhost:4003/cancel", requestOptions)
                .then(response => response.text())
                .then(result => {
                  console.log(result);
                })
                .catch(error => console.log("error", error));
            })
            .catch(error => console.log("error", error));
        });

        // this.socket.emit("complete", id, data);
      }
    },
    completeTrip() {
      this.tripCompleted = true;
      let data = true;
      let id = this.passengerInfo.phone_number;
      let trip = this.trip;
      this.socket.emit("complete", id, data, trip);
      console.log("Do Stuff After Completed");
    }
  },
  created() {
    this.getPassengerInfo();
    const trip = {
      passengerId: this.tripDetails._id,
      driverName: JSON.parse(localStorage.data).name,
      driverPhoneNumber: JSON.parse(localStorage.data).phone_number,
      trip_distance: this.tripDetails.trip_distance,
      pickup_label: this.tripDetails.pickup_location.address.label,
      dropoff_label: this.tripDetails.drop_location.address.label,
      trip_info: this.tripDetails.trip_info
    };

    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "Bearer " + JSON.parse(localStorage.data).token
    );
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(trip);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("http://localhost:4003/accept", requestOptions)
      .then(response => response.text())
      .then(result => {
        this.trip = JSON.parse(result);
        this.$emit("trip", trip);
        let data = this.trip;
        let id = this.passengerInfo.phone_number;
        console.log(this.trip);
        this.socket.emit("trip", id, data);
        if (result != "OK") {
          let x = JSON.parse(result);
          if (x.message == "Passenger Not Available Anymore") {
            localStorage.setItem("passenger_already_accepted", true);
            setTimeout(() => {
              this.$router.push("/");
            }, 100);
          }
        }
      })
      .catch(error => console.log("error", error));
  },
  mounted() {
    setTimeout(() => {
      this.socket.on("connect", () => {
        console.log("connected");
      });
      this.socket.emit("join_room", {
        token: JSON.parse(localStorage.data).token,
        num: this.num
      });

      this.socket.on("newUser", data => {
        console.log(data);
      });
      this.socket.on("disconnect", () => {
        this.removeFromQueue;
        console.log("disconnected");
      });

      this.socket.on("reconnect", () => {
        console.log("reconnecting...");
      });

      this.socket.on("completed", data => {
        console.log("completed");
        if (data == true) {
          this.tripCompleted = data;
          window.navigator.vibrate([300, 300]);
        }
      });

      this.socket.on("pingDriver", data => {
        if (data == true) {
          this.tripCompleted = true;
          let data = true;
          let id = this.passengerInfo.phone_number;
          let trip = this.trip;
          this.socket.emit("complete", id, data, trip);
          console.log("Canceled By Passenger");
        }
      });
    }, 200);
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Montserrat&display=swap");
* {
  font-family: "Inter", sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-weight: 400;
  font-size: 1em;
}

h3 {
  margin-bottom: 0.5rem;
}
h3,
h4 {
  font-size: 0.9em;
}

.bold {
  font-weight: 600;
}

span {
  font-size: 0.85em;
}

.italic {
  font-style: italic;
}

.card {
  word-break: break-all;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  margin: 1rem;
  background: linear-gradient(
    300.68deg,
    #0f0f0f 0.01%,
    rgba(0, 0, 0, 0) 42.67%,
    #0f0f0f 92.06%
  );
  border-radius: 0.8rem;
  margin-bottom: 3rem;
}

button:focus {
  outline: none;
}

.accept {
  border: none;
  background-color: #00ff85;
  color: black;
  width: 80%;
  padding: 1em;
  margin-top: 1em;
  justify-self: center;
  align-self: center;
}

.margin-bottom {
  margin-bottom: 1.3em;
}

.trip {
  display: grid;
  margin: 0 2rem;
}

.data {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.detailsHeading {
  border-left: 1.5px solid #00ffaa;
  padding-left: 1em;
  font-size: 1em;
  font-weight: 600;
  font-family: "Montserrat", sans-serif;
  letter-spacing: 0.15rem;
}

input {
  background-color: transparent;
  color: white;
  border: none;
  user-select: none;
  width: 9em;
}

input:focus {
  outline: none;
  border: none;
}

button {
  width: 100%;
  padding: 0.9em;
  border: none;
}

buton:focus {
  outline: none;
}

.green {
  background-color: #00ff85;
  color: black;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.gmap {
  padding-left: 1em;
  border-left: 1px solid cornflowerblue;
  height: max-content;
}

.red {
  background-color: tomato;
  color: white;
}

.btn {
  color: black;
  background-color: transparent;
  border: none;
  outline: none;
  margin-top: 2rem;
  font-weight: 600;
  letter-spacing: 0.15rem;
  font-size: 0.8em;
}

.btn:focus {
  outline: none;
  border: none;
}

.complete-btn {
  opacity: 0;
  animation: slide_up 300ms ease-in-out 300ms forwards;
  transition: all 300ms ease-in-out;
  background-color: #00ff85;
  margin-bottom: 2rem;
}

.cancel-btn {
  opacity: 0;
  animation: slide_up 300ms ease-in-out forwards;
  transition: all 300ms ease-in-out;
  background-color: #ff3a3a;
  font-weight: bold;
  color: white;
}

.controls {
  width: 100%;
  justify-self: flex-end;
}

.notification {
  margin: 1em 0;
  background: indianred;
  padding: 1em;
  text-align: center;
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  animation: sad 2s ease-in-out forwards;
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

@keyframes slide_up {
  0% {
    opacity: 0;
    transform: translateY(-5%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
