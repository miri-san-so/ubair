<template>
  <div>
    <div v-if="driverConnected == true">
      <DisplayDriverInfo :socket="socket" :driverInfo="driverInfo" />
    </div>
    <div v-if="driverConnected == false">
      <Loading :sock="this.socket" />
    </div>
  </div>
</template>

<script>
import Loading from "../../components/Loading.vue";
import DisplayDriverInfo from "../../components/DisplayDriverInfo.vue";

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
    removeFromQueue() {
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
    },
    getRideId() {
      var myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        "Bearer " + JSON.parse(localStorage.data).token
      );

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow"
      };

      fetch("http://localhost:4001/rideId", requestOptions)
        .then(response => response.text())
        .then(result => {
          this.id = JSON.parse(result)._id;
          this.phone_number = JSON.parse(result).phone_number;
        })
        .catch(error => console.log("error", error));
    }
  },
  data() {
    return {
      socket: {
        type: Object
      },
      id: "",
      phone_number: 0,
      driverConnected: false,
      driverInfo: {}
    };
  },
  components: {
    Loading,
    DisplayDriverInfo
  },
  created() {
    this.getRideId;
  },
  mounted() {
    setTimeout(() => {
      this.socket = io("http://localhost:4005/trip", {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: Infinity
      });

      this.socket.on("connect", () => {
        console.log("connected");
      });

      this.socket.emit("join_room", {
        token: JSON.parse(localStorage.data).token,
        num: JSON.parse(localStorage.data).phone_number
      });

      this.socket.on("driverConnected", data => {
        let d = data;
        if (d.driver.type == "driver") {
          this.driverConnected = true;
          this.driverInfo = d;
        }
      });

      this.socket.on("tokenExpired", data => {
        if (data == true) {
          localStorage.clear();
          this.$router.push({ path: "/login" });
        }
      });

      this.socket.on("disconnect", () => {
        this.removeFromQueue;
        console.log("disconnected");
      });

      // this.socket.on("started", data => {
      //   console.log("on started");
      //   console.log(data);
      // });
    }, 200);
  },
  beforeDestroy() {
    this.socket.disconnect();
  }
};
</script>

<style></style>
