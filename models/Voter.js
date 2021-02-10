import mongoose from "mongoose";

const { Schema } = mongoose;

const voterSchema = new Schema({
  lastName: String,
  firstName: String,
  birthDate: Date,
  idVote: {
    type: String,
    unique: true,
  },
});

const Voter = mongoose.model("Voter", voterSchema);

export default Voter;
