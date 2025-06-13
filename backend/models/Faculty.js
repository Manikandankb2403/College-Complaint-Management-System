const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  facultyId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/^[0-9]{10}$/, 'Phone number must be 10 digits']
  },
  password: { type: String, required: true },
  department: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['faculty'], 
    default: 'faculty' 
  },
  position: { 
    type: String, 
    enum: ['staff'], 
    default: 'staff' 
  },
  resetPasswordToken: { type: String },
  resetPasswordExpiry: { type: Date }
}, {
  collection: 'faculties',
  timestamps: true
});

module.exports = mongoose.model('Faculty', facultySchema);