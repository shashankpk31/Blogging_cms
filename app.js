var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  indexRoute = require("./routes/index"),
  postRoute = require("./routes/blog"),
  commentRoute = require("./routes/comment"),
  AdminRoute = require("./routes/admin"),
  authRoute = require("./routes/auth"),
  passport = require("passport"),
  localStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  Post = require("./models/post"),
  User = require("./models/user"),
  flash = require("connect-flash"),
  middleware = require("./middleware/auth");

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(flash());

app.use(
  require("express-session")({
    secret: "secret shanky",
    resave: false,
    saveUninitialized: false,
  })
);

passport.use(new localStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.currentUser = req.user;
  next();
});
// Auth Part
app.use(AdminRoute);
app.use(postRoute);
app.use(commentRoute);
app.use(authRoute);

app.get("/profile", middleware.checkLoggedIn, (req, res) => {
  Post.find({}, function (err, posts) {
    if (err) {
      console.log("Some error occured");
    } else {
      res.render("Profile", { posts: posts });
    }
  });
});
mongoose.connect(
  "mongodb+srv://shashank:shashank8090@cluster0.wzrgn.mongodb.net/blogexample",
  { useNewUrlParser: true }
);

app.set("view engine", "ejs");

app.listen(3000, function () {
  console.log("Server Started at Port 3000");
});
