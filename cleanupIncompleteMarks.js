const mongoose = require('mongoose');
const Marks = require('./models/marks');

mongoose.connect('mongodb://localhost:27017/student_management')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

async function cleanupIncompleteMarks() {
  try {
    console.log('\n===== Cleaning Up Incomplete End Term Marks =====\n');
    
    // Find all End Term marks where written_marks is 0
    const incompleteMarks = await Marks.find({
      exam_type: 'End Term',
      written_marks: 0
    });
    
    console.log(`Found ${incompleteMarks.length} incomplete End Term marks (written=0):\n`);
    
    incompleteMarks.forEach(mark => {
      console.log(`- ${mark.student_name} - ${mark.subject}: Practical=${mark.practical_marks}, Written=0`);
    });
    
    if (incompleteMarks.length > 0) {
      console.log('\nDeleting these incomplete entries...');
      const result = await Marks.deleteMany({
        exam_type: 'End Term',
        written_marks: 0
      });
      console.log(`✅ Deleted ${result.deletedCount} incomplete marks`);
      console.log('\nPlease re-enter these marks with BOTH practical AND written values.');
    } else {
      console.log('No incomplete marks found!');
    }
    
    console.log('\n===== Cleanup Complete =====\n');
    process.exit(0);
  } catch(err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

setTimeout(cleanupIncompleteMarks, 1000);
