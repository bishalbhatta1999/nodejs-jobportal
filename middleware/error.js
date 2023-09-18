//errror middleware
const errorMiddleware = (err, req, res, next) => {
  console.log(err);

  if (err.name == "ValidationError") {
    let errors = Object.entries(err.errors).map((error) => {
      return {
        params: error[0],
        msg: error[1].message,
      };
    });
    res.status(400).send({
      message: "Bad request",
      process: "failed",
      err: err.message,
      errors,
    });
  } else {
    res.status(500).send({
      message: "Server Error",
      errors: err.message,
      err,
    });
    console.log(err);
  }
};

export default errorMiddleware;
