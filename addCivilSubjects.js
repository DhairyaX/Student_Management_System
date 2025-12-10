// Script to add Civil Engineering subjects to the database
// Run this with: node addCivilSubjects.js

const mongoose = require('mongoose');
const Subject = require('./models/subject');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/student_management')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Civil Engineering subjects
const civilSubjects = [
    // Semester 1
    { code: 'CE101', name: 'Architecture', course: 'Civil Engineering', semester: '1', credits: 4, max_marks: 100 },
    { code: 'CE102', name: 'Layout', course: 'Civil Engineering', semester: '1', credits: 4, max_marks: 100 },
    { code: 'CE103', name: 'Design', course: 'Civil Engineering', semester: '1', credits: 4, max_marks: 100 },
    { code: 'CE104', name: 'Communication', course: 'Civil Engineering', semester: '1', credits: 3, max_marks: 100 },
    
    // Semester 2
    { code: 'CE201', name: 'Architecture', course: 'Civil Engineering', semester: '2', credits: 4, max_marks: 100 },
    { code: 'CE202', name: 'Layout', course: 'Civil Engineering', semester: '2', credits: 4, max_marks: 100 },
    { code: 'CE203', name: 'Design', course: 'Civil Engineering', semester: '2', credits: 4, max_marks: 100 },
    { code: 'CE204', name: 'Communication', course: 'Civil Engineering', semester: '2', credits: 3, max_marks: 100 },
    
    // Semester 3
    { code: 'CE301', name: 'Architecture', course: 'Civil Engineering', semester: '3', credits: 4, max_marks: 100 },
    { code: 'CE302', name: 'Layout', course: 'Civil Engineering', semester: '3', credits: 4, max_marks: 100 },
    { code: 'CE303', name: 'Design', course: 'Civil Engineering', semester: '3', credits: 4, max_marks: 100 },
    { code: 'CE304', name: 'Communication', course: 'Civil Engineering', semester: '3', credits: 3, max_marks: 100 },
    
    // Semester 4
    { code: 'CE401', name: 'Architecture', course: 'Civil Engineering', semester: '4', credits: 4, max_marks: 100 },
    { code: 'CE402', name: 'Layout', course: 'Civil Engineering', semester: '4', credits: 4, max_marks: 100 },
    { code: 'CE403', name: 'Design', course: 'Civil Engineering', semester: '4', credits: 4, max_marks: 100 },
    { code: 'CE404', name: 'Communication', course: 'Civil Engineering', semester: '4', credits: 3, max_marks: 100 },
    
    // Semester 5
    { code: 'CE501', name: 'Architecture', course: 'Civil Engineering', semester: '5', credits: 4, max_marks: 100 },
    { code: 'CE502', name: 'Layout', course: 'Civil Engineering', semester: '5', credits: 4, max_marks: 100 },
    { code: 'CE503', name: 'Design', course: 'Civil Engineering', semester: '5', credits: 4, max_marks: 100 },
    { code: 'CE504', name: 'Communication', course: 'Civil Engineering', semester: '5', credits: 3, max_marks: 100 },
    
    // Semester 6
    { code: 'CE601', name: 'Architecture', course: 'Civil Engineering', semester: '6', credits: 4, max_marks: 100 },
    { code: 'CE602', name: 'Layout', course: 'Civil Engineering', semester: '6', credits: 4, max_marks: 100 },
    { code: 'CE603', name: 'Design', course: 'Civil Engineering', semester: '6', credits: 4, max_marks: 100 },
    { code: 'CE604', name: 'Communication', course: 'Civil Engineering', semester: '6', credits: 3, max_marks: 100 }
];

async function addSubjects() {
    try {
        // Remove existing Civil Engineering subjects (optional)
        await Subject.deleteMany({ course: 'Civil Engineering' });
        console.log('Cleared existing Civil Engineering subjects');
        
        // Add new subjects
        const result = await Subject.insertMany(civilSubjects);
        console.log(`Successfully added ${result.length} Civil Engineering subjects`);
        
        // Display added subjects grouped by semester
        console.log('\nAdded Civil Engineering subjects:');
        for(let sem = 1; sem <= 6; sem++) {
            const semSubjects = result.filter(s => s.semester === sem.toString());
            if(semSubjects.length > 0) {
                console.log(`\nSemester ${sem}:`);
                semSubjects.forEach(subject => {
                    console.log(`  - ${subject.code}: ${subject.name}`);
                });
            }
        }
        
        process.exit(0);
    } catch(err) {
        console.error('Error adding subjects:', err);
        process.exit(1);
    }
}

addSubjects();
