const mongoose = require("mongoose");

const address = new mongoose.Schema({
  label: String,
  countryCode: String,
  countryName: String,
  state: String,
  county: String,
  city: String,
  district: String,
  subdistrict: String,
  postalCode: String,
});

const pLocation = new mongoose.Schema({
  name: String,
  phone_number: {
    type: Number,
    unique: true,
  },
  pickup_location: {
    lat: Number,
    long: Number,
    address: address,
  },
  drop_location: {
    lat: Number,
    long: Number,
    address: address,
  },
  trip_distance: Number,
  trip_duration: Number,
  trip_info: String,
});

const dLocation = new mongoose.Schema({
  name: String,
  phone_number: {
    type: Number,
    unique: true,
  },
  address: address,
  lat: Number,
  long: Number,
});

const PassengerLocationSchema = mongoose.model("passenger_location", pLocation);
const DriverLocationSchema = mongoose.model("driver_location", dLocation);

module.exports = { PassengerLocationSchema, DriverLocationSchema };
