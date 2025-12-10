const mongoose = require('mongoose');
const Marks = require('./models/marks');

mongoose.connect('mongodb://localhost:27017/student_management')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

async function debugMarks() {
  try {
    console.log('\n===== DEBUG: Checking Saved Marks =====\n');
    
    const marks = await Marks.find().sort({ created_at: -1 }).limit(5);
    
    console.log(`Found ${marks.length} marks entries:\n`);
    
    marks.forEach((mark, index) => {
      console.log(`\n--- Mark #${index + 1} ---`);
      console.log('Student:', mark.student_name);
      console.log('Subject:', mark.subject);
      console.log('Exam Type:', mark.exam_type);
      console.log('Practical Marks:', mark.practical_marks, '(type:', typeof mark.practical_marks, ')');
      console.log('Practical Max:', mark.practical_max_marks);
      console.log('Written Marks:', mark.written_marks, '(type:', typeof mark.written_marks, ')');
      console.log('Written Max:', mark.written_max_marks);
      console.log('Total Marks Obtained:', mark.marks_obtained);
      console.log('Max Marks:', mark.max_marks);
      console.log('Percentage:', mark.percentage);
      console.log('Grade:', mark.grade);
    });
    
    console.log('\n===== END DEBUG =====\n');
    process.exit(0);
  } catch(err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

setTimeout(debugMarks, 1000);
