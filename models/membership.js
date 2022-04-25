const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const schema = mongoose.Schema(
  {
    stripe_cus_id: { type: String, required: true, unique: true },
    price_id: { type: ObjectId, required: true },
    expires_at: { type: Date, default: Date.now() }, // TODO: calculate expiry date
    is_paid: { type: Boolean, default: true },
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
