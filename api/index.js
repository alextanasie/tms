const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

//routes
const usersRoute = require("./routes/users");
const timecardsRoute = require("./routes/timecards");
dotenv.config();

// DB connect
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => console.log("Connected to DB!"));

// middleware
app.use(express.json());
app.use(cors());

//route middleware
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/timecards", timecardsRoute);

app.listen(3001, () => console.log("SERVER RUNNING"));
