const PricingModel = require("../models/pricing");

const createPricing = (payload) => {
  return PricingModel.create(payload);
};

const listAll = () => {
  return PricingModel.find();
};

const getMembership = (id) => {
  return PricingModel.findById(id);
};

module.exports = {
  createPricing,
  listAll,
  getMembership,
};
