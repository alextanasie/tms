const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("Access denied!");
  }
  try {
    const verifiedUser = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verifiedUser;
    // req.user.role = 1;
    console.log(`Accessed by `, req.user);
    next();
  } catch (err) {
    console.error(`Auth error: ${err}`);
    res.status(403).send("Invalid token");
  }
};
