import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

/**
 * Generate JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

/**
 * NEW: Get Referrer Name by Code
 * Used by the registration page to show "You are being referred by [Name]"
 */
export const getReferrerName = async (req, res) => {
  try {
    const { code } = req.params;
    
    // Find the user who owns this code and only return their name
    const referrer = await User.findOne({ referralCode: code.toUpperCase() }).select('name');
    
    if (!referrer) {
      return res.status(404).json({
        success: false,
        message: 'Invalid referral code',
      });
    }

    res.json({
      success: true,
      name: referrer.name,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching referrer',
      error: error.message,
    });
  }
};

/**
 * Register new user
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, referralCode } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Find referrer if referral code provided
    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
      if (referrer) {
        referredBy = referrer._id;
      }
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      referredBy,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          referralCode: user.referralCode,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message,
    });
  }
};

/**
 * Login user
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          referralCode: user.referralCode,
          balances: user.balances,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message,
    });
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    res.json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message,
    });
  }
};