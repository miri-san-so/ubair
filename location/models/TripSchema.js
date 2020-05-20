const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema(
	{
		passengerId: String,
		driverName: String,
		driverPhoneNumber: String,
		trip_distance: Number,
		pickup_label: String,
		dropoff_label: String,
		trip_info: String,
		completed: { type: Boolean, default: false },
		canceledByPassenger: { type: Boolean, default: false },
		canceledByDriver: { type: Boolean, default: false },
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("trips", TripSchema, "trips");
