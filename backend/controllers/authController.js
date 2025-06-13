const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Faculty = require('../models/Faculty');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmail } = require('../utils/email');

// Existing functions
exports.registerStudent = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('deptNo').trim().notEmpty().withMessage('Department number is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Phone number must be 10 digits'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().equals('student').withMessage('Role must be student'),
  body('position').optional().equals('student').withMessage('Position must be student'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, deptNo, email, phone, password } = req.body;

    try {
      console.log('Registering student:', { name, deptNo, email, phone });
      let user = await User.findOne({ $or: [{ email }, { deptNo }, { phone }] });
      if (user) return res.status(400).json({ message: 'User already exists' });

      user = new User({
        name,
        deptNo,
        email,
        phone,
        password: await bcrypt.hash(password, 10),
        role: 'student',
        position: 'student'
      });

      await user.save();
      console.log('Student saved:', user._id);

      await sendEmail({
        to: email,
        subject: 'Welcome to College Complaint Portal',
        text: `Hi ${name},\n\nYour account has been created successfully.\nDept No: ${deptNo}\nPhone: ${phone}\nRole: Student\n\nLogin at http://localhost:5173/login`,
        html: `<h1>Welcome, ${name}!</h1><p>Your account has been created successfully.</p><p><strong>Dept No:</strong> ${deptNo}</p><p><strong>Phone:</strong> ${phone}</p><p><strong>Role:</strong> Student</p><p><a href="http://localhost:5173/login">Login here</a></p>`
      });

      res.status(201).json({ message: 'Student registered successfully' });
    } catch (error) {
      console.error('Register student error:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];
exports.registerFaculty = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('facultyId').trim().notEmpty().withMessage('Faculty ID is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Phone number must be 10 digits'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('role').optional().equals('faculty').withMessage('Role must be faculty'),
  body('position').optional().equals('staff').withMessage('Position must be staff'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, facultyId, email, phone, password, department } = req.body;

    try {
      const normalizedFacultyId = facultyId.toLowerCase();
      console.log('Registering faculty:', { name, facultyId: normalizedFacultyId, email, phone });
      let faculty = await Faculty.findOne({ $or: [{ email }, { facultyId: normalizedFacultyId }, { phone }] });
      if (faculty) return res.status(400).json({ message: 'Faculty already exists' });

      faculty = new Faculty({
        name,
        facultyId: normalizedFacultyId,
        email,
        phone,
        password: await bcrypt.hash(password, 10),
        department,
        role: 'faculty',
        position: 'staff'
      });

      await faculty.save();
      console.log('Faculty saved:', faculty._id);

      await sendEmail({
        to: email,
        subject: 'Welcome to College Complaint Portal',
        text: `Hi ${name},\n\nYour faculty account has been created successfully.\nFaculty ID: ${normalizedFacultyId}\nPhone: ${phone}\nRole: Faculty\n\nLogin at http://localhost:5173/login`,
        html: `<h1>Welcome, ${name}!</h1><p>Your faculty account has been created successfully.</p><p><strong>Faculty ID:</strong> ${normalizedFacultyId}</p><p><strong>Phone:</strong> ${phone}</p><p><strong>Role:</strong> Faculty</p><p><a href="http://localhost:5173/login">Login here</a></p>`
      });

      res.status(201).json({ message: 'Faculty registered successfully' });
    } catch (error) {
      console.error('Register faculty error:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];
exports.registerAdmin = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('deptNo').trim().notEmpty().withMessage('Department number is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Phone number must be 10 digits'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('secret').equals(process.env.ADMIN_SECRET).withMessage('Invalid admin secret'),
  body('role').optional().equals('admin').withMessage('Role must be admin'),
  body('position').optional().equals('manager').withMessage('Position must be manager'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, deptNo, email, phone, password } = req.body;

    try {
      console.log('Registering admin:', { name, deptNo, email, phone });
      let user = await User.findOne({ $or: [{ email }, { deptNo }, { phone }] });
      if (user) return res.status(400).json({ message: 'User already exists' });

      user = new User({
        name,
        deptNo,
        email,
        phone,
        password: await bcrypt.hash(password, 10),
        role: 'admin',
        position: 'manager'
      });

      await user.save();
      console.log('Admin saved:', user._id);

      await sendEmail({
        to: email,
        subject: 'Welcome to College Complaint Portal',
        text: `Hi ${name},\n\nYour admin account has been created successfully.\nDept No: ${deptNo}\nPhone: ${phone}\nRole: Admin\n\nLogin at http://localhost:5173/login`,
        html: `<h1>Welcome, ${name}!</h1><p>Your admin account has been created successfully.</p><p><strong>Dept No:</strong> ${deptNo}</p><p><strong>Phone:</strong> ${phone}</p><p><strong>Role:</strong> Admin</p><p><a href="http://localhost:5173/login">Login here</a></p>`
      });

      res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
      console.error('Register admin error:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];
exports.login = [
  body('identifier').trim().notEmpty().withMessage('Identifier is required'),
  body('password').notEmpty().withMessage('Password is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const identifier = req.body.identifier.trim().toLowerCase();
    const { password } = req.body;

    try {
      let user = await User.findOne({
        $or: [
          { deptNo: identifier.toUpperCase() },
          { email: identifier },
          { phone: identifier }
        ]
      });

      if (!user) {
        user = await Faculty.findOne({
          $or: [
            { facultyId: { $regex: `^${identifier}$`, $options: 'i' } },
            { email: identifier }
          ]
        });
      }

      console.log('Login identifier:', identifier);
      console.log('Found user:', user ? { _id: user._id, role: user.role } : null);

      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign(
        { id: user._id, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({ token, role: user.role, name: user.name });
    } catch (error) {
      console.error('Login error:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
];

exports.forgotPassword = [
  body('email').isEmail().withMessage('Invalid email'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email } = req.body;

    try {
      console.log('Forgot password for email:', email);
      let user = await User.findOne({ email });
      if (!user) {
        user = await Faculty.findOne({ email });
      }

      if (!user) return res.status(404).json({ message: 'User not found' });

      const resetToken = crypto.randomBytes(32).toString('hex');
      console.log('Generated reset token:', resetToken);
      const resetTokenExpiry = Date.now() + 3600000; // 1 hour

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpiry = resetTokenExpiry;
      await user.save();
      console.log('User updated with reset token:', user._id);

      const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
      await sendEmail({
        to: email,
        subject: 'Password Reset Request',
        text: `Hi ${user.name},\n\nYou requested a password reset. Click here to reset: ${resetUrl}\n\nThis link expires in 1 hour.`,
        html: `<h1>Password Reset</h1><p>Hi ${user.name},</p><p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p><p>This link expires in 1 hour.</p>`
      });

      res.json({ message: 'Password reset email sent' });
    } catch (error) {
      console.error('Forgot password error:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];

exports.resetPassword = [
  body('token').notEmpty().withMessage('Token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { token, password } = req.body;

    try {
      let user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpiry: { $gt: Date.now() }
      });

      if (!user) {
        user = await Faculty.findOne({
          resetPasswordToken: token,
          resetPasswordExpiry: { $gt: Date.now() }
        });
      }

      if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

      user.password = await bcrypt.hash(password, 10);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiry = undefined;
      await user.save();

      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Reset password error:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
];

// Add getFaculty
exports.getFaculty = async (req, res) => {
  try {
    // Restrict to admin only
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const faculty = await Faculty.find().select('name facultyId email department');
    res.json({ faculty });
  } catch (error) {
    console.error('Get faculty error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getUser = async (req, res) => {
  try {
    console.log('Fetching user:', req.user.id);
    let user = await User.findById(req.user.id).select('-password');
    if (!user) {
      user = await Faculty.findById(req.user.id).select('-password');
    }
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};