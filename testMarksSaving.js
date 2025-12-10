const mongoose = require('mongoose');
const Marks = require('./models/marks');

mongoose.connect('mongodb://localhost:27017/student_management')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

async function testMarksSaving() {
  try {
    console.log('\n===== Testing Marks Saving =====\n');
    
    // Test 1: Mid Term (only written)
    console.log('Test 1: Mid Term marks (written only)');
    const midTermMark = await Marks.create({
      student_id: new mongoose.Types.ObjectId(),
      student_name: 'Test Student',
      student_rollnumber: '12345',
      course: 'BCA',
      semester: '3rd Semester',
      subject: 'Data Structures',
      exam_type: 'Mid Term',
      max_marks: 70,
      written_marks: 55,
      written_max_marks: 70,
      marks_obtained: 55,
      teacher_id: new mongoose.Types.ObjectId(),
      teacher_name: 'Test Teacher'
    });
    console.log('✅ Mid Term mark saved:', {
      subject: midTermMark.subject,
      exam_type: midTermMark.exam_type,
      written: `${midTermMark.written_marks}/${midTermMark.written_max_marks}`,
      total: `${midTermMark.marks_obtained}/${midTermMark.max_marks}`,
      percentage: midTermMark.percentage,
      grade: midTermMark.grade
    });
    
    // Test 2: End Term (practical + written)
    console.log('\nTest 2: End Term marks (practical + written)');
    const endTermMark = await Marks.create({
      student_id: new mongoose.Types.ObjectId(),
      student_name: 'Test Student',
      student_rollnumber: '12345',
      course: 'BCA',
      semester: '3rd Semester',
      subject: 'Database Management',
      exam_type: 'End Term',
      max_marks: 100,
      practical_marks: 25,
      practical_max_marks: 30,
      written_marks: 60,
      written_max_marks: 70,
      marks_obtained: 85,
      teacher_id: new mongoose.Types.ObjectId(),
      teacher_name: 'Test Teacher'
    });
    console.log('✅ End Term mark saved:', {
      subject: endTermMark.subject,
      exam_type: endTermMark.exam_type,
      practical: `${endTermMark.practical_marks}/${endTermMark.practical_max_marks}`,
      written: `${endTermMark.written_marks}/${endTermMark.written_max_marks}`,
      total: `${endTermMark.marks_obtained}/${endTermMark.max_marks}`,
      percentage: endTermMark.percentage,
      grade: endTermMark.grade
    });
    
    // Clean up test data
    await Marks.deleteMany({ student_rollnumber: '12345' });
    console.log('\n✅ Test data cleaned up');
    console.log('\n===== All Tests Passed! =====\n');
    
    process.exit(0);
  } catch(err) {
    console.error('\n❌ Error during testing:', err.message);
    console.error('Full error:', err);
    process.exit(1);
  }
}

setTimeout(testMarksSaving, 1000);
