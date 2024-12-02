import mongoose from "mongoose";

const Schema = mongoose.Schema;

const DBSchema = new Schema(
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

const Staff = mongoose.model("staff", DBSchema);
export default Staff;