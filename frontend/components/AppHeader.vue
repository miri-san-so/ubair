<template>
  <nav>
    <div class="overlay-navigation-menu">
      <button class="close-menu" @click="closeOverlay()">
        <svg
          width="13"
          height="13"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.07107 2.2634L16.2132 16.4055M16.2132 2.2634L2.07107 16.4055"
            stroke="white"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
      </button>
      <div @click="closeOverlay()" class="link-ridenow">
        <nuxt-link to="/">{{ actionText }}</nuxt-link>
      </div>
      <div @click="closeOverlay()" class="link-profile">
        <nuxt-link to="/profile">PROFILE</nuxt-link>
      </div>
      <div @click="closeOverlay()" class="link-previoustrip">
        <nuxt-link to="/previousTrips">PREVIOUS TRIPS</nuxt-link>
      </div>
      <div @click="logout()" class="link-logout">
        <nuxt-link to="/">LOGOUT</nuxt-link>
      </div>
      <div @click="closeOverlay()" class="link-aboutus">
        <nuxt-link to="/">ABOUT US</nuxt-link>
      </div>
    </div>
    <div class="nav">
      <div class="nav-bar">
        <div class="app-name">
          <div class="hero">
            <h1><nuxt-link to="/">UBAIR</nuxt-link></h1>
          </div>
          <div class="tag-line">
            <!-- <span>Uber Clone<span class="grey-text">, a attempt</span></span> -->
          </div>
        </div>
        <button class="hamburger-menu" @click="openOverlay()">
          <svg
            width="15"
            height="14"
            viewBox="0 0 15 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="4.3501"
              y1="7.04993"
              x2="14.5001"
              y2="7.04993"
              stroke="white"
              stroke-width="1.5"
            />
            <line
              y1="1.25"
              x2="14.5"
              y2="1.25"
              stroke="white"
              stroke-width="1.5"
            />
            <line
              y1="12.85"
              x2="14.5"
              y2="12.85"
              stroke="white"
              stroke-width="1.5"
            />
          </svg>
        </button>
      </div>
    </div>

    <img
      width="30%"
      height="30%"
      class="gif gif-profile"
      src="https://media.giphy.com/media/T5nP7Nwu5FzMc/giphy.gif"
      alt=""
    />
    <img
      width="30%"
      height="30%"
      class="gif gif-ridenow"
      src="https://media.giphy.com/media/YqaqeODWhsbK0/giphy.gif"
      alt=""
    />
    <img
      width="30%"
      height="30%"
      class="gif gif-previoustrip"
      src="https://media.giphy.com/media/mBYeqvpJzcqobbV2Df/giphy.gif"
      alt=""
    />
    <img
      width="30%"
      height="30%"
      class="gif gif-logout"
      src="https://media.giphy.com/media/FIPKX8nTQjNYI/giphy.gif"
      alt=""
    />
    <img
      width="30%"
      height="30%"
      class="gif gif-aboutus"
      src="https://media.giphy.com/media/QQkyLVLAbQRKU/giphy.gif"
      alt=""
    />
  </nav>
</template>

