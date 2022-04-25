const MembershipModel = require("../models/membership");

const createMembership = (payload) => {
  return MembershipModel.create(payload);
};

const listAll = () => {
  return MembershipModel.find();
};

const getMembership = (id) => {
  return MembershipModel.findById(id);
};

module.exports = {
  createMembership,
  listAll,
  getMembership,
};
