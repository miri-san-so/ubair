<template>
  <div class="all">
    <span class="notification" v-if="notif == true">{{ notif_msg }}</span>

    <div v-if="selectedTrip != ''" class="passengers">
      <DriverSocket :socket="socket" :tripDetails="selectedTrip" />
    </div>
    <div
      v-if="selectedTrip == '' || selectedTrip == undefined"
      class="passengers"
    >
      <span class="pos"><strong>Your Position :</strong> {{ pos }}</span>

      <span v-if="trips.length > 0" class="h3">
        Found <span class="bold">{{ trips.length }} Passenger</span> Nearby
      </span>

      <div class="allTrips">
        <TripCard
          @passengerId="makeConn"
          :trip="trip"
          v-for="trip in trips"
          :key="trip.id"
        />
      </div>

      <button class="find" @click="getPassengers()">Find Me Passengers!</button>
    </div>
  </div>
</template>

<script>
import TripCard from "../../components/TripCard";
import DriverSocket from "../../components/DriverSocket";
export default {
  head: {
    script: [
      {
        src:
          "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js"
      }
    ]
  },
  methods: {
    getPassengers() {
      var myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        "Bearer " + JSON.parse(localStorage.data).token
      );

      var raw = "";

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      fetch("http://localhost:4003/find", requestOptions)
        .then(response => response.text())
        .then(async result => {
          let x = await JSON.parse(result);

          if (x.message == "Token Expired") {
            localStorage.clear();
            this.$router.push({ name: "login" });
          }
          if (x.message == undefined) {
            this.trips = x;
          } else {
            this.notif = true;
            setTimeout(() => (this.notif = false), 2000);
            this.notif_msg = x.message;
            if (x.message === "Cant Find Driver, Try Refreshing page") {
              if (navigator.geolocation != {}) {
                navigator.geolocation.getCurrentPosition(data => {
                  let lat = data.coords.latitude;
                  let long = data.coords.longitude;
                  this.lat = lat;
                  this.long = long;

                  var myHeaders = new Headers();
                  myHeaders.append(
                    "Authorization",
                    "Bearer " + JSON.parse(localStorage.data).token
                  );
                  myHeaders.append("Content-Type", "application/json");

                  var raw = JSON.stringify({ lat, long });
                  var requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: raw,
                    redirect: "follow"
                  };
                  fetch("http://localhost:4001/", requestOptions)
                    .then(response => response.text())
                    .then(result => {
                      let _result = JSON.parse(result);
                      if (_result.doc != undefined)
                        this.pos = JSON.parse(result).doc.address.label;
                      else this.pos = JSON.parse(result).address.label;
                    })
                    .catch(error => console.log("error", error));
                });
              } else {
                this.notif = true;
                setTimeout(() => (this.notif = false), 2000);
                this.notif_msg = "Unable to get your location";
              }
            }
          }
        })
        .catch(error => console.log("error", error));
    },
    makeConn(value) {
      this.selectedTrip = value;
    }
  },
  components: { TripCard, DriverSocket },
  data() {
    return {
      selectedTrip: "",
      trips: [],
      pos: "",
      notif: false,
      notif_msg: "",
      socket: {}
    };
  },
  mounted() {
    if (
      localStorage.passenger_already_accepted != undefined &&
      localStorage.passenger_already_accepted == "true"
    ) {
      this.notif = true;
      setTimeout(() => {
        this.notif = false;
        localStorage.removeItem("passenger_already_accepted");
      }, 2000);
      this.notif_msg = "That Passenger has been Accepted by Someone else";
    }
    if (localStorage.length != 0) {
      let data = JSON.parse(localStorage.data);
      if (data.token) {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + data.token);

        let requestOptions = {
          method: "POST",
          headers: myHeaders,
          redirect: "follow"
        };
        fetch("http://localhost:4000/u/verify", requestOptions)
          .then(response => response.text())
          .then(result => {
            if (JSON.parse(result).message == "Verified") {
              let user = JSON.parse(localStorage.data);
              var base64Url = user.token.split(".")[1];
              var base64 = base64Url.replace("-", "+").replace("_", "/");
              let decoded_token = JSON.parse(window.atob(base64));

              if (decoded_token.type == "driver") {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(data => {
                    let lat = data.coords.latitude;
                    let long = data.coords.longitude;
                    this.lat = lat;
                    this.long = long;

                    var myHeaders = new Headers();
                    myHeaders.append(
                      "Authorization",
                      "Bearer " + JSON.parse(localStorage.data).token
                    );
                    myHeaders.append("Content-Type", "application/json");

                    var raw = JSON.stringify({ lat, long });
                    var requestOptions = {
                      method: "POST",
                      headers: myHeaders,
                      body: raw,
                      redirect: "follow"
                    };
                    fetch("http://localhost:4001/", requestOptions)
                      .then(response => response.text())
                      .then(result => {
                        let _result = JSON.parse(result);
                        if (_result.doc != undefined)
                          this.pos = JSON.parse(result).doc.address.label;
                        else this.pos = JSON.parse(result).address.label;

                        this.socket = io("http://localhost:4005/trip", {
                          reconnection: true,
                          reconnectionDelay: 1000,
                          reconnectionDelayMax: 5000,
                          reconnectionAttempts: Infinity
                        });

                        this.socket.on("connect", () => {
                          console.log("connected");
                        });
                      })
                      .catch(error => console.log("error", error));
                  });
                } else {
                  this.notif = true;
                  setTimeout(() => (this.notif = false), 2000);
                  this.notif_msg = "Unable to get your location";
                }
              } else if (decoded_token.type == "passenger") {
                window.location = "http://localhost:3000/ride";
              } else {
                window.location = "http://localhost:3000";
              }
            }
          })
          .catch(error => console.log("error", error));
      }
    } else {
      window.location = "http://localhost:3000";
    }
  },
  beforeDestroy() {
    this.socket.disconnect();
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Inter:400,800&display=swap");

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
  z-index: 2;
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
  font-family: "Inter", sans-serif;
}

.pos {
  display: flex;
  padding: 2rem;
  font-size: 0.7em;
  margin: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.passengers {
  display: flex;
  margin: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

button:focus {
  outline: none;
}

.allTrips {
  margin-top: 3rem;
  margin-bottom: 10rem;
}

.h3 {
  margin: 1rem 0;
  font-size: 0.8em;
  letter-spacing: 0.25em;
}

.bold {
  font-weight: 800;
}

.all {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.find {
  pointer-events: all;
  cursor: pointer;
  border: none;
  background-color: #00ff85;
  color: black;
  width: 100%;
  font-weight: 600;
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 2rem 1rem;
}
</style>
