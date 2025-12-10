const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  course: { type: String, required: true },
  semester: { type: String, required: true },
  credits: { type: Number, default: 3 },
  max_marks: { type: Number, default: 100 }
}, {
  timestamps: true
});

// Create compound index to ensure unique subject per course-semester combination
subjectSchema.index({ code: 1, course: 1, semester: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);
