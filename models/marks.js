const mongoose = require('mongoose');
  
const marksSchema = new mongoose.Schema({
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
  subject: {
    type: String,
    required: true
  },
  exam_type: {
    type: String,
    required: true,
    enum: ['Mid Term', 'End Term', 'Assignment', 'Quiz', 'Project']
  },
  max_marks: {
    type: Number,
    required: true
  },
  // Component-wise marks (for exams with practical + written)
  practical_marks: {
    type: Number,
    default: null  // null if no practical component
  },
  practical_max_marks: {
    type: Number,
    default: null
  },
  written_marks: {
    type: Number,
    default: null  // null if only total marks
  },
  written_max_marks: {
    type: Number,
    default: null
  },
  marks_obtained: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number
  },
  grade: {
    type: String
  },
  remarks: {
    type: String
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

// Calculate percentage and grade before saving
marksSchema.pre('save', function() {
  // Calculate percentage (handle division by zero)
  if (this.max_marks && this.max_marks > 0) {
    this.percentage = ((this.marks_obtained / this.max_marks) * 100).toFixed(2);
  } else {
    this.percentage = 0;
  }
  
  // Assign grade based on percentage
  const pct = parseFloat(this.percentage);
  if (pct >= 90) {
    this.grade = 'A+';
  } else if (pct >= 80) {
    this.grade = 'A';
  } else if (pct >= 70) {
    this.grade = 'B+';
  } else if (pct >= 60) {
    this.grade = 'B';
  } else if (pct >= 50) {
    this.grade = 'C';
  } else if (pct >= 40) {
    this.grade = 'D';
  } else {
    this.grade = 'F';
  }
});

module.exports = mongoose.model('Marks', marksSchema);
