const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const EURO_CURRENCY = "eur";

const schema = mongoose.Schema(
  {
    stripe_product_id: { type: String, required: true },
    stripe_price_id: { type: String, required: true },
    unit_amount: { type: Number, required: true },
    currency: { type: String, default: EURO_CURRENCY },
    type: {
      type: String,
      enum: ["one_time", "recurring"],
      default: "one_time",
    },
    recurring: {
      interval: {
        type: String,
        enum: ["week", "month", "year"],
      },
    },
  },
  {
    collection: "pricing",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toObject: {
      virtuals: true,
    },
    toJson: {
      virtuals: true,
    },
  }
);

module.exports = mongoose.model("Pricing", schema);
