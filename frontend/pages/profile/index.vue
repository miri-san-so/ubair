<template>
  <div class="data">
    <div class="data-block">
      <h3 class="title">Created at</h3>
      <h3 class="value">{{ created_at }}</h3>
    </div>
    <div class="data-block">
      <h3 class="title">Name</h3>
      <h3 class="value">{{ userData.name }}</h3>
    </div>
    <div class="data-block">
      <h3 class="title">Phone Number</h3>
      <h3 class="value">{{ userData.phone_number }}</h3>
    </div>
    <div class="data-block">
      <h3 class="title">E-mail</h3>
      <h3 class="value">{{ userData.email }}</h3>
    </div>
    <div class="data-block">
      <h3 class="title">Trips</h3>
      <h3 class="value">{{ userData.trips }}</h3>
    </div>
    <div class="data-block">
      <h3 class="title">Rating</h3>
      <h3 class="value">
        {{ rating.toFixed(1) }}
        <svg
          class="star"
          width="15"
          height="14"
          viewBox="0 0 15 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.54894 0.927049C6.8483 0.00573789 8.1517 0.00574044 8.45106 0.927051L9.40837 3.87336C9.54224 4.28538 9.9262 4.56434 10.3594 4.56434H13.4574C14.4261 4.56434 14.8289 5.80395 14.0451 6.37336L11.5389 8.19427C11.1884 8.44892 11.0417 8.90028 11.1756 9.31231L12.1329 12.2586C12.4323 13.1799 11.3778 13.946 10.5941 13.3766L8.08778 11.5557C7.7373 11.3011 7.2627 11.3011 6.91221 11.5557L4.40594 13.3766C3.62222 13.946 2.56774 13.1799 2.8671 12.2586L3.82441 9.3123C3.95828 8.90028 3.81162 8.44892 3.46114 8.19427L0.954859 6.37335C0.171145 5.80395 0.573923 4.56434 1.54265 4.56434H4.64058C5.0738 4.56434 5.45776 4.28538 5.59163 3.87336L6.54894 0.927049Z"
            fill="#FFCF25"
          />
        </svg>
      </h3>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userData: {},
      rating: 0,
      created_at: ""
    };
  },
  mounted() {
    if (localStorage.length) {
      let data = JSON.parse(localStorage.data);

      // Get Profile Request
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + data.token);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      fetch("http://localhost:4002/", requestOptions)
        .then(response => response.text())
        .then(result => {
          let _res = result;
          this.userData = JSON.parse(_res);
          const sum = this.userData.rating.reduce((a, b) => a + b, 0);
          this.rating = sum / this.userData.rating.length || 0;
          this.created_at = this.userData.created_at.split("T")[0];
        })
        .catch(error => console.log("error", error));
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Inter:400,600&display=swap");
* {
  font-family: "Inter", sans-serif;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  flex-grow: 1;
}

.data {
  margin-top: 1rem;
  height: 75vh;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, auto);
}

.data-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem 2rem;
}

.data-block .title {
  font-size: 0.8em;
  font-weight: 400;
  margin-bottom: 1.5em;
  flex-grow: 0;
}

.data-block .value {
  font-size: 1em;
  font-weight: 600;
}

.star {
  margin-left: 0.5em;
}

@media (max-width: 700px) {
  .data {
    display: flex;
    flex-direction: column;
  }
}
</style>
