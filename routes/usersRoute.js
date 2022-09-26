import express from "express";
import {
  getReg,
  postReg,
  getLogin,
  postLogin,
  getLogout,
  getProfile,
} from "../controller/userController.js";

const router = express.Router();

router.route("/register").get(getReg).post(postReg);
router.route("/login").get(getLogin).post(postLogin);
router.get("/logout", getLogout);
router.get("/profile", getProfile);

export default router; //router is an object
