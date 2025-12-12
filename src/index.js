require("dotenv").config();
const express = require("express");
const app = express();
const { z } = require("zod");
const {
  signupSchema,
  loginSchema,
  subscribeSchema,
  alertSchema,
} = require("./zodValidators");
const bcrypt = require("bcrypt");
const state = require("./state");
const jwt = require("jsonwebtoken");
const { user, alert, watchlist } = require("./db");
const { auth } = require("./middleware");

const secret = process.env.JWT_SECRET;

app.use(express.json());

//auth routes
app.post("/api/auth/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid request schema",
    });
  }

  const { name, email, password, role } = parsed.data;

  const existingUser = await user.findOne({ email: email });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: "user already exists!",
    });
  }

  const hashed = await bcrypt.hash(password, 10);

  const User = await user.create({
    name,
    email,
    password: hashed,
    role,
  });

  res.status(201).json({
    success: true,
    data: {
      _id: User._id,
      name: User.name,
      email: User.email,
      role: User.role,
    },
  });
});

app.post("/api/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid request schema",
    });
  }

  const { email, password } = parsed.data;

  const existingUser = await user.findOne({ email: email });

  if (!existingUser) {
    return res.status(400).json({
      success: false,
      error: "please signup first!",
    });
  }

  const verifyPass = await bcrypt.compare(password, existingUser.password);

  if (!verifyPass)
    return res
      .status(401)
      .json({ success: false, error: "Invalid credentials" });

  const token = jwt.sign(
    {
      id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    },
    secret
  );

  res.status(201).json({
    success: true,
    token: token,
  });
});

app.get("/api/auth/me", auth, (req, res) => {
  const user = req.user;
  res.status(201).json({
    success: true,
    data: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

//watch list routes
app.post("/api/watchlist", auth, async (req, res) => {
  const { symbol } = req.body;
  if (!symbol) {
    return res.status(401).json({
      success: false,
      error: "symbol required",
    });
  }
  console.log("hello1");
  const User = await user.findOne({ _id: req.user.id });
  console.log("hello2");
  if (!User) {
    return res.status(401).json({
      success: false,
      error: "user not found!",
    });
  }
  console.log("hello3");
  if (!User.watchlist.includes(symbol)) {
    User.watchlist.push(symbol);
    await User.save();
  }

  return res.status(201).json({
    success: true,
    message: "Added to watchlist",
    data: User.watchlist,
  });
});

app.get("/api/watchlist", auth, async (req, res) => {
  const User = await user.findOne({ _id: req.user.id });
  if (!User) {
    return res.status(401).json({
      success: false,
      error: "user not found!",
    });
  }
  return res.status(201).json({
    success: true,
    data: User.watchlist,
  });
});

app.delete("/api/watchlist/:symbol", auth, async (req, res) => {
  const { symbol } = req.params;
  if (!symbol) {
    return res.status(401).json({
      success: false,
      error: "user or symbol not found!",
    });
  }

  const User = await user.findOne({ _id: req.user.id });
  if (!User) {
    return res.status(401).json({
      success: false,
      error: "cannot find user!",
    });
  }

  User.watchlist = User.watchlist.filter((s) => s !== symbol);
  User.save();

  return res.status(201).json({
    success: true,
    msg: "removed symbol from watchlist!",
    updatedWatchlist: User.watchlist,
  });
});

//alert routes
app.post("/api/alerts", auth, async (req, res) => {
  const parsed = alertSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid request schema",
    });
  }

  const { symbol, direction, targetPrice } = parsed.data;

  const Alerts = await alert.create({
    userId: req.user.id,
    symbol: symbol,
    direction: direction,
    targetPrice: targetPrice,
  });

  return res.status(201).json({
    success: true,
    data: Alerts,
  });
});

app.get("/api/alerts", auth, async (req, res) => {
  const Alerts = await alert.find({ userId: req.user.id });
  if (!Alerts) {
    return res.status(400).json({
      success: false,
      error: "alerts not found!",
    });
  }
  return res.status(201).json({
    success: true,
    data: Alerts,
  });
});

app.delete("/api/alerts/:id", auth, async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      error: "id not found!",
    });
  }

  const Alerts = await alert.findById(id);
  if (!Alerts || Alerts.userId.toString() !== req.user.id) {
    return res.status(400).json({
      success: false,
      error: "Alert not found!",
    });
  }

  await Alerts.deleteOne();
  return res.status(201).json({ success: true,msg: "alert deleted!", data: Alerts });
});

app.get("/api/ticks", auth, async (req, res) => {
  return res.status(201).json({ success: true, data: state.ticks });
});

app.listen(3000, () => {
  console.log("server started on port 3000!");
});
