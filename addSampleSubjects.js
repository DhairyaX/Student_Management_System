// Script to add sample subjects to the database
// Run this with: node addSampleSubjects.js

const mongoose = require('mongoose');
const Subject = require('./models/subject');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/student_management')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Sample subjects for BCA course
const sampleSubjects = [
    // Semester 1
    { code: 'BCA101', name: 'Computer Fundamentals', course: 'BCA', semester: '1', credits: 4, max_marks: 100 },
    { code: 'BCA102', name: 'Programming in C', course: 'BCA', semester: '1', credits: 4, max_marks: 100 },
    { code: 'BCA103', name: 'Mathematics I', course: 'BCA', semester: '1', credits: 4, max_marks: 100 },
    { code: 'BCA104', name: 'English Communication', course: 'BCA', semester: '1', credits: 3, max_marks: 100 },
    { code: 'BCA105', name: 'Digital Electronics', course: 'BCA', semester: '1', credits: 3, max_marks: 100 },
    
    // Semester 2
    { code: 'BCA201', name: 'Data Structures', course: 'BCA', semester: '2', credits: 4, max_marks: 100 },
    { code: 'BCA202', name: 'Object Oriented Programming', course: 'BCA', semester: '2', credits: 4, max_marks: 100 },
    { code: 'BCA203', name: 'Mathematics II', course: 'BCA', semester: '2', credits: 4, max_marks: 100 },
    { code: 'BCA204', name: 'Database Management Systems', course: 'BCA', semester: '2', credits: 4, max_marks: 100 },
    { code: 'BCA205', name: 'Web Technologies', course: 'BCA', semester: '2', credits: 3, max_marks: 100 },
    
    // Semester 3
    { code: 'BCA301', name: 'Operating Systems', course: 'BCA', semester: '3', credits: 4, max_marks: 100 },
    { code: 'BCA302', name: 'Computer Networks', course: 'BCA', semester: '3', credits: 4, max_marks: 100 },
    { code: 'BCA303', name: 'Software Engineering', course: 'BCA', semester: '3', credits: 4, max_marks: 100 },
    { code: 'BCA304', name: 'Java Programming', course: 'BCA', semester: '3', credits: 4, max_marks: 100 },
    { code: 'BCA305', name: 'Computer Graphics', course: 'BCA', semester: '3', credits: 3, max_marks: 100 },
    
    // Semester 4
    { code: 'BCA401', name: 'Python Programming', course: 'BCA', semester: '4', credits: 4, max_marks: 100 },
    { code: 'BCA402', name: 'Mobile Application Development', course: 'BCA', semester: '4', credits: 4, max_marks: 100 },
    { code: 'BCA403', name: 'Artificial Intelligence', course: 'BCA', semester: '4', credits: 4, max_marks: 100 },
    { code: 'BCA404', name: 'Cloud Computing', course: 'BCA', semester: '4', credits: 3, max_marks: 100 },
    { code: 'BCA405', name: 'Cyber Security', course: 'BCA', semester: '4', credits: 3, max_marks: 100 }
];

async function addSubjects() {
    try {
        // Clear existing subjects (optional - remove this line if you want to keep existing subjects)
        await Subject.deleteMany({});
        console.log('Cleared existing subjects');
        
        // Add new subjects
        const result = await Subject.insertMany(sampleSubjects);
        console.log(`Successfully added ${result.length} subjects`);
        
        // Display added subjects
        console.log('\nAdded subjects:');
        result.forEach(subject => {
            console.log(`- ${subject.code}: ${subject.name} (${subject.course} - Semester ${subject.semester})`);
        });
        
        process.exit(0);
    } catch(err) {
        console.error('Error adding subjects:', err);
        process.exit(1);
    }
}

addSubjects();
