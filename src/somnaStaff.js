import mongoose from "mongoose";

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

const SomnaStaff = mongoose.model("somnacreare-staff", SomnaStaffSchema);
export default SomnaStaff;