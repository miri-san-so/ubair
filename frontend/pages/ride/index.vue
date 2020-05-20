<template>
  <form @submit.prevent="findDrivers">
    <span class="notification" v-if="notif == true">{{ notif_msg }}</span>

    <div class="location">
      <div class="map"></div>
      <div class="location-info">
        <div class="pickup-div">
          <fieldset>
            <legend>Pick Up</legend>
            <input type="text" name="pickup" id="pickup" />
          </fieldset>
          <button type="button" @click="addCurrentLocation" class="add-loc-btn">
            <svg
              width="20"
              height="20"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12.5" cy="12.5" r="10" stroke="white" />
              <circle cx="12.5" cy="12.5" r="4" stroke="white" />
              <path d="M0 13H8" stroke="white" />
              <path d="M17 13H25" stroke="white" />
              <line x1="12.5" x2="12.5" y2="8" stroke="white" />
              <line x1="12.5" y1="17" x2="12.5" y2="25" stroke="white" />
            </svg>
          </button>
        </div>
        <fieldset>
          <legend>Drop Off</legend>
          <input type="text" name="dropoff" id="dropoff" />
        </fieldset>
        <div class="fare">
          <span class="fare-text"
            >Estimated Fare :
            <strong v-if="price != undefined && price != ''"
              >Rs. {{ price }}</strong
            ></span
          >
          <button type="button" @click="getPrice" class="refresh-btn">
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 10.507C1.58685 7.33803 4.80282 1 12.9718 1C21.1408 1 24.1221 7.33803 24.5915 10.507M24.5915 10.507L25.2958 6.74648M24.5915 10.507L21.2959 8.09155"
                stroke="white"
                stroke-width="0.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M25.2959 16C24.709 19.1691 21.4931 25.5071 13.3241 25.5071C5.15505 25.5071 2.17383 19.1691 1.70435 16M1.70435 16L1.00012 19.7606M1.70435 16L5 18.4155"
                stroke="white"
                stroke-width="0.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12.4561 18.5916H13.3779L13.3857 17.6892C15.0771 17.5603 16.0576 16.6619 16.0615 15.3064C16.0576 13.9744 15.0537 13.2673 13.6631 12.9548L13.4326 12.9001L13.4482 10.947C13.9678 11.0681 14.2842 11.4001 14.3311 11.8923H15.9521C15.9326 10.5994 14.9678 9.67358 13.4639 9.50952L13.4717 8.59155H12.5498L12.542 9.50171C11.0146 9.65015 9.93652 10.572 9.94434 11.9041C9.94043 13.0837 10.7725 13.7595 12.124 14.0837L12.499 14.1775L12.4795 16.2439C11.8428 16.1228 11.4131 15.7322 11.3701 15.0798H9.7334C9.77246 16.658 10.8076 17.5408 12.4639 17.6853L12.4561 18.5916ZM13.4014 16.2439L13.417 14.4197C14.0225 14.6111 14.3506 14.8572 14.3545 15.3025C14.3506 15.7751 13.9912 16.1267 13.4014 16.2439ZM12.5107 12.6619C12.0225 12.4939 11.6709 12.24 11.6787 11.7908C11.6787 11.3728 11.9756 11.0486 12.5264 10.9353L12.5107 12.6619Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
        <button
          style="text-align= center;"
          @click="clicked"
          class="find-ride-btn"
          to="/evoked"
        >
          Ok! Find me a ride
        </button>
      </div>
    </div>
    <div ref="loader" class="load">
      <svg
        class="spinner"
        width="43"
        height="43"
        viewBox="0 0 43 43"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M33.8898 7.12678C23.5072 5.61201 16.4276 20.0584 14.1857 27.471L40.9372 25.8502C42.9141 20.2402 44.2723 8.64154 33.8898 7.12678Z"
          stroke="white"
        />
        <path
          d="M35.8734 33.8895C37.3881 23.5069 22.9417 16.4274 15.5292 14.1854L17.1499 40.937C22.7599 42.9139 34.3586 44.2721 35.8734 33.8895Z"
          stroke="white"
        />
        <path
          d="M33.8898 35.8735C23.5072 37.3883 16.4276 22.9419 14.1857 15.5293L40.9372 17.1501C42.9141 22.7601 44.2723 34.3587 33.8898 35.8735Z"
          stroke="white"
        />
        <path
          d="M7.12678 33.8895C5.61201 23.5069 20.0584 16.4274 27.471 14.1854L25.8502 40.937C20.2402 42.9139 8.64154 44.2721 7.12678 33.8895Z"
          stroke="white"
        />
        <path
          d="M9.11088 6.50013C19.4934 4.98537 26.573 19.4318 28.8149 26.8443L2.06344 25.2236C0.0865138 19.6136 -1.27169 8.01489 9.11088 6.50013Z"
          stroke="white"
        />
        <path
          d="M36.5003 9.11094C38.0151 19.4935 23.5687 26.5731 16.1561 28.815L17.7769 2.0635C23.3869 0.0865748 34.9856 -1.27163 36.5003 9.11094Z"
          stroke="white"
        />
        <path
          d="M9.11088 36.5001C19.4934 38.0149 26.573 23.5685 28.8149 16.156L2.06344 17.7767C0.0865138 23.3867 -1.27169 34.9854 9.11088 36.5001Z"
          stroke="white"
        />
        <path
          d="M6.50031 9.11094C4.98555 19.4935 19.4319 26.5731 26.8445 28.815L25.2237 2.0635C19.6138 0.0865761 8.01508 -1.27163 6.50031 9.11094Z"
          stroke="white"
        />
      </svg>
      <!-- <h3>Loading...</h3> -->
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      userLocation: {},
      price: "",
      notif: false,
      notif_msg: "",
      isClicked: false
    };
  },
  methods: {
    clicked() {
      this.isClicked = true;
    },
    addCurrentLocation() {
      navigator.geolocation.getCurrentPosition(data => {
        this.userLocation = data.coords;
        let pickupInput = document.getElementById("pickup");
        pickupInput.value =
          this.userLocation.latitude + ", " + this.userLocation.longitude;
      });
    },
    findDrivers(event) {
      if (this.isClicked == true) {
        let inputs = event.target.querySelectorAll("input");
        let pickup = inputs[0].value;
        let dropoff = inputs[1].value;
        if (
          pickup.replace(/[ ]/g, "") == "" ||
          dropoff.replace(/[ ]/g, "") == ""
        ) {
          this.notif = true;
          setTimeout(() => (this.notif = false), 2000);
          this.notif_msg = "Something Wrong with the input";
        } else {
          // Checking if we got coords or location string

          if (
            pickup.replace(/[ ]/g, "") != "" &&
            dropoff != "" &&
            pickup.match(/\d{0,3}[.]\d{3,}[,](| )\d{0,3}[.]\d{3,}/g) != null
          ) {
            let lat_and_long = pickup.replace(/[ ]/g, "").split(",");
            var myHeaders = new Headers();
            myHeaders.append(
              "Authorization",
              "Bearer " + JSON.parse(localStorage.data).token
            );
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
              lat: lat_and_long[0],
              long: lat_and_long[1],
              drop_location: dropoff
            });

            localStorage.setItem("trip", raw);

            var requestOptions = {
              method: "POST",
              headers: myHeaders,
              body: raw,
              redirect: "follow"
            };

            fetch("http://localhost:4001/", requestOptions)
              .then(response => response.text())
              .then(result => {
                localStorage.setItem("trip", result);
                console.log(result);
                console.log("change page");
                this.$router.push({ name: "evoked" });
              })
              .catch(error => console.log("error", error));
          } else {
            var myHeaders = new Headers();
            myHeaders.append(
              "Authorization",
              "Bearer " + JSON.parse(localStorage.data).token
            );
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
              pickup_loc: pickup,
              drop_location: dropoff
            });

            var requestOptions = {
              method: "POST",
              headers: myHeaders,
              body: raw,
              redirect: "follow"
            };

            fetch("http://localhost:4001/", requestOptions)
              .then(response => {
                response.text();
              })
              .then(result => {
                console.log(result);
                localStorage.setItem("trip", result);
                this.$router.push({ name: "evoked" });
              })
              .catch(error => console.log("error", error));
          }
        }
      }
    },
    getPrice(event) {
      this.$refs["loader"].setAttribute("style", "display: grid;");

      document
        .querySelector(".refresh-btn")
        .setAttribute(
          "style",
          "transition: all 300ms ease;transform: rotateZ(360deg);"
        );

      setTimeout(() => {
        document.querySelector(".refresh-btn").setAttribute("style", "");
      }, 300);

      let pickup = document.getElementById("pickup").value;
      let dropoff = document.getElementById("dropoff").value;
      if (
        pickup.replace(/[ ]/g, "") != "" &&
        dropoff != "" &&
        pickup.match(/\d{0,3}[.]\d{3,}[,](| )\d{0,3}[.]\d{3,}/g) != null
      ) {
        let lat_and_long = pickup.replace(/[ ]/g, "").split(",");
        var myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          "Bearer " + JSON.parse(localStorage.data).token
        );
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          lat: lat_and_long[0],
          long: lat_and_long[1],
          drop_location: dropoff
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
            if (JSON.parse(result).message != undefined) {
              this.notif = true;
              setTimeout(() => (this.notif = false), 3000);
              this.notif_msg = JSON.parse(result).message;
              this.price = "";
              this.$refs["loader"].setAttribute("style", "display: none;");
            }
            if (JSON.parse(result).price != undefined) {
              this.price = JSON.parse(result).price;
              this.$refs["loader"].setAttribute("style", "display: none;");
            }
          })
          .catch(error => console.log("error", error));
      } else if (
        pickup.replace(/[ ]/g, "") != "" &&
        dropoff != "" &&
        pickup.match(/\d{0,3}[.]\d{3,}[,](| )\d{0,3}[.]\d{3,}/g) == null
      ) {
        var myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          "Bearer " + JSON.parse(localStorage.data).token
        );
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
          pickup_loc: pickup,
          drop_location: dropoff
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
            if (JSON.parse(result).message != undefined) {
              this.notif = true;
              setTimeout(() => (this.notif = false), 3000);
              this.notif_msg = JSON.parse(result).message;
              this.$refs["loader"].setAttribute("style", "display: none;");
            }
            if (JSON.parse(result).price != undefined) {
              this.price = JSON.parse(result).price;
              this.$refs["loader"].setAttribute("style", "display: none;");
            }
          })
          .catch(error => console.log("error", error));
      } else {
        this.notif = true;
        setTimeout(() => (this.notif = false), 2000);
        this.notif_msg = "Something Wrong with the input";
        this.$refs["loader"].setAttribute("style", "display: none;");
      }
    }
  },
  mounted() {
    if (localStorage.data == undefined) {
      this.$router.push({ path: "/login" });
      // window.location = "http://localhost:3000/login";
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
            if (JSON.parse(result).message == "Token Expired") {
              localStorage.clear();
              window.location = "http://localhost:3000/login";
            }
          })
          .catch(error => console.log("error", error));
      }
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Inter:400,700&display=swap");

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
  animation: sad 3s ease-in-out forwards;
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

