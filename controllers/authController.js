const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// Signup Controller
const SignupForm = async (req, res) => {
  const { userName, email, password } = req.body;
  console.log(userName)
  if (!userName || !email || !password)
    return res.status(400).send({ message: "some fields is required" });

  const response = await User.findOne({ email });
  if (response) {
    return res.status(400).json({ message: "your email is already exist enter another email" });
  }

  const hash = await bcrypt.hash(password, Number(process.env.SALTROUND));
  await User.create({ userName, email, password: hash });
  return res.status(201).json({ message: "user register successfully " });
};

// Login Controller
const loginForm = async (req, res) => {
  const { email, password } = req.body;
  console.log("login", email, password)
  if (!email || !password)
    return res.status(400).json({ message: "some fields is required" });

  try {
    const response = await User.findOne({ email });
    if (!response) {
      return res.status(404).json({ message: "please enter valid email " });
    }

    const checkPass = await bcrypt.compare(password, response.password);
    if (!checkPass) {
      return res.status(404).json({ message: "please enter valid password" });
    }

    jwt.sign({ email, password }, process.env.SECRET_KEY, { expiresIn: "2h" }, (err, token) => {
      if (err) {
        return res.status(500).json({ message: "server error" });
      }
      res.cookie("token", token);
      return res.status(200).json({ message: `login successful with email ${email}`, response, token });
    }
    );
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "server error" });
  }
};

// Forget Password Controller
const forgetPassword = async (req, res) => {
  const { email } = req.body;
  console.log("email", email)
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ message: "Wrong email, enter correct email" });

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "1d" });
  if (!token) {
    return res.status(500).json({ message: "Server error" });
  }

  res.cookie("token", token);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset your password",
    html: `<a href='http://localhost:5173/reset-password/${token}'>Click here to reset your password</a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("error send email", error)
      return res.status(500).json({ message: "Failed to send email", error });
    }
    return res.status(200).json({ message: `Email sent to ${email}`, token });
  });
};

// Reset Password Controller
const reset_forgetPassword = async (req, res) => {
  const { password } = req.body;
  console.log("pasword", password)
  if (!password) return res.status(404).json({ message: "password is required" })
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const hash = await bcrypt.hash(password, Number(process.env.SALTROUND));
    user.password = hash;
    await user.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: "Error resetting password" });
  }
};


module.exports = {
  SignupForm,
  loginForm,
  forgetPassword,
  reset_forgetPassword
};
