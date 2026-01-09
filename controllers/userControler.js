const User = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { Query } = require('mongoose');
const Question = require('../models/question');
const { getStepByStepExplanation } = require('../ai');

dotenv.config();

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // ✅ Create new user
    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Check role correctly
    if (user.role !== role) {
      return res.status(400).json({ message: 'Role mismatch' });
    }

    // Generate JWT token
    const token = generateToken(user.userId, user, role);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        solvedCount: user.solvedCount,
        recentSolved: user.recentSolved,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateSolvedQuestion = async (req, res) => {
  try {
    const { userId, questionId, question, category, correct } = req.body;

    if (!userId || !questionId || !question) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    // Find the user
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update solved count
    user.solvedCount += 1;

    // Push to recentSolved
    user.recentSolved.unshift({
      questionId,
      question,
      category,
      correct,
      solvedAt: new Date(),
    });

    // Limit recentSolved to latest 20 items
    if (user.recentSolved.length > 20) {
      user.recentSolved.pop();
    }

    await user.save();

    res.json({
      message: 'Updated solve history',
      solvedCount: user.solvedCount,
      recentSolved: user.recentSolved,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const explain = async (req, res) => {
  const { question } = req.body;
  const answer = await getStepByStepExplanation(question);
  res.json({ explanation: answer });
};

module.exports = {
  createUser,
  loginUser,
  getUser,
  updateSolvedQuestion,
  explain,
};
