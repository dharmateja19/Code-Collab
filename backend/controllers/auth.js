import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // console.log(name, email, password)

    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return res.status(400).json({ message: "user already exists" });
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedpassword });
    // console.log(user)
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.status(201).json({
      message: "User created",
      token,
      user: {
        name,
        email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "error while registering" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email, password)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );
    res.status(200).json({
      message: "login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "error while login" });
  }
};

export const logout = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};
