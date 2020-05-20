<template>
  <div class="loading">
    <div class="info">
      <div>
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
      </div>
      <h3 class="text">SEARCHING FOR DRIVERS</h3>
    </div>

    <nuxt-link to="/ride" class="cancel">
      <svg
        width="52"
        height="52"
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.6673 14.6672L38.0018 38.0017M38.0018 14.6672L14.6673 38.0017"
          stroke="white"
          stroke-width="3"
          stroke-linecap="round"
        />
      </svg>
    </nuxt-link>
    <!-- <button @click="closeSocket()" class="cancel">
      <svg
        width="52"
        height="52"
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.6673 14.6672L38.0018 38.0017M38.0018 14.6672L14.6673 38.0017"
          stroke="white"
          stroke-width="3"
          stroke-linecap="round"
        />
      </svg>
    </button> -->
  </div>
</template>

<script>
export default {
  head: {
    script: [
      {
        src:
          "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js"
      }
    ]
  },
  props: {
    sock: { type: Object }
  },
  methods: {
    closeSocket() {
      this.sock.disconnect();

      // Removing User (Passenger) from location DB
      var myHeaders = new Headers();

      myHeaders.append(
        "Authorization",
        "Bearer " + JSON.parse(localStorage.data).token
      );

      var requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
      };

      fetch("http://localhost:4001/stop", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log("error", error));
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Inter&display=swap");

.loading {
  width: 100%;
  height: calc(85vh - 1rem);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  font-family: "Inter", sans-serif;
}

.spinner {
  animation: spin 2.3s ease-in-out infinite;
  transform-origin: center;
}

.info {
  height: 20%;
  display: flex;
  font-size: 1.2em;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.text {
  letter-spacing: 0.35rem;
  font-size: 0.6em;
}

.cancel {
  background-color: red;
  border-radius: 2rem;
  border: none;
  padding: 0.15rem;
  align-items: center;
  cursor: pointer;
}

.cancel:focus {
  outline: none;
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
