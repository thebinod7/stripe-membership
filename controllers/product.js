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

const getProductByName = (name) => {
  return ProductModel.findOne({ name: { $regex: new RegExp(name, "i") } });
};

module.exports = {
  saveProduct,
  listAll,
  getProduct,
  getProductByName,
};
