import express from "express";
import { engine } from "express-handlebars";
import mongoose from "mongoose";
import flash from "connect-flash";
import session from "express-session";

import bodyParser from "body-parser";
import morgan from "morgan";
import methodOverride from "method-override";
import ideasRoute from "./routes/ideasRoute.js";
import usersRoute from "./routes/usersRoute.js";
import passport from "passport";
import passportConfig from "./config/passportConfig.js";
passportConfig(passport);
import dotenv from "dotenv";
dotenv.config();
// console.log(process.env.PORT);
// console.log(process.env.MONGO_URI);

//{} -> take thg inside, no {}-> take the whole page

const app = express();
mongoose
  // .connect("mongodb://localhost:27017/note-dev")
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongodb connected ..");
  })
  .catch((err) => console.log(err));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(morgan("tiny"));
app.use(express.static("views/public"));
//start middleware -> handling sth
//body paser -> handling input data
//middleware type "use"
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));

//seesion -> save user login data
app.use(
  session({
    secret: "anything",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 1000, //30 second
    },
  })
); //return a value, put it to "use"

//flash create space(locals) to save varible which attach to res
//lcaols is the buildin name of global vaible name in middle ware!!!
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg"); //passing this local to passport local
  res.locals.error_msg = req.flash("error_msg");
  res.locals.fail_passport = req.flash("fail_passport");
  res.locals.user = req.user || null;
  //add console log for user status checking
  console.log(`=====login user=====`, res.locals.user);
  next(); //use that to connect the next
});

//run line by line, 多人用既放上面，ex login, homepage
//put 404 at the bottom
app.get("/", (req, res) => {
  // console.log(req.name);
  const title = "Wellcome";
  res.render("index", { title: title });
}); //,{title: title} -> use object instead of varible, cz just need pass address, can contain more thgs inside

app.get("/about", (req, res) => {
  res.render("about");
}); //cz hv handlebar, so change res.send to res.ernder

import ensureAuthenticated from "./helpers/auth.js";
app.use("/ideas", ensureAuthenticated, ideasRoute);
app.use("/users", usersRoute);

app.use("*", (req, res) => {
  res.status(404);
  res.render("404");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
