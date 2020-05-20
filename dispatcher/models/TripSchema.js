const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema(
	{
		passengerId: String,
		driverId: String,
		passengerName: String,
		passnegerPhoneNumber: String,
		driverName: String,
		driverPhoneNumber: String,
		trip_distance: Number,
		trip_fare: String,
		pickup_label: String,
		dropoff_label: String,
		trip_info: String,
		pickup_lat: String,
		pickup_long: String,
		dropoff_lat: String,
		dropoff_long: String,
		driverCancel: Boolean,
		cancelFare: String,
		distanceTraveled: Number,
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("trips", TripSchema, "trips");
