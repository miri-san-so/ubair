const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		phone_number: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		trips: { type: Number, required: false, default: 0 },
		rating: [Number],
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Passenger = mongoose.model("passenger", UserSchema);

module.exports = Passenger;
