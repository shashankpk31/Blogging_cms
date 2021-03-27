var express = require("express"),
  router = express.Router(),
  Post = require("../models/post"),
  User = require("../models/user");
middleware = require("../middleware/auth");

router.get("/dashboard", middleware.checkLoggedIn, async function (req, res) {
  const totPost = await Post.find({}).count();
  const totUser = await User.find({}).count();
  const posts = await Post.find({});
  const users = await User.find({});
  res.render("admin/dashboard", {
    postCount: totPost,
    userCount: totUser,
    viewsCount: "coming soon..",
    posts,
    users,
  });
});

router.get("/postsuser", middleware.checkLoggedIn, async function (req, res) {
  const posts = await Post.find({});
  const users = await User.find({});
  res.render("admin/posts", {
    posts,
    users,
  });
});

router.get("/blog/:id/edit", middleware.isAdmin, function (req, res) {
  Post.findById(req.params.id, function (err, post) {
    if (err) {
      console.log("Some error Occured");
    } else {
      res.render("blog/edit", { post: post });
    }
  });
});

router.put("/blog/:id", middleware.isAdmin, function (req, res) {
  newData = {
    title: req.body.title,
    image: req.body.image,
    content: req.body.content,
  };
  Post.updateOne({ _id: req.params.id }, newData, function (err, returnedData) {
    if (err) {
      console.log("Some error Occured");
    } else {
      // console.log(returnedData)
      res.redirect("/postsuser");
    }
  });
});

router.delete("/blog/:id", middleware.isAdmin, function (req, res) {
  Post.remove({ _id: req.params.id }, function (err, returnedData) {
    if (err) {
      console.log("Some error occured");
    } else {
      // console.log(returnedData)
      res.redirect("/postsuser");
    }
  });
});

router.get(
  "/userpost",
  middleware.checkLoggedIn,
  middleware.isAdmin,
  async function (req, res) {
    const posts = await Post.find({});
    const users = await User.find({});
    res.render("admin/users", {
      posts,
      users,
    });
  }
);

router.get("/edituser/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).redirect("/404");
  }
  res.render("admin/edituser", { user });
});

router.post("/edituser/:id", async (req, res) => {
  const u = await User.findById(req.params.id);
  if (!u) {
    return res.status(404).redirect("/404");
  }
  const user = await User.findByIdAndUpdate(req.params.id, {
    username: req.body.username,
    email: req.body.email,
    entity: req.body.entity,
    Age: req.body.Age,
    image: req.body.image,
  });
  await user.save();
  res.redirect("/userpost");
});

// router.get("/editPass", async (req, res) => {
 
//   res.render("admin/editPass");
// });

// router.post("/editpass/:id", async (req, res) => {
//   const u = await User.findById(req.params.id);
//   if (!u) {
//     return res.status(404).redirect("/404");
//   }
//   const pass=await bcryptjs.hash(u.password);
//   const Opass=await bcryptjs.hash(req.body.Oldpassword);
//   if (pass === Opass) {
//     if (req.body.newpassword === req.body.conpassword) {
//       const password = await bcryptjs.hash(req.body.newpassword);
//       const user = await User.findByIdAndUpdate(req.params.id, {
//         password: password,
//       });
//       await user.save();
//       res.redirect("/");
//     } else {
//       req.flash("error", "Your newpassword doesen't Confirmed");
//     }
//   }else{
//     req.flash("error", "Your Old password doesent match");
//   }
// });

router.get("/user/Delete/:id", async (req, res) => {
  const id = req.params.id;
  const u = await User.findById(id);
  if (!u) {
    return res.status(404).redirect("/404");
  }

  await User.findByIdAndRemove(id);
  res.redirect("/userpost");
});

module.exports = router;
