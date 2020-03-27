const router = require("express").Router();
const userController = require("../controllers/users");
const auth = require("../middleware/auth");
const { restrictUsers } = require("../middleware/restrict");

// TODO: test these. mock the token role in auth.js: 1/2/3
router.post("/login", userController.login);
router.post("/", userController.register);
router.put("/:id", auth, restrictUsers, userController.update);
router.delete("/:id", auth, restrictUsers, userController.remove);
router.get("/", auth, restrictUsers, userController.getAll);

module.exports = router;
