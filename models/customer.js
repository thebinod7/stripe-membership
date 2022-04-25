const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    stripe_cus_id: String,
  },
  {
    collection: "customers",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toObject: {
      virtuals: true,
    },
    toJson: {
      virtuals: true,
    },
  }
);

module.exports = mongoose.model("Customer", schema);
