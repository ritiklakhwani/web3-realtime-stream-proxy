require("dotenv").config();
const mongoose = require("mongoose");
const { boolean } = require("zod");
const { required } = require("zod/mini");

const connect = process.env.MONGO_URI;

mongoose
  .connect(connect)
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch((e) => {
    console.log("MongoDB connection error!", e);
  });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"] },
  watchlist: { type: [String], default: [] },
});

const alertSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  symbol: { type: String, required: true },
  direction: { type: String, enum: ["above", "below"], required: true },
  targetPrice: { type: Number, required: true },
  active: { type: boolean, default: true },
  triggeredAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

const watchlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  symbols: [String],
});

const user = mongoose.model("User", userSchema);
const alert = mongoose.model("Alert", alertSchema);
const watchlist = mongoose.model("Watchlist", watchlistSchema);

module.exports = {
  user,
  alert,
  watchlist,
};
