const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  deptNo: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/^[0-9]{10}$/, 'Phone number must be 10 digits']
  },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['student', 'admin'], 
    default: 'student' 
  },
  position: { 
    type: String, 
    enum: ['student', 'manager'], 
    default: 'student' 
  },
  resetPasswordToken: { type: String },
  resetPasswordExpiry: { type: Date }
}, {
  collection: 'users',
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);