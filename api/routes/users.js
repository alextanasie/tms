const router = require("express").Router();
const userController = require("../controllers/users");
const { isAuthenticated } = require("../middleware/auth");
const { restrictUsers } = require("../middleware/restrict");

// TODO: test these. mock the token role in auth.js: 1/2/3
router.post("/", userController.register);
router.put("/:id", isAuthenticated, restrictUsers, userController.update);
router.delete("/:id", isAuthenticated, restrictUsers, userController.remove);
router.get("/", isAuthenticated, restrictUsers, userController.getAll);

module.exports = router;
