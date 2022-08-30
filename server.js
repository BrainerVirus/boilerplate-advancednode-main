"use strict";
require("dotenv").config();
const express = require("express");
const myDB = require("./connection");
const fccTesting = require("./freeCodeCamp/fcctesting.js");
const path = require("node:path");
const session = require("express-session");
const passport = require("passport");
const ObjectID = require("mongodb").ObjectID;

const app = express();
app.set("view engine", "pug");

fccTesting(app); //For FCC testing purposes
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.route("/").get((req, res) => {
  res.render(path.join(__dirname, "/views/pug/index.pug"), {
    title: "Hello",
    message: "Please login",
  });
});

passport.serializeUser((user, done) => {
  done(null, null, user._id);
});

passport.deserializeUser((id, done) => {
  // myDataBase.findOne({ _id: new ObjectID(id) }, (err, doc) => {
  done(null, null);
  // });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});