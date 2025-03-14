
import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User, { UserRole } from '../models/User';
import { auth } from '../middleware/auth';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').isIn([UserRole.STUDENT, UserRole.ALUMNI]).withMessage('Role must be student or alumni'),
    body('program').notEmpty().withMessage('Program is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      // Check if user exists
      const userExists = await User.findOne({ email: req.body.email }).exec();
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Additional validation based on role
      if (req.body.role === UserRole.STUDENT) {
        if (!req.body.registrationNumber) {
          return res.status(400).json({ message: 'Registration number is required for students' });
        }
      } else if (req.body.role === UserRole.ALUMNI) {
        const requiredFields = [
          'graduationYear', 'jobTitle', 'companyName', 
          'industry', 'workExperience', 'location'
        ];
        
        for (const field of requiredFields) {
          if (!req.body[field]) {
            return res.status(400).json({ message: `${field} is required for alumni` });
          }
        }
      }

      // Create user instance
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        program: req.body.program,
        // Additional fields based on role
        ...(req.body.role === UserRole.STUDENT ? {
          registrationNumber: req.body.registrationNumber
        } : {}),
        ...(req.body.role === UserRole.ALUMNI ? {
          phoneNumber: req.body.phoneNumber || '',
          graduationYear: req.body.graduationYear,
          jobTitle: req.body.jobTitle,
          companyName: req.body.companyName,
          industry: req.body.industry,
          workExperience: req.body.workExperience,
          location: req.body.location,
          linkedinProfile: req.body.linkedinProfile || '',
        } : {})
      });

      await user.save();

      res.status(201).json({ 
        message: 'User registered successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    try {
      // Check for user
      const user = await User.findOne({ email }).select('+password').exec();
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Create token
      const payload = {
        user: {
          id: user._id
        }
      };

      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || 'secrettoken',
        { expiresIn: '24h' }
      );

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.json({
        token,
        user: userResponse
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user?.id).exec();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
