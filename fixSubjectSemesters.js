// Update Civil Engineering subjects to use "5th Semester" format
const mongoose = require('mongoose');
const Subject = require('./models/subject');

mongoose.connect('mongodb://127.0.0.1:27017/student_management')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

async function updateSubjectSemesters() {
    try {
        // Delete old subjects
        await Subject.deleteMany({ course: 'Civil Engineering' });
        console.log('Deleted old Civil Engineering subjects');
        
        // Create subjects with correct semester format
        const civilSubjects = [
            // Semester 1
            { code: 'CE101', name: 'Architecture', course: 'Civil Engineering', semester: '1st Semester', credits: 4, max_marks: 100 },
            { code: 'CE102', name: 'Layout', course: 'Civil Engineering', semester: '1st Semester', credits: 4, max_marks: 100 },
            { code: 'CE103', name: 'Design', course: 'Civil Engineering', semester: '1st Semester', credits: 4, max_marks: 100 },
            { code: 'CE104', name: 'Communication', course: 'Civil Engineering', semester: '1st Semester', credits: 3, max_marks: 100 },
            
            // Semester 2
            { code: 'CE201', name: 'Architecture', course: 'Civil Engineering', semester: '2nd Semester', credits: 4, max_marks: 100 },
            { code: 'CE202', name: 'Layout', course: 'Civil Engineering', semester: '2nd Semester', credits: 4, max_marks: 100 },
            { code: 'CE203', name: 'Design', course: 'Civil Engineering', semester: '2nd Semester', credits: 4, max_marks: 100 },
            { code: 'CE204', name: 'Communication', course: 'Civil Engineering', semester: '2nd Semester', credits: 3, max_marks: 100 },
            
            // Semester 3
            { code: 'CE301', name: 'Architecture', course: 'Civil Engineering', semester: '3rd Semester', credits: 4, max_marks: 100 },
            { code: 'CE302', name: 'Layout', course: 'Civil Engineering', semester: '3rd Semester', credits: 4, max_marks: 100 },
            { code: 'CE303', name: 'Design', course: 'Civil Engineering', semester: '3rd Semester', credits: 4, max_marks: 100 },
            { code: 'CE304', name: 'Communication', course: 'Civil Engineering', semester: '3rd Semester', credits: 3, max_marks: 100 },
            
            // Semester 4
            { code: 'CE401', name: 'Architecture', course: 'Civil Engineering', semester: '4th Semester', credits: 4, max_marks: 100 },
            { code: 'CE402', name: 'Layout', course: 'Civil Engineering', semester: '4th Semester', credits: 4, max_marks: 100 },
            { code: 'CE403', name: 'Design', course: 'Civil Engineering', semester: '4th Semester', credits: 4, max_marks: 100 },
            { code: 'CE404', name: 'Communication', course: 'Civil Engineering', semester: '4th Semester', credits: 3, max_marks: 100 },
            
            // Semester 5
            { code: 'CE501', name: 'Architecture', course: 'Civil Engineering', semester: '5th Semester', credits: 4, max_marks: 100 },
            { code: 'CE502', name: 'Layout', course: 'Civil Engineering', semester: '5th Semester', credits: 4, max_marks: 100 },
            { code: 'CE503', name: 'Design', course: 'Civil Engineering', semester: '5th Semester', credits: 4, max_marks: 100 },
            { code: 'CE504', name: 'Communication', course: 'Civil Engineering', semester: '5th Semester', credits: 3, max_marks: 100 },
            
            // Semester 6
            { code: 'CE601', name: 'Architecture', course: 'Civil Engineering', semester: '6th Semester', credits: 4, max_marks: 100 },
            { code: 'CE602', name: 'Layout', course: 'Civil Engineering', semester: '6th Semester', credits: 4, max_marks: 100 },
            { code: 'CE603', name: 'Design', course: 'Civil Engineering', semester: '6th Semester', credits: 4, max_marks: 100 },
            { code: 'CE604', name: 'Communication', course: 'Civil Engineering', semester: '6th Semester', credits: 3, max_marks: 100 }
        ];
        
        const result = await Subject.insertMany(civilSubjects);
        console.log(`Added ${result.length} Civil Engineering subjects with correct semester format`);
        
        console.log('\nSample subjects:');
        const sem5 = result.filter(s => s.semester === '5th Semester');
        sem5.forEach(s => {
            console.log(`  ${s.code}: ${s.name} - Semester: "${s.semester}"`);
        });
        
        process.exit(0);
    } catch(err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

updateSubjectSemesters();
