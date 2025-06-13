const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  deptNo: { type: String, required: true },
  department: { type: String, required: true },
  username: { type: String, required: true },
  category: { type: String, required: true },
  details: { type: String, required: true, maxLength: 2000 },
  file: { type: String }, // Stores file path
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
  status: { type: String, enum: ['submitted', 'in_progress', 'resolved'], default: 'submitted' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('Complaint', complaintSchema);