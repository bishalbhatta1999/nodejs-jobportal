import User from "../model/User.js";
import JWT from "jsonwebtoken";

export const updateUserController = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      res.status(400).send({ msg: "Please enter the required fields" });
    }
    const user = await User.findOne({ _id: req.user.userId });

    user.name = name;
    user.email = email;
    //await user.save();
    //const token = user.createJWT();

    res.send({
      user,
      // token,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};
