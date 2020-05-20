<template>
  <form @submit.prevent="getFormValues">
    <span class="notification" v-if="notif == true">{{ notif_msg }}</span>
    <label for="phone_number">
      <span class="form-label">
        Phone Number
      </span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="8" cy="8" r="7.5" stroke="#00FF85" />
        <path
          d="M4.47046 8.49803L6.47046 10.498C7.99987 8.6549 8.70575 7.88237 11.5293 5.43921"
          stroke="#00FF85"
        />
      </svg>
    </label>
    <input required type="number" name="phone_number" />

    <label for="password">
      <span class="form-label">
        Password
      </span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="8" cy="8" r="7.5" stroke="#00FF85" />
        <path
          d="M4.47046 8.49803L6.47046 10.498C7.99987 8.6549 8.70575 7.88237 11.5293 5.43921"
          stroke="#00FF85"
        />
      </svg>
    </label>
    <input required type="password" name="password" />

    <div class="type">
      <label class="checkcontainer"
        >Passenger
        <input type="radio" checked="checked" name="radio" value="passenger" />
        <span class="radiobtn"></span>
      </label>

      <label class="checkcontainer"
        >Driver
        <input type="radio" checked="checked" name="radio" value="driver" />
        <span class="radiobtn"></span>
      </label>
    </div>
    <button type="submit" class="submit-btn">
      Login
    </button>
  </form>
</template>

<script>
export default {
  name: "LoginForm",
  data() {
    return {
      notif: false,
      notif_msg: ""
    };
  },
  methods: {
    getFormValues(event) {
      let inputs = event.target.elements;
      let user = {};
      user.phone_number = inputs[0].value;
      user.password = inputs[1].value;
      user.type = inputs.radio.value;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify(user);

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      fetch("http://localhost:4000/u/login", requestOptions)
        .then(response => response.text())
        .then(result => {
          if (JSON.parse(result).message == undefined) {
            localStorage.setItem("data", result);
            if (user.type == "passenger") {
              window.location = "http://localhost:3000/ride";
            } else if (user.type == "driver") {
              window.location = "http://localhost:3000/drive";
            } else {
              this.notif = true;
              setTimeout(() => (this.notif = false), 2000);
            }
          } else {
            // Show notification for erorrs
            this.notif = true;
            setTimeout(() => (this.notif = false), 2000);
            this.notif_msg = JSON.parse(result).message;
          }
        })
        .catch(error => console.log("error", error));
    }
  },
  mounted() {
    if (localStorage.data != undefined) {
      let user = JSON.parse(localStorage.data);
      var base64Url = user.token.split(".")[1];
      var base64 = base64Url.replace("-", "+").replace("_", "/");
      let decoded_token = JSON.parse(window.atob(base64));
      if (decoded_token.exp < Date.now() / 1000) {
        localStorage.clear();
      } else {
        if (decoded_token.type == "driver")
          window.location = "http://localhost:3000/drive";
        else window.location = "http://localhost:3000/ride";
      }
    }
    let x = document.querySelectorAll("input");
    x[0].addEventListener("keyup", e => {
      if (x[0].value.length > 9 && x[0].value.length < 13) {
        x[0].previousElementSibling.children[1].setAttribute(
          "style",
          "filter: none"
        );
      } else {
        x[0].previousElementSibling.children[1].setAttribute(
          "style",
          "filter: greyscale(100%)"
        );
      }
    });

    x[1].addEventListener("keyup", e => {
      if (x[1].value.length > 7) {
        x[1].previousElementSibling.children[1].setAttribute(
          "style",
          "filter: none"
        );
      } else {
        x[1].previousElementSibling.children[1].setAttribute(
          "style",
          "filter: greyscale(100%)"
        );
      }
    });
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Inter|Open+Sans&display=swap");
body {
  background-color: black;
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

/* Delete me if it doesnt work */

.checkcontainer {
  line-height: 20px;
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 17px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.checkcontainer input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}
.radiobtn {
  position: absolute;
  top: 0;
  left: 0;
  height: 15px;
  width: 15px;
  background-color: #eee;
  margin: 2px;
}

/* On mouse-over, add a grey background color */
.checkcontainer:hover input ~ .radiobtn {
  background-color: #ccc;
}

/* When the radio button is checked, add a blue background */
.checkcontainer input:checked ~ .radiobtn {
  background-color: #00a355;
}

/* Create the indicator (the dot/circle - hidden when not checked) */
/* .radiobtn:after {
  content: "";
  position: absolute;
  display: none;
} */

/* Show the indicator (dot/circle) when checked */
.checkcontainer input:checked ~ .radiobtn:after {
  display: block;
}

/* Style the indicator (dot/circle) */
.checkcontainer .radiobtn:after {
  top: 9px;
  left: 9px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}

/* Delete me if it doesnt work */

form {
  width: 80vw;
  display: flex;
  flex-direction: column;
  font-family: "Open Sans", sans-serif;
  justify-content: center;
  margin-bottom: 2rem;
}

label {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: white;
}
label > svg {
  margin-left: 1.5rem;
  filter: grayscale(100%);
}
input {
  background-color: transparent;
  border: none;
  border-bottom: 1px solid white;
  padding: 0.3rem;
  padding-left: 0;
  color: white;
  font-family: "Inter";
  letter-spacing: 0.15rem;
  margin-bottom: 3rem;
}

input:focus {
  outline: none;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin: 0;
}

.type {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 2rem;
}
/* 
.type input, label{
  margin: 0;
}

.type input {
  background: #00FF85;
} */

.submit-btn {
  background-color: transparent;
  color: #00ff85;
  border: none;
  border: 1px solid #00ff85;
  width: 50%;
  padding: 1rem 1rem;
  border-radius: 0.5rem;
  align-self: center;
  font-weight: bold;
  transition: all 300ms ease;
  cursor: pointer;
}

.submit-btn:focus {
  outline: none;
}

.submit-btn:hover {
  background-color: #00ff85;
  color: black;
}

input[type="number"] {
  -moz-appearance: textfield;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

@media (min-width: 700px) {
  form {
    width: 33vw;
  }
  .submit-btn {
    width: 33%;
  }
}
</style>
