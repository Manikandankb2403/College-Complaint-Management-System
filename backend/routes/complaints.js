const express = require('express');
const router = express.Router();
const complaintsController = require('../controllers/complaintsController');
const { protect } = require('../middleware/auth');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.post('/', protect, upload.single('file'), complaintsController.createComplaint);
router.get('/', protect, complaintsController.getAllComplaints);
router.get('/user', protect, complaintsController.getUserComplaints);
router.get('/faculty', protect, complaintsController.getFacultyComplaints);
router.put('/:id', protect, complaintsController.updateComplaint);
router.get('/:id/pdf', protect, complaintsController.generateComplaintPDF);
module.exports = router;