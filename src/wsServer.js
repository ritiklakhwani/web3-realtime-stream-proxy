const WebSocket = require("ws");
const state = require("./state");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;