const User = require("../model/User");
const Timecard = require("../model/Timecard");
const { isAdminRequest } = require("../helpers/user-helpers");
const { addTimecardValidation } = require("../helpers/timecardValidation");

const create = async (req, res) => {
  try {
    console.log("POST /timecards");
    //validate request
    const timecardPayload = req.body;
    const { error } = addTimecardValidation(timecardPayload);
    if (error) {
      console.error("register validation err: ", error);
      return res.status(400).send(error.details[0].message);
    }

    //check if user exists
    const userExists = await User.findOne({ _id: req.user.id });
    if (!userExists) {
      console.error(`Error creating timecard. User ${req.user.id} does not exist`);
      return res.status(400).send("Non-existing user");
    }

    const timecard = new Timecard(timecardPayload);
    timecard.ownerId = req.user.id;

    const savedTimecard = await timecard.save();
    res.status(201).send({ id: timecard.id });
    console.log(`Saved timecard ${savedTimecard}`);
  } catch (e) {
    res.status(400).send("Error creating timecard");
    console.error(`Error creating timecard: `, e);
  }
};

const getAll = async (req, res) => {
  console.log(`GET /timecards`);
  try {
    const timecardsToBeFound = isAdminRequest(req.user) ? {} : { ownerId: req.user.id };
    const allTimecards = await Timecard.find(timecardsToBeFound).select("-__v");

    res.status(200).send(allTimecards);
  } catch (e) {
    console.error(`Error when getting all timecards: ${e}`);
  }
};

const remove = async (req, res) => {
  console.log(`DELETE /timecards/${req.params.id}`);
  try {
    if (req.params.id) {
      // first make sure the ID belongs to the requesting user
      // TODO test this as well
      const filter = { _id: req.params.id };
      if (!isAdminRequest(req.user)) {
        filter.ownerId = req.user.id;
      }

      const timecardToBeDeleted = await Timecard.findOneAndDelete(filter);
      res.status(200).send(`Timecard id ${timecardToBeDeleted.id} has been successfully deleted`);
    } else {
      res.status(400).send("No ID received");
    }
  } catch (e) {
    console.error(e.message);
    res.status(404).send(`Timecard with id ${req.params.id} not found or you do not have access to it`);
  }
};

const update = async (req, res) => {
  console.log(`PUT /user/${req.params.id}`);
  try {
    const updatedTimecard = req.body;

    //validate request
    const { error } = addTimecardValidation(updatedTimecard);
    if (error) {
      console.error(`Timecard validation err: `, error);
      return res.status(400).send(error.details[0].message);
    }

    //check if timecard exists
    let timecard = await Timecard.findOne({ _id: req.params.id });
    if (!timecard) {
      console.error("update: timecard does not exist");
      return res.status(404).send(`Timecard id ${req.params.id} could not be found`);
    }

    if (timecard.ownerId !== req.user.id && !isAdminRequest(req.user)) {
      return res.status(403).send("Only timecard owner or admins are allowed to update this timecard");
    }

    for (const key of Object.keys(updatedTimecard)) {
      timecard[key] = updatedTimecard[key];
    }
    const changedTimecard = await timecard.save();
    res.status(200).send(`Updated timecard with id ${changedTimecard.id}`);
  } catch (e) {
    console.error(e);
    res.status(400).send(`User update error`);
  }
};

module.exports = {
  create,
  getAll,
  remove,
  update,
};