<script>
export default {
  name: "AppHeader",
  data() {
    return { userType: { type: String }, actionText: "Lets Go!" };
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
    openOverlay() {
      document.body.style.overflow = "hidden";
      let overlay = document.querySelector(".overlay-navigation-menu");
      let links = document.querySelectorAll(".overlay-navigation-menu div");
      overlay.style.width = "100vw";
      overlay.style.height = "100vh";
      overlay.style.display = "flex";
      links.forEach(link => {
        link.className = "anim";
      });
    },

    closeOverlay() {
      let overlay = document.querySelector(".overlay-navigation-menu");
      setTimeout(() => {
        overlay.style.height = "0";
        overlay.style.width = "0";
        overlay.style.display = "none";
      }, 400);
      let links = document.querySelectorAll(".overlay-navigation-menu div");
      links.forEach(link => {
        link.className = "anim3";
      });
    },

    logout() {
      this.removeFromQueue();
      this.closeOverlay();
      if (localStorage.data != undefined) {
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

        fetch("http://localhost:4001/stop", requestOptions);

        localStorage.clear();
      }
      window.location = "http://localhost:3000/";
    }
  },
  mounted() {
    if (localStorage.data) {
      this.userType = JSON.parse(localStorage.data).type;
    }
    if (this.userType == "passenger") {
      this.actionText = "Ride Now";
    } else if (this.userType == "passenger") {
      this.actionText = "Ride Now";
    } else {
      this.actionText = "Lets go!";
    }
    if (window.innerWidth > 700) {
      let gif_profile = document.querySelector(".gif-profile");
      let gif_ridenow = document.querySelector(".gif-ridenow");
      let gif_previoustrip = document.querySelector(".gif-previoustrip");
      let gif_logout = document.querySelector(".gif-logout");
      let gif_aboutus = document.querySelector(".gif-aboutus");

      let link_profile = document.querySelector(".link-profile ");
      let link_ridenow = document.querySelector(".link-ridenow ");
      let link_previoustrip = document.querySelector(".link-previoustrip ");
      let link_logout = document.querySelector(".link-logout ");
      let link_aboutus = document.querySelector(".link-aboutus ");

      link_ridenow.addEventListener("mousemove", e => {
        gif_ridenow.setAttribute(
          "style",
          `top: ${e.pageY}px; 
           left: ${e.pageX}px;
           display: initial;`
        );
      });

      link_profile.addEventListener("mouseleave", e => {
        gif_profile.setAttribute("style", `display: none;`);
      });
      link_profile.addEventListener("mousemove", e => {
        gif_profile.setAttribute(
          "style",
          `top: ${e.pageY}px; 
           left: ${e.pageX}px;
           display: initial;`
        );
      });

      link_previoustrip.addEventListener("mouseleave", e => {
        gif_previoustrip.setAttribute("style", `display: none;`);
      });
      link_previoustrip.addEventListener("mousemove", e => {
        gif_previoustrip.setAttribute(
          "style",
          `top: ${e.pageY}px; 
           left: ${e.pageX}px;
           display: initial;`
        );
      });

      link_logout.addEventListener("mouseleave", e => {
        gif_logout.setAttribute("style", `display: none;`);
      });
      link_logout.addEventListener("mousemove", e => {
        gif_logout.setAttribute(
          "style",
          `top: ${e.pageY - 100}px; 
           left: ${e.pageX}px;
           display: initial;`
        );
      });

      link_aboutus.addEventListener("mouseleave", e => {
        gif_aboutus.setAttribute("style", `display: none;`);
      });
      link_aboutus.addEventListener("mousemove", e => {
        gif_aboutus.setAttribute(
          "style",
          `top: ${e.pageY - 200}px; 
           left: ${e.pageX}px;
           display: initial;`
        );
      });

      link_ridenow.addEventListener("mouseleave", e => {
        gif_ridenow.setAttribute("style", `display: none;`);
      });
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Inter|Montserrat:400,500&display=swap");
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  color: white;
  font-family: sans-serif;
}

body {
  background-color: black;
}

nav {
  margin-bottom: 1rem;
}

.nav-bar {
  background-color: #000;

  width: 100vw;
  height: 15vh;
  display: flex;
  justify-content: space-between;
  padding: 0 2rem;
  align-items: center;
}

.nav-bar .app-name .hero h1 {
  font-size: 1.3em;
  font-weight: 500;
  letter-spacing: 0.5em;
  margin-bottom: 0.2rem;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
}

.nav-bar .app-name .tag-line {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.65em;
  font-weight: 400;
  font-family: "Inter", sans-serif;
  letter-spacing: 0.375em;
}

.nav-bar .app-name .tag-line span {
  font-family: "Inter", sans-serif;
}

.hamburger-menu {
  display: block;
  cursor: pointer;
  background-color: transparent;
  border: none;
}

button:focus {
  outline: none;
}

.overlay-navigation-menu {
  display: none;
  flex-direction: column;
  background-color: black;
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  z-index: 1;
  padding: 2.2rem 2rem;
  transform: all 300ms ease-in 1 forwards;
}

.close-menu {
  cursor: pointer;

  margin-top: 0.6rem;
  width: max-content;
  flex-grow: 0;
  align-self: flex-end;
  background-color: transparent;
  border: none;
  opacity: 1;
  margin-bottom: 2rem;
}

.overlay-navigation-menu div a {
  text-decoration: none;
  display: inline-block;
}

.overlay-navigation-menu div:nth-child(2) {
  animation-delay: 300ms;
}
.overlay-navigation-menu div:nth-child(3) {
  animation-delay: 600ms;
}
.overlay-navigation-menu div:nth-child(4) {
  animation-delay: 900ms;
}
.overlay-navigation-menu div:nth-child(5) {
  animation-delay: 1200ms;
}
.overlay-navigation-menu div:nth-child(6) {
  animation-delay: 1400ms;
}

.anim {
  letter-spacing: 0.5rem;
  margin-top: 1rem;
  flex-grow: 1;
  text-decoration: none;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 1rem;
  opacity: 0;
  animation: sad 300ms ease 1 forwards;
}

@keyframes sad {
  0% {
    transform: translateX(-10%);
    opacity: 0;
  }
  100% {
    transform: translateX(0%);
    opacity: 1;
  }
}
.anim3 {
  letter-spacing: 0.5rem;
  margin-top: 1rem;
  flex-grow: 1;
  text-decoration: none;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 1rem;
  opacity: 1;
  animation: sad3 300ms ease 1 forwards;
}

@keyframes sad3 {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.gif {
  display: none;
  position: absolute;
  z-index: 1;
  pointer-events: none;
}
</style>
