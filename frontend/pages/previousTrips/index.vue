<template>
  <div>
    <PreviousTripsCard
      :trip="prevTrip"
      v-for="prevTrip in trips"
      :key="prevTrip._id"
    />
  </div>
</template>

<script>
import PreviousTripsCard from "../../components/PreviousTripsCard";

export default {
  data() {
    return {
      trips: { type: Object }
    };
  },
  components: { PreviousTripsCard },
  mounted() {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "Bearer " + JSON.parse(localStorage.data).token
    );

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch("http://localhost:4002/getTrips", requestOptions)
      .then(response => response.text())
      .then(result => {
        this.trips = JSON.parse(result);
        return;
      })
      .catch(error => console.log("error", error));
  }
};
</script>

<style></style>
