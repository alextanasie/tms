const router = require("express").Router();
const auth = require("../middleware/auth");
const timecardsController = require("../controllers/timecards.js");
// const { restrictManagers } = require("../middleware/restrict");

router.get("/", auth, timecardsController.getAll);
router.post("/", auth, timecardsController.create);
router.delete("/:id", auth, timecardsController.remove);
router.put("/:id", auth, timecardsController.update);

module.exports = router;
