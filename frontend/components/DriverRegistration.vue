<template>
  <form @submit.prevent="getFormValues">
    <label for="name">
      <span class="form-label">
        Name
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
    <input required type="text" name="name" />

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

    <label for="email">
      <span class="form-label">
        Email
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
    <input required="true" type="email" name="email" />

    <label for="Vehicle">
      <span class="form-label">
        Vehicle
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
    <input required="true" type="text" name="Vehicle" />

    <label for="Vehicle_Number">
      <span class="form-label">
        Vehicle_Number
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
    <input required="true" type="text" name="Vehicle_Number" />

    <button type="submit" class="submit-btn">
      REGISTER
    </button>
  </form>
</template>

<script>
export default {
  name: "DriverRegistration",
  methods: {
    getFormValues(event) {
      let inputs = event.target.elements;
      let user = {};
      user.name = inputs[0].value;
      user.phone_number = inputs[1].value;
      user.password = inputs[2].value;
      user.email = inputs[3].value;
      user.vehicle = inputs[4].value;
      user.vehicle_number = inputs[5].value;
      user.type = "driver";

      // Creating Request to register
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify(user);

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };
      console.log(user);
      fetch("http://localhost:4000/u/register", requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log(JSON.parse(result));
          window.location = "http://localhost:3000/login";
        })
        .catch(error => console.log("error", error));
    }
  },
  mounted() {
    let x = document.querySelectorAll("input");
    console.log(x);
    x[0].addEventListener("keyup", e => {
      if (x[0].value.length > 1) {
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
      if (/^(|[+]\d{0,2})\d{10,12}$/.test(x[1].value)) {
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

    x[2].addEventListener("keyup", e => {
      if (x[2].value.length > 7) {
        x[2].previousElementSibling.children[1].setAttribute(
          "style",
          "filter: none"
        );
      } else {
        x[2].previousElementSibling.children[1].setAttribute(
          "style",
          "filter: greyscale(100%)"
        );
      }
    });

    x[3].addEventListener("keyup", e => {
      if (
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          x[3].value
        )
      ) {
        x[3].previousElementSibling.children[1].setAttribute(
          "style",
          "filter: none"
        );
      } else {
        x[3].previousElementSibling.children[1].setAttribute(
          "style",
          "filter: greyscale(100%)"
        );
      }
    });

    x[4].addEventListener("keyup", e => {
      if (x[4].value.length > 8) {
        x[4].previousElementSibling.children[1].setAttribute(
          "style",
          "filter: none"
        );
      } else {
        x[4].previousElementSibling.children[1].setAttribute(
          "style",
          "filter: greyscale(100%)"
        );
      }
    });

    x[5].addEventListener("keyup", e => {
      if (x[5].value.length > 5) {
        x[5].previousElementSibling.children[1].setAttribute(
          "style",
          "filter: none"
        );
      } else {
        x[5].previousElementSibling.children[1].setAttribute(
          "style",
          "filter: greyscale(100%)"
        );
      }
    });
  },
  mehtods: {}
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Inter|Open+Sans&display=swap");

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

@media (min-width: 700px) {
  form {
    width: 33vw;
  }
  .submit-btn {
    width: 33%;
  }
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
