import bcrypt from "bcryptjs";
import User from "../models/User.js";
import passport from "passport";
import passportConfig from "../config/passportConfig.js";

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
  });
};
