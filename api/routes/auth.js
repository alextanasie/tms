const router = require("express").Router();
const { login, getToken, deleteToken } = require("../middleware/auth");

router.post("/login", login);
router.delete("/logout", deleteToken);
router.post("/token", getToken);

module.exports = router;
