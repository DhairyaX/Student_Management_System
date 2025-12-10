// Check what subjects exist in the database
const mongoose = require('mongoose');
const Subject = require('./models/subject');

mongoose.connect('mongodb://127.0.0.1:27017/student_management')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

async function checkSubjects() {
    try {
        const allSubjects = await Subject.find();
        console.log(`\nTotal subjects in database: ${allSubjects.length}\n`);
        
        if (allSubjects.length === 0) {
            console.log('No subjects found in database!');
        } else {
            // Group by course
            const byCourse = {};
            allSubjects.forEach(s => {
                if (!byCourse[s.course]) {
                    byCourse[s.course] = [];
                }
                byCourse[s.course].push(s);
            });
            
            for (const course in byCourse) {
                console.log(`\n${course}:`);
                const subjects = byCourse[course];
                subjects.forEach(s => {
                    console.log(`  Sem ${s.semester}: ${s.code} - ${s.name}`);
                });
            }
        }
        
        // Check for Civil Engineering specifically
        console.log('\n\n--- Civil Engineering Subjects ---');
        const civilSubjects = await Subject.find({ course: 'Civil Engineering' });
        console.log(`Found ${civilSubjects.length} Civil Engineering subjects`);
        
        if (civilSubjects.length > 0) {
            civilSubjects.forEach(s => {
                console.log(`  ${s.code}: ${s.name} (Semester: ${s.semester})`);
            });
        }
        
        // Check for semester 5 specifically
        console.log('\n\n--- Semester 5 Civil Engineering ---');
        const sem5Subjects = await Subject.find({ 
            course: 'Civil Engineering', 
            semester: '5' 
        });
        console.log(`Found ${sem5Subjects.length} subjects for Civil Engineering Semester 5`);
        
        if (sem5Subjects.length > 0) {
            sem5Subjects.forEach(s => {
                console.log(`  ${s.code}: ${s.name}`);
            });
        }
        
        process.exit(0);
    } catch(err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkSubjects();
