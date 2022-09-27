import express from "express";
import {
  getReg,
  postReg,
  getLogin,
  postLogin,
  getLogout,
  getProfile,
  uploadAvatar,
  postProfile,
  deleteProfile,
} from "../controller/userController.js";

import ensureAuthenticated from "../helpers/auth.js";

const router = express.Router();

router.route("/register").get(getReg).post(postReg);
router.route("/login").get(getLogin).post(postLogin);
router.get("/logout", getLogout);
// router.get("/profile", getProfile);
router
  .route("/profile")
  .get(ensureAuthenticated, getProfile)
  .post(ensureAuthenticated, uploadAvatar)
  .post(ensureAuthenticated, postProfile)
  .delete(ensureAuthenticated, deleteProfile);
// router.post("/profile",uploadAvatar, postProfile);

export default router; //router is an object
