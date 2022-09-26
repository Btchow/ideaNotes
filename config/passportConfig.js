//put in config file, cz is from other ppl module
//third party pulg-in
//but not ur programme

import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import User from "./../models/User.js";

export default function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "emailInput" }, function (
      emailInput,
      password,
      done
    ) {
      //console.log -> checking
      console.log(`inside config: ${0} ${1}`, emailInput, password);
      User.findOne({ email: emailInput }).then((user) => {
        if (!user) {
          return done(null, false, {
            type: "fail_passport",
            message: "No User Found",
          });
        } else {
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, {
                type: "fail_passport",
                message: "Password Incorrect",
              });
            }
          });
        }
      });
    })
  );
  //err is global error msg in node

  //serialize -> generate token
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}
