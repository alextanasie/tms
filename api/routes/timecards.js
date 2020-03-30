const router = require("express").Router();
const { isAuthenticated } = require("../middleware/auth");
const timecardsController = require("../controllers/timecards.js");

router.get("/", isAuthenticated, timecardsController.getAll);
router.post("/", isAuthenticated, timecardsController.create);
router.delete("/:id", isAuthenticated, timecardsController.remove);
router.put("/:id", isAuthenticated, timecardsController.update);

module.exports = router;
