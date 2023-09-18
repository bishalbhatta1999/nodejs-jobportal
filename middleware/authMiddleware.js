import JWT from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  //   let token = req.headers?.authorization?.split("")[1];

  //   let user = null;
  //   try {
  //     let decoded = JWT.verify(token, process.env.JWT_SECRET);
  //     user = decoded;
  //     if (decoded) {
  //       res.send(req.body);
  //     } else {
  //       res.status(401).send({
  //         msg: "unauthenticated",
  //       });
  //     }
  //   } catch (err) {
  //     //res.status(401).send({
  //     // msg: "auth failed",
  //     // error: err.esssage,
  //     // });ERR
  //     res.send(err);
  //     console.log(err);
  //   }
  // };

  let authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).send({
      msg: "auth failed",
    });
  }
  const token = authHeader.split(" ")[1];
  //console.log(token);
  try {
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId };
    next();
  } catch (err) {
    next(err);
    console.log(err);
  }
};
export default userAuth;
