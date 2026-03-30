import User from "../models/user.js";
const getStatus = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }

      return res
        .status(200)
        .json({ message: "Status fetched!", status: user.status });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const updateStatus = (req, res, next) => {
  const status = req.body.status;

  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }

      user.status = status;

      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Status updated!", status: result.status });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
