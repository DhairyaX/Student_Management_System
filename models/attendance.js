const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  student_name: {
    type: String,
    required: true
  },
  student_rollnumber: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['present', 'absent'],
    default: 'present'
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  teacher_name: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
attendanceSchema.index({ student_id: 1, date: 1 });
attendanceSchema.index({ course: 1, semester: 1, section: 1, date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
