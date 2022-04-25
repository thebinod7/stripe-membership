const mongoose = require("mongoose");

const EURO_CURRENCY = "eur";

const schema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    unit_price: { type: Number, required: true },
    currency: { type: String, default: EURO_CURRENCY },
    stripe_product_id: { type: String },
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
