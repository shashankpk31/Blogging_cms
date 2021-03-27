var express = require("express"),
  router = express.Router(),
  User = require("../models/user"),
  passport = require("passport"),
  localStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose");

router.get("/login", function (req, res) {
  res.render("auth/login");
});

router.get("/register", function (req, res) {
  res.render("auth/register");
});

router.post("/register", function (req, res) {
  User.register(
    new User({
      username: req.body.username,
      email: req.body.email,
      Age: req.body.Age,
      entity: req.body.entity,
      image: req.body.image,
    }),
    req.body.password,
    function (err, msg) {
      if (err) {
        console.log(err);
      }
      passport.authenticate("/local")(req, res, function () {
        res.redirect("/");
      });
    }
  );
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
  function (req, res) {
    //Nothing Here
  }
);

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
