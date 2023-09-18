import mongoose from "mongoose";
import JWT from "jsonwebtoken";
// import validator from "validator";
// schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      validate: {
        validator: async function (req_value) {
          let count = await mongoose.models.User.countDocuments({
            email: req_value,
          });
          if (count) {
            return false;
          }
          return true;
        },
        message: "email already used.....",
      },
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false,
    },
  },
  { timestamps: true }
);
// json  webtoken
userSchema.methods.createJWT = function () {
  return JWT.sign({ userId: this._id }, process.env.JWT_SECRET);
};
export default mongoose.model("User", userSchema);
