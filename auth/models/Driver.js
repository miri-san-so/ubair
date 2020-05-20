const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone_number: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    vehicle: { type: String, required: true },
    vehicle_number: { type: String, required: true },
    trips: { type: Number, required: false, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Driver = mongoose.model("driver", UserSchema);

module.exports = Driver;
