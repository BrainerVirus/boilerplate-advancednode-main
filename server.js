"use strict";
require("dotenv").config();
const express = require("express");
const myDB = require("./connection");
const fccTesting = require("./freeCodeCamp/fcctesting.js");
const path = require("node:path");
const session = require("express-session");
const passport = require("passport");
// const { MongoCR } = require("mongodb/lib/core");
const mongo = require("mongodb").MongoClient;
const URI = process.env.MONGO_URI;
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

myDB(async (client) => {
  const myDataBase = await client.db("database").collection("users");

  // Be sure to change the title
  app.route("/").get((req, res) => {
    res.render(path.join(process.cwd(), "/views/pug/index.pug"), {
      title: "Connected to Database",
      message: "Please login",
    });
  });

  // Serialization and deserialization here...

  passport.serializeUser((user, done) => {
    done(null, null, user._id);
  });

  passport.deserializeUser((id, done) => {
    db.findOne({ _id: new ObjectID(id) }, (err, doc) => {
      done(null, doc);
    });
  });

  // Be sure to add this...
}).catch((e) => {
  app.route("/").get((req, res) => {
    res.render(path.join(process.cwd(), "/views/pug/index.pug"), {
      title: e,
      message: "Unable to login",
    });
  });
});

// app.route("/").get((req, res) => {
//   res.render(path.join(__dirname, "/views/pug/index.pug"), {
//     title: "Hello",
//     message: "Please login",
//   });
// });

// passport.serializeUser((user, done) => {
//   done(null, null, user._id);
// });

// passport.deserializeUser((id, done) => {
//   db.findOne({ _id: new ObjectID(id) }, (err, doc) => {
//     done(null, doc);
//   });
// });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});

// mongo.connect(process.env.MONGO_URI, (err, db) => {
//   if (err) {
//     console.log("Database error: " + err);
//   } else {
//     console.log("Successful database connection and db is: ", db);
//   }
// });
