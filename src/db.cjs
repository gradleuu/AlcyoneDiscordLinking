
import mongoose from "mongoose";
import mongodb from "mongodb";

// MongoDB Uri
export const dbUri =
  "mongodb+srv://poster:J5r3xlMyJ5k36U9t@somnacreare.in65n.mongodb.net/?retryWrites=true&w=majority&appName=Somnacreare";

const Schema = mongoose.Schema;

const SomnaStaffSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const SomnaStaff = mongoose.model("Staff", SomnaStaffSchema);
module.exports = SomnaStaff;