const passport = require("passport");
const path = require("node:path");
const bcrypt = require("bcrypt");

module.exports = function (app, myDataBase) {
  //midleware
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  }
  // Be sure to change the title
  app.route("/").get((req, res) => {
    res.render(path.join(process.cwd(), "/views/pug/index.pug"), {
      title: "Connected to Database",
      message: "Please login",
      showLogin: true,
      showRegistration: true,
    });
  });

  app
    .route("/login")
    .post(
      passport.authenticate("local", { failureRedirect: "/" }),
      (req, res) => {
        res.redirect("/profile");
      }
    );

  app.route("/profile").get(ensureAuthenticated, (req, res) => {
    res.render(process.cwd() + "/views/pug/profile", {
      username: req.user.username,
    });
  });

  app.route("/chat").get(ensureAuthenticated, (req, res) => {
    res.render(process.cwd() + "/views/pug/chat", { user: req.user });
  });

  app.route("/logout").get((req, res) => {
    req.logout();
    res.redirect("/");
  });

  app.route("/register").post(
    (req, res, next) => {
      myDataBase.findOne({ username: req.body.username }, function (err, user) {
        if (err) {
          next(err);
        } else if (user) {
          res.redirect("/");
        } else {
          const hash = bcrypt.hashSync(req.body.password, 12);
          myDataBase.insertOne(
            { username: req.body.username, password: hash },
            (err, doc) => {
              if (err) {
                res.redirect("/");
              } else {
                next(null, doc.ops[0]);
              }
            }
          );
        }
      });
    },
    passport.authenticate("local", { failureRedirect: "/" }),
    (req, res, next) => {
      res.redirect("/profile");
    }
  );

  app.route("/auth/github").get(passport.authenticate("github"));
  app
    .route("/auth/github/callback")
    .get(
      passport.authenticate("github", { failureRedirect: "/" }),
      (req, res) => {
        req.session.user_id = req.user.id;
        res.redirect("/chat");
      }
    );

  app.use((req, res, next) => {
    res.status(404).type("text").send("Not Found");
  });
};
