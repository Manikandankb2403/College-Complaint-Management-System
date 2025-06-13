const { body, validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Faculty = require('../models/Faculty');
const PDFDocument = require('pdfkit');

exports.createComplaint = [
  body('deptNo').trim().notEmpty().withMessage('Department number is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('details').trim().notEmpty().isLength({ max: 2000 }).withMessage('Details required, max 2000 characters'),
  body('file').optional().custom((value, { req }) => {
    if (req.file && !['image/jpeg', 'image/png'].includes(req.file.mimetype)) {
      throw new Error('File must be a JPEG or PNG');
    }
    return true;
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { deptNo, department, category, details, status } = req.body;
    const file = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      const user = await User.findById(req.user.id);
      if (!user || user.role !== 'student') {
        return res.status(403).json({ message: 'Only students can submit complaints' });
      }

      const complaint = new Complaint({
        deptNo,
        department,
        username: user.name,
        category,
        details,
        file,
        userId: user._id,
        status: status || 'submitted',
      });

      await complaint.save();
      req.io.emit('newComplaint', { message: 'New complaint submitted', complaint });
      req.io.to(user._id.toString()).emit('complaintStatusUpdate', {
        message: `Your complaint ${complaint.deptNo} has been submitted`,
        complaint,
      });

      res.status(201).json({ message: 'Complaint submitted successfully', complaint });
    } catch (error) {
      console.error('Create complaint error:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  },
];
exports.getAllComplaints = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, department, category, startDate, endDate, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (department) query.department = new RegExp(department, 'i');
    if (category) query.category = category;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const complaints = await Complaint.find(query)
      .populate('userId', 'name deptNo')
      .populate('assignedTo', 'name facultyId')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Complaint.countDocuments(query);

    res.json({ complaints, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Get complaints error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.id })
      .populate('assignedTo', 'name facultyId');
    res.json({ complaints });
  } catch (error) {
    console.error('Get user complaints error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFacultyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ assignedTo: req.user.id })
      .populate('userId', 'name deptNo');
    res.json({ complaints });
  } catch (error) {
    console.error('Get faculty complaints error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateComplaint = [
  body('status').optional().isIn(['submitted', 'in_progress', 'resolved']).withMessage('Invalid status'),
  body('assignedTo').optional().custom((value) => {
    if (value && !/^[0-9a-fA-F]{24}$/.test(value)) {
      throw new Error('Invalid faculty ID format');
    }
    return true;
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { id } = req.params;
    const { status, assignedTo } = req.body;

    try {
      if (req.user.role !== 'admin' && req.user.role !== 'faculty') {
        return res.status(403).json({ message: 'Access denied' });
      }

      const complaint = await Complaint.findById(id);
      if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

      if (req.user.role === 'faculty' && complaint.assignedTo?.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this complaint' });
      }

      if (status) complaint.status = status;

      if (assignedTo !== undefined) {
        if (assignedTo) {
          const faculty = await Faculty.findById(assignedTo);
          if (!faculty) return res.status(400).json({ message: 'Invalid faculty ID' });
          complaint.assignedTo = assignedTo;
        } else {
          complaint.assignedTo = null;
        }
      }

      complaint.updatedAt = Date.now();
      await complaint.save();

      req.io.emit('complaintUpdate', { message: `Complaint ${id} updated`, complaint });
      req.io.to(complaint.userId.toString()).emit('complaintStatusUpdate', {
        message: `Your complaint ${complaint.deptNo} is now ${status || complaint.status}`,
        complaint
      });

      res.json({ message: 'Complaint updated successfully', complaint });
    } catch (error) {
      console.error('Update complaint error:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
];
exports.generateComplaintPDF = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('assignedTo', 'name');
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    if (req.user.role !== 'admin' && complaint.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=complaint_${complaint._id}.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text('Complaint Details', { align: 'center' });
    doc.fontSize(12).text('College Complaint Management System', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Department Number: ${complaint.deptNo}`);
    doc.text(`Department: ${complaint.department}`);
    doc.text(`Category: ${complaint.category}`);
    doc.text(`Details: ${complaint.details}`);
    doc.text(`Status: ${complaint.status.replace('_', ' ').toUpperCase()}`);
    doc.text(`Assigned To: ${complaint.assignedTo?.name || 'Unassigned'}`);
    doc.text(`Submitted On: ${new Date(complaint.createdAt).toLocaleDateString()}`);
    doc.text(`Last Updated: ${new Date(complaint.updatedAt).toLocaleDateString()}`);
    doc.moveDown();

    doc.text(`Generated on ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.end();
  } catch (error) {
    console.error('PDF generation error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};