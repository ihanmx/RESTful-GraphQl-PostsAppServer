import User from "../models/user.js";
import bcrypt from "bcryptjs";
import validator from "validator";
export default {
  createUser: async function ({ userInput }, req) {
    // const email=args.userInput.email
    const errors = [];
    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new Error("The user exists already!");
      throw error;
    }

    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "Email is invalid" });
    }
    if (
      !validator.isEmpty(userInput.password) ||
      !validator.isLength({ min: 5 })
    ) {
      errors.push({ message: "password too short!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const hashedPw = await bcrypt.hash(userInput.password, 10);
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPw,
    });

    const result = await user.save();

    return { ...result._doc, _id: result._id.toString() };
  },
};
