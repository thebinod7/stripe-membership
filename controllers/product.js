const ProductModel = require("../models/product");

const saveProduct = (payload) => {
  return ProductModel.create(payload);
};

const listAll = () => {
  return ProductModel.find();
};

const getProduct = (id) => {
  return ProductModel.findById(id);
};

module.exports = {
  saveProduct,
  listAll,
  getProduct,
};
