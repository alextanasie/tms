const router = require("express").Router();
const { login, getToken, deleteToken, confirmEmail } = require("../middleware/auth");

router.post("/login", login);
router.delete("/logout", deleteToken);
router.post("/token", getToken);
router.get("/confirmation/:token", confirmEmail);

module.exports = router;
