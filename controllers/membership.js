const MembershipModel = require("../models/membership");

const saveMembership = (payload) => {
  return MembershipModel.create(payload);
};

const listAll = () => {
  return MembershipModel.find();
};

const getMembership = (id) => {
  return MembershipModel.findById(id);
};

module.exports = {
  saveMembership,
  listAll,
  getMembership,
};
