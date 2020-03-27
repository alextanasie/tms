const restrictUsers = (req, res, next) => {
  // console.log()
  if (req.user.role < 2) {
    return res.status(403).send(`Users are not allowed to perform this operation.`);
  }
  return next();
};

const restrictManagersAndUsers = (req, res, next) => {
  if (req.user.role < 3) {
    return res.status(403).send(`Users and managers are not allowed to perform this operation.`);
  }
  return next();
};

const restrictManagers = (req, res, next) => {
  if (req.user.role == 2) {
    return res.status(403).send(`Managers are not allowed to perform this operation.`);
  }
  return next();
};

module.exports = {
  restrictUsers,
  restrictManagersAndUsers,
  restrictManagers,
};
