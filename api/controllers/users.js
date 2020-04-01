const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { isAdminRequest } = require("../helpers/user-helpers");
const { registerValidation, userInfoValidation } = require("../helpers/userValidation");

const sendConfirmationEmail = async user => {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    name: "example.com", // <= Add this
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  jwt.sign(
    {
      user: user._id,
    },
    process.env.EMAIL_SECRET,
    {
      expiresIn: "3600s",
    },
    (err, emailToken) => {
      if (err) {
        console.error(err);
        throw err;
      }
      const url = `http://localhost:3000/confirmation/${emailToken}`;

      const msg = {
        to: user.email,
        from: '"Fred Foo" <foo@example.com>',
        subject: "Confirm Email",
        text: "Hello world?", // plain text body
        html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
      };
      transporter.sendMail(msg, (err, info) => {
        if (err) {
          console.error(err.message);
        }
        console.log("email message sent: ", info.messageId);
      });
    }
  );
};

const register = async (req, res) => {
  console.log("POST /users");
  //validate request
  const { error } = registerValidation(req.body);
  if (error) {
    console.error("register validation err: ", error);
    return res.status(400).send(error.details[0].message);
  }

  //check if user already exists
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) {
    console.error("registration: email already exists");
    return res.status(400).send("Email already exists");
  }

  //hash the pass
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);

  //create the user
  const sentUserObj = {
    name: req.body.name,
    email: req.body.email,
    password: hashedPass,
  };

  // if the requester is an Admin, he has the right to set roles (1=user, 2=manager, 3=admin)
  if (req.body.role && isAdminRequest(req.user)) {
    sentUserObj.role = req.body.role;
  }

  const user = new User(sentUserObj);

  try {
    const savedUser = await user.save();
    // await sendConfirmationEmail(savedUser);
    console.log(`Saved user ${savedUser}`);
    res.status(201).send({ name: user.name, email: user.email, date: user.date, role: user.role });
  } catch (err) {
    res.status(400).send(err);
    console.error(`registration error: ${err}`);
  }
};

const remove = async (req, res) => {
  console.log(`DELETE /user/${req.params.id}`);
  try {
    if (req.params.id) {
      let deletedUser = await User.findOneAndDelete({ _id: req.params.id });
      res.status(200).send(`User id ${deletedUser.id} has been successfully deleted`);
    } else {
      res.status(400).send("No ID received");
    }
  } catch (e) {
    console.error(e.message);
    res.status(400).send("User could not be found");
  }
};

const update = async (req, res) => {
  console.log(`PUT /user/${req.params.id}`);
  try {
    const updatedUser = req.body;

    //validate request
    const { error } = userInfoValidation(updatedUser);
    if (error) {
      console.error(`User validation err: ${error}`);
      return res.status(400).send(error.details[0].message);
    }

    //check if user exists
    let user = await User.findOne({ _id: req.params.id });
    if (!user) {
      console.error("update: user does not exist");
      return res.status(404).send(`User id ${req.params.id} could not be found`);
    }

    // user = updatedUser;
    for (const key of Object.keys(updatedUser)) {
      user[key] = updatedUser[key];
    }
    const changedUser = await user.save();
    res.status(200).send(`Updated user with id ${changedUser.id}`);
  } catch (e) {
    console.error(e);
    res.status(400).send(`User update error`);
  }
};

const getAll = async (req, res) => {
  console.log(`GET /users`, req.user);
  try {
    // Managers shouldn't get access to admins in the list
    const dbFilter = isAdminRequest(req.user) ? {} : { role: { $lte: 2 } };
    // TODO: exclude pass in mongoose model with "select: false" for the field
    const allUsers = await User.find(dbFilter).select("-password -__v");

    res.status(200).send(allUsers);
  } catch (e) {
    console.error(`Error getting all users: ${e}`);
  }
};

module.exports = {
  register,
  remove,
  update,
  getAll,
};
