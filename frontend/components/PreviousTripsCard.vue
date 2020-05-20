<template>
  <div class="card" :id="trip.id">
    <div class="margin-bottom pickup-info">
      <h3 class="bold">Pickup:</h3>
      <h4>{{ trip.pickup_label }}</h4>
    </div>

    <div class="margin-bottom drop-info">
      <h3 class="bold">Dropoff:</h3>
      <h4>{{ trip.dropoff_label }}</h4>
    </div>

    <span class="margin-bottom bold">
      fare was Rs.{{ Number(trip.trip_fare).toFixed(2) }}</span
    >

    <span class="margin-bottom bold">{{ trip.trip_info }}</span>
  </div>
</template>

<script>
export default {
  name: "PreviousTripsCard",
  props: { trip: {} }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Inter:400,600&display=swap");
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
  /* background: linear-gradient(
    300.68deg,
    #0f0f0f 0%,
    #0f0f0f 0.01%,
    rgba(0, 0, 0, 0) 92.06%
  ); */
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

.data {
  font-weight: lighter;
}
</style>
