import express from "express";
import allIdeaFn from "../controller/ideaController.js";

const router = express.Router();
//post-> wont show thg on url link
//add note add router
//req is an object
//put for update data
router.get("/", allIdeaFn.getIdeas);

//diff writing style
router.route("/add").post(allIdeaFn.postAddIdea).get(allIdeaFn.getAddIdea);
// router.post("/add", allIdeaFn.postAddIdea).get("/add", allIdeaFn.getAddIdea);
router
  .get("/edit/(:id)", allIdeaFn.getEditIdea)
  .put("/edit/(:id)", allIdeaFn.putEditIdea);
router.delete("/(:id)", allIdeaFn.deleteIdea);
router.get("/records", allIdeaFn.getRecords);

export default router;
