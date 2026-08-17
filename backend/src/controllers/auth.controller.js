const { z } = require('zod');
const authService = require('../services/auth.service');

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

async function login(req, res) {
  const { email, password } = loginSchema.parse(req.body);
  const result = await authService.login(email, password);
  res.json(result);
}

async function me(req, res) {
  const profile = await authService.getProfile(req.user.sub);
  res.json(profile);
}

module.exports = { login, me };
