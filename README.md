# Ubair

An attempt at cloning uber using MEVN Stack and Socket.io

## Table Of Content

- [Ubair](#ubair)
  - [Table Of Content](#table-of-content)
  - [Getting Started](#getting-started)
  - [Installation](#installation)
    - [🔐 &nbsp; Auth Serivce](#%f0%9f%94%90-auth-serivce)
    - [📍 &nbsp; Location Serivce](#%f0%9f%93%8d-location-serivce)
    - [👨 &nbsp; Profile Serivce](#%f0%9f%91%a8-profile-serivce)
    - [📦 &nbsp; Dispatcher Serivce](#%f0%9f%93%a6-dispatcher-serivce)
    - [🔌 &nbsp; Sockets](#%f0%9f%94%8c-sockets)
  - [Adding HERE API Keys](#adding-here-api-keys)
  - [Running System](#running-system)
    - [Backend](#backend)
      - [Ports Required](#ports-required)
      - [Running Backend](#running-backend)
    - [Frontend](#frontend)
      - [Running Frontend](#running-frontend)
  - [Technologies Used](#technologies-used)
    - [Backend Technology](#backend-technology)
    - [Frontend Framework](#frontend-framework)
    - [Security](#security)
    - [Maps Service](#maps-service)
    - [UI Design](#ui-design)
  - [Dependencies Used](#dependencies-used)
  - [Possible Features / Advancement Ideas](#possible-features--advancement-ideas)
  - [Intention](#intention)
  - [Learn From My Mistakes](#learn-from-my-mistakes)
  - [Problems I Faced](#problems-i-faced)
  - [Acknowledgement](#acknowledgement)

&nbsp;

## Getting Started

They are Five Services that run seprately to run the entire system

1. &nbsp; Auth Service
2. &nbsp; Profile Service
3. &nbsp; Location Service
4. &nbsp; Dispatcher Service
5. &nbsp; Socket

&nbsp;

## Installation

Pre-Requisites : [Node.js](https://nodejs.org/en/) and [mongoDB](https://www.mongodb.com/download-center/community)

### 🔐 &nbsp; Auth Serivce

Handles User Authentication and Verification

```bash
cd auth/ && npm install
```

---

### 📍 &nbsp; Location Serivce

Does all the Computations for Routes, Distance and GeoLocation

```bash
cd location/ && npm install
```

---

### 👨 &nbsp; Profile Serivce

API for User Profiles

```bash
cd profile/ && npm install
```

---

### 📦 &nbsp; Dispatcher Serivce

Does all the Computations for Routes, Distance and GeoLocation

```bash
cd dispatcher/ && npm install
```

---

### 🔌 &nbsp; Sockets

Handles Socket Conection for the Driver and Passengers

```bash
cd socket/ && npm install
```

&nbsp;

## Adding HERE API Keys

1. &nbsp; Go to [HERE](https://account.here.com/) and Sign up for a Free Account
2. &nbsp; Create a new Project and get your credentials.
3. &nbsp; Create API Key for **Javascript** and **REST** Services
4. &nbsp; Go to **_location/config/keys.js_** and paste the API Keys in their respective variables

&nbsp;

```js
// PATH : location/config/keys.js

module.exports = {
	mongoURI: "mongodb://127.0.0.1:27017/uber_clone_location",

	HERE_REST_API_KEY: "{{ YOUR KEY }}",

	HERE_JS_MAPS_API_KEY: "{{ YOUR KEY }}",
};
```

&nbsp;

## Running System

### Backend

#### Ports Required

|  Services  | PORT |
| :--------: | :--: |
|    Auth    | 4000 |
|  Location  | 4001 |
|  Profile   | 4002 |
| Dispatcher | 4003 |
|  Sockets   | 4005 |

#### Running Backend

Two ways you can start the system

1. Start each service manually

   ```bash
   cd auth/ && npm run dev
   cd socket/ && npm run dev
   cd profile/ && npm run dev
   cd location/ && npm run dev
   cd dispatcher/ && npm run dev
   ```

2. Use the run.js file which executes all services.

   ```bash
   node run.js
   ```

&nbsp;

### Frontend

We are using NuxtJS so the frontend is rendered on the server

#### Running Frontend

```bash
cd frontend && npm run start
```

&nbsp;

## Technologies Used

### Backend Technology

- Node.js with Express Framework
- Socket.io for Socket connections

### Frontend Framework

- Nuxt Js

### Security

- JWT Tokens

### Maps Service

- [HERE Maps](https://www.here.com/)

### UI Design

- [Figma](https://www.figma.com/)

&nbsp;

## Dependencies Used

- jsonwebtoken
- cors
- express
- request
- mongoose
- socket.io
- body-parser

&nbsp;

## Possible Features / Advancement Ideas

1. Add a NGINX Server and create Reverse Proxies
2. Maker Docker Containers
3. Use Kubernetes for Docker Containers
4. Add Interactive Map
5. Live Tracking of users position on map
6. Implement Sharding according to location

&nbsp;

## Intention

- Apply my current knowledge of backend and frontend
- Learn more about System design
- Learn to work with maps api
- Integrating Services together to create systems

&nbsp;

## Learn From My Mistakes

- Put more time into designing services
- Think through the entire data journey and then make schema for the data
- Implement Store for your frontend whenever needed

&nbsp;

## Problems I Faced

- HERE API sometimes responsds with incorrect distances which leads to wrong pricing of fare
- Implementing an interactive map was an essential component but could not add due to lack of knowledge of HERE API and also the documentation is that elaborated
- Passing Information from one Nuxt page to another since I did not implement a store.

&nbsp;

## Acknowledgement

Thankyou [_@sagarsanjaysutar_](https://github.com/sagarsanjaysutar) for suggesting the idea to make a uber clone
