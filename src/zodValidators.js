const { z } = require("zod");

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(5),
  role: z.enum(["admin", "user"]),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

const subscribeSchema = z.object({
  symbols: z.array(z.string().min(1)).min(1),
});

const alertSchema = z.object({
  symbol: z.string().min(1),
  direction: z.enum(["above", "below"]),
  targetPrice: z.number().nonnegative(),
});

module.exports = {
  signupSchema,
  loginSchema,
  subscribeSchema,
  alertSchema,
};
