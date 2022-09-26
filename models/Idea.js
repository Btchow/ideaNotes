import mongoose from "mongoose";
const { Schema } = mongoose;

const IdeaSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Idea = mongoose.model("Idea", IdeaSchema);
export default Idea;
