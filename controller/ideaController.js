import Idea from "../models/Idea.js";

//functional base writing style
//can write in Class way, minise file size
const allIdeaFn = {
  getIdeas: (req, res) => {
    Idea.find({ user: res.locals.user._id })
      .lean() //change from json to object
      .sort({ date: "desc" })
      .then((ideas) => {
        console.log(ideas);
        res.render("ideas/index", { ideas: ideas });
      });
  },

  postAddIdea: (req, res) => {
    let errors = [];
    //push error msg if empty
    console.log(req.body);
    if (!req.body.title) {
      errors.push({ text: "Please add a tilte" });
    }
    if (!req.body.details) {
      errors.push({ text: "Please add a details" });
    }
    //if there are errors, render the page with error msg
    if (errors.length > 0) {
      res.render("ideas/add", {
        errors: errors,
        title: req.body.title, //vis bodypaser, create req.body, then add varible(title) into it
        details: req.body.details,
      });
    } else {
      // res.send("passed");
      const newUser = {
        title: req.body.title,
        details: req.body.details,
        user: res.locals.user._id,
      };
      new Idea(newUser).save().then((idea) => {
        req.flash("success_msg", "Note Added !");
        res.redirect("/ideas");
      });
    }
  },

  getAddIdea: (req, res) => {
    res.render("ideas/add");
  },

  //remark: must use _id in this mongoose version!!!!
  //with lean()-> the average execution time is less.
  getEditIdea: (req, res) => {
    Idea.findOne({ _id: req.params.id }) //params = id, _id = id number
      .lean()
      .then((idea) => {
        res.render("ideas/edit", { idea: idea });
      });
  },

  putEditIdea: (req, res) => {
    Idea.findOne({ _id: req.params.id }).then((idea) => {
      idea.title = req.body.title;
      idea.details = req.body.details;
      idea.save().then(() => {
        req.flash("success_msg", "Note Updated !");
        res.redirect("/ideas");
      });
    });
  },

  deleteIdea: (req, res) => {
    Idea.deleteOne({ _id: req.params.id }).then(() => {
      req.flash("error_msg", "Note Deleted");
      res.redirect("/ideas");
    });
  },

  getRecords: (req, res) => {
    Idea.aggregate([
      { 
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userInfo", //as = results, set a new qureny name
        },
      },
      {
        $unwind: {
          path: "$userInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          "date": -1,
        },
      },
    ]).then((recordsDB) => {
        console.log(recordsDB);
      res.render("ideas/records", { records: recordsDB });
    });
  },
};

//if export the whole object -> export default function;
//if export just one function -> export const function xxxx
export default allIdeaFn;
