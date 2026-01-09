const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Question = require('../models/question');
// const redisClient = require('../redis')

dotenv.config();

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email & password exist
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide both email and password' });
    }

    // Compare with env values
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Generate JWT token
      const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      return res.status(200).json({
        message: 'Admin login successful',
        admin: {
          email,
          role: 'admin',
        },
        token,
      });
    } else {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json({
      message: 'Users fetched successfully',
      users,
    });
  } catch (error) {
    res.status(400).json({ message: "Can't find users", error: error.message });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: 'No user found' });
    }

    res.status(200).json({
      message: 'User found successfully',
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: "Can't find user",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await User.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No user found' });
    }

    res.status(200).json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      message: "Can't delete user",
      error: error.message,
    });
  }
};

const createQuestion = async (req, res) => {
  try {
    const { id, category, question, options, ans, difficulty } = req.body;

    const createdQuestion = await Question.create({
      id,
      category,
      question,
      options,
      ans,
      difficulty,
    });

    res.status(201).json(createdQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedQuestion = await Question.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Question.findOneAndDelete({ _id: id });

    if (!deleted) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllQuestion = async (req, res) => {
  try {
    const questions = await Question.find({});

    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: 'Questions not found' });
    }

    res.status(200).json({
      message: 'Questions fetch successful',
      questions,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  adminLogin,
  getAllUsers,
  getUser,
  deleteUser,
  createQuestion,
  editQuestion,
  deleteQuestion,
  getAllQuestion,
};
