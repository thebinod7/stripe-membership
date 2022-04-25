const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const EURO_CURRENCY = "eur";

const schema = mongoose.Schema(
  {
    customer: { type: ObjectId, required: true, unique: true },
    product: { type: ObjectId, required: true },
    unit_price: { type: Number, required: true },
    currency: { type: String, default: EURO_CURRENCY },
    is_recurring: { type: Boolean, default: false },
    billing_cycle: {
      type: String,
      enum: ["Monthly", "Yearly", "One Time"],
      default: "One Time",
    },
    stripe_customer_id: { type: String },
  },
  {
    collection: "membership",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toObject: {
      virtuals: true,
    },
    toJson: {
      virtuals: true,
    },
  }
);

module.exports = mongoose.model("Membership", schema);
