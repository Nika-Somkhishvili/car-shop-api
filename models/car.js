const mongoose = require("mongoose");

const carSchema = mongoose.Schema(
  {
    modelName: { type: String, required: true },
    color: { type: String, required: true },
    vin: { type: String, required: true, unique: true },
    year: { type: String },
    price: { type: Number },
  },
  {
    collection: "cars",
    timestamps: true,
    writeConcern: {
      w: "majority",
      j: true,
      wtimeout: 30000,
    },
    read: "nearest",
  }
);

const Model = mongoose.model("Car", carSchema);
module.exports = Model;