.load {
  display: none;
  justify-content: center;
}

.load h3 {
  font-weight: 400;
  font-size: 1em;
  margin-top: 1em;
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: "Inter", sans-serif;
}

.location {
  padding: 0 2rem;
}
form {
  display: grid;
  height: calc(85vh - 1rem);
}

@media (min-width: 700px) {
  form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /* width: 40vw; */
    width: 50%;
    display: grid;
  }
}

fieldset {
  flex-grow: 1;
  padding: 0.55rem 0.2rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

button {
  background-color: transparent;
  border: none;
}

button:focus {
  outline: none;
}

legend {
  margin-left: 0.8rem;
  padding: 0 5px;
}
input {
  width: calc(100% - 1rem);
  margin-left: 0.5rem;
  background-color: transparent;
  font-size: 1em;
  border: none;
  margin-bottom: 0.3rem;
}

input:focus {
  outline: none;
}

.location-info {
  display: flex;
  flex-direction: column;
}

.fare {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.find-ride-btn {
  width: 100%;
  padding: 1rem 1rem;
  color: #000;
  background: #00ff85;
  border-radius: 0.5rem;
  text-align: center;
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 0.8rem;
  letter-spacing: 0.2em;
}

.refresh-btn {
  transition: transform 300ms ease-in;
}
/* .refresh-btn:focus {
  transform: rotateZ(360deg);
} */

.add-loc-btn {
  border: 1px solid white;
  padding: 1rem 1rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  margin-left: 1em;
  height: 3.5rem;
  align-self: flex-end;
}

.pickup-div {
  display: flex;
}

.spinner {
  animation: spin 2.3s ease-in-out infinite;
  transform-origin: center;
  place-self: center;
  margin-top: 2rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
