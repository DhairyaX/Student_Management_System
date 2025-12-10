// Check student data
const mongoose = require('mongoose');
const Student = require('./models/student');

mongoose.connect('mongodb://127.0.0.1:27017/student_management')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

async function checkStudent() {
    try {
        // Find Milan Tyagi
        const student = await Student.findOne({ name: /milan/i });
        
        if (student) {
            console.log('\n===== STUDENT DATA =====');
            console.log('Name:', student.name);
            console.log('Roll Number:', student.rollnumber);
            console.log('Course:', `"${student.course}"`);
            console.log('Semester:', `"${student.semester}"`);
            console.log('Section:', student.section);
            console.log('========================\n');
            
            console.log('Semester type:', typeof student.semester);
            console.log('Course type:', typeof student.course);
        } else {
            console.log('Student not found');
        }
        
        process.exit(0);
    } catch(err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkStudent();
