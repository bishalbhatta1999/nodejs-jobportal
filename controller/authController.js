import Joi from "joi";
import bcrypt from "bcrypt";
import User from "../model/User.js";
import jwt from "jsonwebtoken";
//joi validation

const schema = Joi.object({
  name: Joi.string().required(),

  password: Joi.string().required().min(6),

  repeat_password: Joi.ref("password"),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
});

export const registerController = async (req, res, next) => {
  try {
    //joi validation part
    let { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });
    console.log(error);
    // console.log(error?.details);
    if (error?.details) {
      return res.status(400).send({
        errors: error?.details,
      });
    }
    console.log(error);
    //const { name, email, password } = req.body;

    //validate
    // if (!name) {
    //   return res.status(400).send({
    //     message: "please provide name",
    //   });
    // }

    // if (!email) {
    //   return res.status(400).send({
    //     message: "please provide email",
    //   });
    // }
    // if (!password) {
    //   return res.status(400).send({
    //     message: "please provide password",
    //   });
    // }
    // const existUser = await User.findOne({ email });
    // if (existUser) {
    //   return res.send({
    //     message: "Email Already Register Please Login",
    //   });
    // }
    let hashed = await bcrypt.hash(req.body.password, 10);
    // console.log(hashed);
    const user = await User.create({ ...req.body, password: hashed });
    // token
    const token = user.createJWT();
    res.send({
      message: "User is created successfully",
      user: {
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    next(err);
    console.log(err);
    //console.log(error.name);
  }
};

// log in schema validation
const loginSchemaValidation = Joi.object({
  password: Joi.string().required(),

  //repeat_password: Joi.ref("password"),

  email: Joi.string().email().required(),
});

export const loginController = async (req, res, next) => {
  /* 1.take password and email from req.body
  2.check if user exist
  3.check password matched or not
   */

  try {
    let { error } = loginSchemaValidation.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });
    // console.log(error?.details);
    if (error?.details) {
      return res.status(400).send({
        errors: error?.details,
      });
    }
    let user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (user) {
      console.log(user);

      let matched = await bcrypt.compare(req.body.password, user.password);
      if (matched) {
        user.password = undefined;

        // let token = JWT.sign(user.toObject(), process.env.JWT_SECRET);
        const token = user.createJWT();
        res.send({
          msg: "Login Successful",
          user,
          token,
        });
      } else {
        res.status(401).send({
          msg: "Invalid Credentials",
        });
      }
    } else
      res.status(401).send({
        msg: "Invalid Credentials",
      });
  } catch (err) {
    next(err);
  }
};
