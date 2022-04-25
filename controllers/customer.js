const CustomerModel = require("../models/customer");

const saveCustomer = (payload) => {
  return CustomerModel.create(payload);
};

const listAll = () => {
  return CustomerModel.find();
};

const getCustomer = (id) => {
  return CustomerModel.findById(id);
};

module.exports = {
  saveCustomer,
  listAll,
  getCustomer,
};
