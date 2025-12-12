require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const auth = (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized, token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(err);
    res.status(401).json({
      success: false,
      error: "Unauthorized, token not verified!",
    });
  }
};

module.exports = {
  auth,
};
