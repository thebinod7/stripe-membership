const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    stripe_product_id: { type: String, required: true, unique: true },
  },
  {
    collection: "products",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toObject: {
      virtuals: true,
    },
    toJson: {
      virtuals: true,
    },
  }
);

module.exports = mongoose.model("Products", schema);
