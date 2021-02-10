import mongoose from "mongoose";

const { Schema } = mongoose;

const voteSchema = new Schema({
  candidateFullName: String,
  votes: Number,
});

const Vote = mongoose.model("Vote", voteSchema);

export default Vote;
