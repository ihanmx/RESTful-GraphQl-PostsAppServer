import User from "../models/user.js";

const getStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }
    return res.status(200).json({ message: "Status fetched!", status: user.status });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  const status = req.body.status;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }
    user.status = status;
    const result = await user.save();
    return res.status(200).json({ message: "Status updated!", status: result.status });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export { getStatus, updateStatus };
