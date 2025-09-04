// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { addUser, findUser } = require('../models/userStore');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// 📝 Sign Up Route
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request body:', req.body);
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send('Missing fields');

    if (findUser(email)) return res.status(400).send('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    addUser({ email, password: hashedPassword });

    res.status(201).send('User registered successfully');
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).send('Internal server error');
  }
});

// 🔐 Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = findUser(email);

  if (!user) return res.status(401).send('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).send('Invalid credentials');

  const token = jwt.sign({ email: user.email }, JWT_SECRET, {
    expiresIn: '1h',
  });
  res.json({ token });
});

module.exports = router;
