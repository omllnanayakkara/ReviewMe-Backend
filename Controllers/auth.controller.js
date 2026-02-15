import { generateToken } from "../lib/generateToken.js";
import User from "../Modals/user.modal.js";
import { errorHandler } from "../lib/error.js";
import bcrypt from "bcryptjs";

// Sign up functionality
export const signUp = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    // Check if all fields are provided
    if (!firstName || !lastName || !email || !password) {
      return next(errorHandler(400, "All fields are required"));
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return next(errorHandler(400, "Email already exists"));
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

// Sign in functionality
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Check if all fields are provided
    if (!email || !password) {
      return next(errorHandler(400, "All fields are required"));
    }

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return next(errorHandler(401, "Invalid password"));
    }

    // Generate JWT token
    const token = generateToken(user);

    res.cookie("reviewMe_token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    const { password: pass, ...userDetails } = user._doc;

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: userDetails,
    });
  } catch (error) {
    next(error);
  }
};
export const signOut = async (req, res, next) => {
  try {
    await res
      .clearCookie("reviewMe_token")
      .status(200)
      .json({ success: true, message: "User signed out successfully" });
  } catch (error) {
    next(error);
  }
};
