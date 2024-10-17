const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const dotenv = require("dotenv");
dotenv.config();

const verifyToken = async (req, res, next) => {
  try {
    const token = req.params.token;
    if (!token) {
      console.log("Token dont received:", token);

      return res.json({ message: "please login" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("Decoded Token:", decoded);

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      throw new Error("User Not Found");
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ message: "Not authorized to access this resource please login" });
  }
};

module.exports = verifyToken;
