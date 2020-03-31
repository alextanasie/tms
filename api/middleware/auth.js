const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/User");
const { loginValidation } = require("../helpers/userValidation");

let refreshTokens = [];

const generateAccessToken = userInfo => {
  return jwt.sign(userInfo, process.env.TOKEN_SECRET, { expiresIn: "30s" });
};

const getUserInfoForTokens = user => {
  return {
    email: user.email,
    role: user.role,
    id: user.id,
  };
};

const login = async (req, res) => {
  console.log("/login", req.body);
  //validate request
  const { error } = loginValidation(req.body);
  if (error) {
    console.error("login validation err: ", error);
    return res.status(400).send(error.details[0].message);
  }

  //check if email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    console.error("login: email does not exist");
    return res.status(401).send("Email or password are not correct");
  }

  //check password
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(401).send("Email or password are not correct");

  //Create & assign token
  const userInfo = getUserInfoForTokens(user);
  const accessToken = generateAccessToken(userInfo);
  const refreshToken = jwt.sign(userInfo, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json({ accessToken, refreshToken });

  //TODO: add expiration
};

const isAuthenticated = (req, res, next) => {
  const token = req.headers["x-token"];

  console.log("token", token);

  if (!token) {
    return res.sendStatus(401);
  }
  try {
    const verifiedUser = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verifiedUser;
    // req.user.role = 2;
    console.log(`Accessed by `, req.user);
    next();
  } catch (err) {
    console.error(`Auth error: ${err}`);
    res.sendStatus(403);
  }
};

const getToken = async (req, res) => {
  console.log("POST /token");
  try {
    const refreshToken = req.body.refreshToken;
    if (refreshToken == null) return res.sendStatus(401);
    // TODO: uncomment the line below after finishing development (nodemeon causes the refreshTokens to be always empty)
    // if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      const userInfo = getUserInfoForTokens(user);
      const accessToken = generateAccessToken(userInfo);
      console.log(accessToken);
      res.json({ accessToken });
    });
  } catch (err) {
    console.error("Error trying to POST /token:", err);
  }
};

const deleteToken = (req, res) => {
  refreshTokens = refreshTokens.filter(tk => tk !== req.body.refreshToken);
  res.sendStatus(204);
};

module.exports = {
  login,
  isAuthenticated,
  getToken,
  deleteToken,
};
