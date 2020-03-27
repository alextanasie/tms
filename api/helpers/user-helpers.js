const isAdminRequest = user => {
  return user && user.role == 3;
};

module.exports = {
  isAdminRequest,
};
