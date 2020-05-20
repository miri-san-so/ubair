<template>
  <div class="index">
    <div class="mid">
      <div class="heroImg">
        <svg
          width="278"
          height="360"
          viewBox="0 0 278 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.3628 360V186.003V102.408H267.955V360M201.293 360C201.293 360 201.293 289.083 201.293 195.745C201.293 102.408 80.1777 102.408 80.1777 195.745C80.1777 289.083 80.1777 340.83 80.1777 360"
            stroke="white"
          />
          <rect
            x="4.5"
            y="282.5"
            width="83"
            height="5"
            rx="2.5"
            fill="black"
            stroke="white"
          />
          <rect
            x="194.356"
            y="282.778"
            width="83"
            height="4.92165"
            rx="2.46082"
            fill="black"
            stroke="white"
          />
          <rect
            x="4.5"
            y="202.5"
            width="83"
            height="5"
            rx="2.5"
            fill="black"
            stroke="white"
          />
          <rect
            x="194.356"
            y="202.096"
            width="83"
            height="4.92165"
            rx="2.46082"
            fill="black"
            stroke="white"
          />
          <path
            d="M0.5 86.4619C0.5 82.872 3.41015 79.9619 7 79.9619H270.577C274.167 79.9619 277.077 82.872 277.077 86.4619V102.648H0.5V86.4619Z"
            stroke="white"
          />
          <path
            d="M26.4072 70.1773C26.4072 66.5875 29.3174 63.6773 32.9072 63.6773H244.67C248.26 63.6773 251.17 66.5875 251.17 70.1773V79.702H26.4072V70.1773Z"
            stroke="white"
          />
          <path
            d="M38.9907 33.167C38.9907 29.5771 41.9009 26.667 45.4907 26.667H232.087C235.676 26.667 238.587 29.5771 238.587 33.167V63.4175H38.9907V33.167Z"
            stroke="white"
          />
          <path
            d="M90.8052 25.8041C90.8052 20.5574 95.0585 16.3041 100.305 16.3041H176.532C181.779 16.3041 186.032 20.5574 186.032 25.8041V26.4072H90.8052V25.8041Z"
            stroke="white"
          />
          <path
            d="M99.5576 16.1742L111.997 7.66186C112.572 7.04502 114.584 5.81134 118.032 5.81134H158.064C161.513 5.81134 163.524 7.04502 164.099 7.66186L176.539 16.1742"
            stroke="white"
          />
          <path
            d="M124.355 5.81134L129.02 1.79308C129.235 1.52872 129.99 1 131.283 1H146.295C147.588 1 148.342 1.52872 148.558 1.79308L153.223 5.81134"
            stroke="white"
          />
          <circle cx="92.5258" cy="46.8928" r="6.90206" stroke="white" />
          <circle cx="188.012" cy="46.8928" r="6.90206" stroke="white" />
          <rect
            x="110.791"
            y="40.731"
            width="58.9567"
            height="11.5835"
            stroke="white"
          />
          <circle cx="42.9319" cy="126.835" r="10.6031" stroke="white" />
          <circle cx="233.905" cy="126.835" r="10.6031" stroke="white" />
        </svg>
      </div>
      <h1 class=".tag-line">MULTISTATIONAL RIDE-HAILING SERVICE</h1>
    </div>
    <AuthFooter />
  </div>
</template>

<script>
import AuthFooter from "../components/AuthFooter.vue";

export default {
  components: {
    AuthFooter
  },
  mounted() {
    if (localStorage.data != undefined) {
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
                window.location = "http://localhost:3000/drive";
              } else if (decoded_token.type == "passenger") {
                window.location = "http://localhost:3000/ride";
              } else {
                console.log("what");
              }
            }
            if (JSON.parse(result).message == "Token Expired") {
              localStorage.clear();
            }
          })
          .catch(error => console.log("error", error));
      }
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Inter:400,600&display=swap");

* {
  font-family: "Inter", sans-serif;
  background-color: black;
}

.heroImg,
.mid {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  text-align: center;
}

.mid {
  height: calc(75vh);
}

h1 {
  font-size: 0.8rem;
  font-weight: 400;
  letter-spacing: 0.25em;
}

@media (max-width: 700px) {
  svg {
    width: 70%;
  }
  h1 {
    font-size: 0.6em;
  }
}
</style>
