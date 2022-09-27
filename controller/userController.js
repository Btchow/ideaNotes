import bcrypt from "bcryptjs";
import User from "../models/User.js";
import passport from "passport";
import passportConfig from "../config/passportConfig.js";
import multer from "multer";
import * as fs from "fs";

const storageSetting = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const uploadAvatar = multer({
  storage: storageSetting,
  fileFilter: (req, file, cb) => {
    const mimetype = file.mimetype;
    if (
      mimetype === "image/png" ||
      mimetype === "image/jpg" ||
      mimetype === "image/jpeg" ||
      mimetype === "image/gif"
    ) {
      cb(null, true);
    } else {
      req.flash("error_msg", "Wrong file type for avatar!");
      cb(null, false);
    }
  },
}).single("avatarUpload"); //single -> handlebars

export const getReg = (req, res) => {
  res.render("users/register");
};

export const postReg = (req, res) => {
  let errors = [];
  if (!req.body.name.length) {
    errors.push({ text: "Name is missing !" });
  }
  if (!req.body.email) {
    errors.push({ text: "Email is missing !" });
  }
  if (req.body.password.length < 4) {
    errors.push({ text: "Password must be at least 4 characters !" });
  }
  if (req.body.password !== req.body.password2) {
    errors.push({ text: "Password do not match !" });
  }
  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2,
    });
  } else {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    //10 is the length of string of bcrypt, can set timeout
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(() => {
            req.flash("success_msg", "Register Done !");
            res.redirect("/users/login");
          })
          .catch((err) => {
            console.log(err);
            req.flash("error_msg", "Server went wrong !");
            res.redirect("/users/register");
          });
      });
    });
  }
};

export const getLogin = (req, res) => {
  res.render("users/login");
};

export const postLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/ideas",
    failureRedirect: "/users/login",
    failureFlash: true,
    session: true,
  })(req, res, next);
};

export const getLogout = (req, res) => {
  console.log("-----user logouted-----");
  req.logout((err) => {
    if (err) throw err;
    req.flash("success_msg", "You're logged out");
    res.redirect("/users/login");
  });
};

export const getProfile = (req, res) => {
  res.render("users/profile", {
    name: res.locals.user.name,
    email: res.locals.user.email,
    avatar: res.locals.user.avatar,
  });

  // if (res.locals.user) {
  //   res.render("users/profile", {
  //     name: res.locals.user.name,
  //     email: res.locals.user.email,
  //     avatar: res.locals.user.avatar,
  //   });
  // } else {
  //   req.flash("error_msg", "Not Authorised");
  //   res.redirect("/users/login");
  // }
};

export const postProfile = (req, res) => {
  User.findOne({ _id: res.locals.user._id }).then((user) => {
    if (req.file) {
      //readfilesync-> wait file
      let avatarData = fs.readFileSync(req.file.path).toString("base64");
      let avatarContentType = req.file.mimetype;

      user.avatar.data = avatarData;
      user.avatar.contentType = avatarContentType;

      //delete the image once uploaded to db
      fs.unlink(req.file.path, (err) => {
        if (err) throw err;
      });

      user.save().then(() => {
        req.flash("success_msg", "avatar uploaded!");
        res.redirect("/users/profile");
      });
    } else {
      req.flash("error_msg", "missing file!");
      res.redirect("/users/profile");
    }
  });
};

export const deleteProfile = (req, res) => {
  User.updateOne({ _id: res.locals.user._id }, { $unset: { avatar: "" } }).then(
    () => {
      req.flash("success_msg", "Avatar successfully deleted!");
      res.redirect("/users/profile");
    }
  );
};
