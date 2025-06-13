const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');


router.post('/register-student', authController.registerStudent);
router.post('/register-faculty', authController.registerFaculty);
router.post('/register-admin', authController.registerAdmin);
router.post('/login', authController.login);
router.post('/me', protect, authController.getUser);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/faculty', protect, authController.getFaculty); // Line 9

module.exports = router;