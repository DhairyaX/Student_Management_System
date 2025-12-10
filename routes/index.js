var express = require('express');
var router = express.Router();
const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Admin = require('../models/admin');
const Activity = require('../models/activity');
const Marks = require('../models/marks');
const Subject = require('../models/subject');
const Attendance = require('../models/attendance');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer to use Cloudinary Storage
const storage = new CloudinaryStorage({
   cloudinary: cloudinary,
   params: {
      folder: 'studenthub/profiles', // Folder name in Cloudinary
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
      transformation: [{ width: 500, height: 500, crop: 'limit' }], // Auto-resize images
      public_id: (req, file) => {
         // Generate unique filename
         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
         return 'profile-' + uniqueSuffix;
      }
   }
});

const upload = multer({ 
   storage: storage,
   limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware to check if user is logged in
function isloggedIn(req, res, next) {
   if(req.session.user){
      next();
   }
   else{
      res.redirect('/login');
   }
}

// middleware to check if user is a student
function isStudent(req, res, next) {
   if(req.session.user && req.session.user.role === 'student'){
      next();
   } else {
      res.redirect('/login');
   }
}

// middleware to check if user is a teacher
function isTeacher(req, res, next) {
   if(req.session.user && req.session.user.role === 'teacher'){
      next();
   } else {
      res.redirect('/login');
   }
}
/* GET login page */
router.get('/', function(req, res) {
  if (req.session.user) {
    // Already logged in, redirect based on role
    if (req.session.user.role === 'student') {
      res.redirect('/student/dashboard');
    } else if (req.session.user.role === 'teacher') {
      res.redirect('/teacher/dashboard');
    } else if (req.session.user.role === 'admin') {
      res.redirect('/admin/dashboard');
    }
  } else {
    // Not logged in, show login page
    res.render('auth/login');
  }
});


router.get('/login', function(req, res, next) {
   res.render('auth/login');
});

router.post('/login', async function(req, res, next) {
   const { role,email, password } = req.body;

   console.log('===== LOGIN ATTEMPT =====');
   console.log('Role:', role);
   console.log('Email:', email);
   console.log('Password:', password);
   console.log('========================');

   if(role === 'student'){
   // Check in Students collection
   let user = await Student.findOne({ email: email, password: password });
   if(user){
      
      // storeing user in session
      req.session.user = {
         id : user._id,
         name : user.name,
         email : user.email,
         role : 'student'
      };
      res.redirect('/student/dashboard');}
      else{
         res.redirect('/login');
      }


}   else if(role === 'teacher'){
   // Check in Teachers collection
   let user = await Teacher.findOne({ email: email, password: password });
   if(user){
      
      // storeing user in session
      req.session.user = {
         id : user._id,
         name : user.name,
         email : user.email,
         role : 'teacher'
      };
      res.redirect('/teacher/dashboard');
   }
   else{
      res.redirect('/login');
   }
} else if(role === 'admin'){
   // Check in Admin collection
   let admin = await Admin.findOne({ email: email, password: password });
   if(admin){
      
      // storeing admin in session
      req.session.user = {
         id : admin._id,
         name : admin.name,
         email : admin.email,
         role : 'admin'
      };
      res.redirect('/admin/dashboard');
   }
   else{
      res.redirect('/login');
   }
} 
else{
   res.redirect('/login');
}

});


router.get('/register', function(req, res, next) {
   res.render('auth/register');
});

router.post('/register',async function(req, res,next){
   try{
  const { name, email, password, role } = req.body;

  if(role === 'student'){
   const student = await Student.create({
        name: name,
        email: email,
        password: password,
        role: 'student'
      });

      // storeing user in session
      req.session.user = {
         id : student._id,
         name : student.name,
         email : student.email,
         role : 'student'
      };
    
   res.redirect('/student/dashboard');
  } else if(role === 'teacher'){
   const teacher = await Teacher.create({
        name: name,
        email: email,
        password: password,
        role: 'teacher'
      });
      // storeing user in session
      req.session.user = {
         id : teacher._id,
         name : teacher.name,
         email : teacher.email,
         role : 'teacher'
      };
    res.redirect('/teacher/dashboard')
  } else{
   res.redirect('/register');
  }
}catch(err){
   console.log('Registration Error:', err);
   res.redirect('/register');
}
});


/* Student routes */
router.get('/student/dashboard', isStudent, async function(req, res, next) {
   try {
      const student = await Student.findById(req.session.user.id);
      res.render('student/dashboard-student', { 
         user: req.session.user,
         student: student 
      });
   } catch(err) {
      console.log(err);
      res.render('student/dashboard-student', { 
         user: req.session.user,
         student: null
      });
   }
});

router.get('/student/attendance', isStudent, async function(req, res, next) {
   try {
      const { month, year } = req.query;
      
      // Fetch student data for profile picture
      const student = await Student.findById(req.session.user.id);
      
      // Default to current month and year if not provided
      const currentDate = new Date();
      const selectedMonth = month ? parseInt(month) : currentDate.getMonth();
      const selectedYear = year ? parseInt(year) : currentDate.getFullYear();
      
      // Get first and last day of selected month (local time)
      const firstDay = new Date(selectedYear, selectedMonth, 1, 0, 0, 0, 0);
      const lastDay = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59, 999);
      
      // Fetch attendance records for the student for the selected month
      const attendanceRecords = await Attendance.find({
         student_id: req.session.user.id,
         date: {
            $gte: firstDay,
            $lte: lastDay
         }
      }).sort({ date: 1 });
      
      // Fetch all attendance records for calculating overall percentage
      const allAttendance = await Attendance.find({
         student_id: req.session.user.id
      });
      
      // Calculate statistics
      const totalDays = allAttendance.length;
      const presentDays = allAttendance.filter(a => a.status === 'present').length;
      const absentDays = allAttendance.filter(a => a.status === 'absent').length;
      const attendancePercentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;
      
      // Create a map of dates with their attendance status
      const attendanceMap = {};
      attendanceRecords.forEach(record => {
         // Extract local date components from the stored date
         const recordDate = new Date(record.date);
         const year = recordDate.getFullYear();
         const month = String(recordDate.getMonth() + 1).padStart(2, '0');
         const day = String(recordDate.getDate()).padStart(2, '0');
         const dateKey = `${year}-${month}-${day}`;
         attendanceMap[dateKey] = record.status;
      });
      
      res.render('student/attendance', { 
         user: req.session.user,
         student: student,
         attendanceMap: attendanceMap,
         selectedMonth: selectedMonth,
         selectedYear: selectedYear,
         stats: {
            totalDays: totalDays,
            presentDays: presentDays,
            absentDays: absentDays,
            attendancePercentage: attendancePercentage
         }
      });
   } catch(err) {
      console.log(err);
      res.render('student/attendance', { 
         user: req.session.user,
         student: null,
         attendanceMap: {},
         selectedMonth: new Date().getMonth(),
         selectedYear: new Date().getFullYear(),
         stats: {
            totalDays: 0,
            presentDays: 0,
            absentDays: 0,
            attendancePercentage: 0
         }
      });
   }
});

router.get('/student/marks', isStudent, async function(req, res, next) {
   try {
      const { exam_type, semester } = req.query;
      
      // Fetch student data for profile picture
      const student = await Student.findById(req.session.user.id);
      
      // Build query for filtering
      let query = { student_id: req.session.user.id };
      
      if (exam_type) {
         query.exam_type = exam_type;
      }
      
      if (semester) {
         query.semester = semester;
      }
      
      // Fetch filtered marks
      const marks = await Marks.find(query)
         .sort({ created_at: -1 });
      
      // Fetch distinct exam types and semesters for filters
      const examTypes = await Marks.distinct('exam_type', { student_id: req.session.user.id });
      const semesters = await Marks.distinct('semester', { student_id: req.session.user.id });
      
      // Group marks by subject
      const marksBySubject = {};
      marks.forEach(mark => {
         if(!marksBySubject[mark.subject]) {
            marksBySubject[mark.subject] = [];
         }
         marksBySubject[mark.subject].push(mark);
      });
      
      // Calculate statistics
      let totalPercentage = 0;
      let totalSubjects = Object.keys(marksBySubject).length;
      let bestGrade = 'F';
      
      marks.forEach(mark => {
         totalPercentage += parseFloat(mark.percentage);
         if(['A+', 'A', 'B+', 'B', 'C', 'D'].indexOf(mark.grade) > ['A+', 'A', 'B+', 'B', 'C', 'D'].indexOf(bestGrade)) {
            bestGrade = mark.grade;
         }
      });
      
      const avgPercentage = marks.length > 0 ? (totalPercentage / marks.length).toFixed(2) : 0;
      
      res.render('student/marks', { 
         user: req.session.user,
         student: student,
         marks: marks,
         marksBySubject: marksBySubject,
         examTypes: examTypes,
         semesters: semesters,
         selectedExamType: exam_type || '',
         selectedSemester: semester || '',
         stats: {
            avgPercentage: avgPercentage,
            totalSubjects: totalSubjects,
            bestGrade: bestGrade
         }
      });
   } catch(err) {
      console.log(err);
      res.render('student/marks', { 
         user: req.session.user,
         student: null,
         marks: [],
         marksBySubject: {},
         examTypes: [],
         semesters: [],
         selectedExamType: '',
         selectedSemester: '',
         stats: {
            avgPercentage: 0,
            totalSubjects: 0,
            bestGrade: 'N/A'
         }
      });
   }
});

router.get('/student/profile', isStudent, async function(req, res, next) {
   try {
      const student = await Student.findById(req.session.user.id);
      
      // Get success message from session and clear it
      const successMessage = req.session.successMessage || null;
      req.session.successMessage = null;
      
      res.render('student/profile', { 
         user: req.session.user,
         student: student,
         successMessage: successMessage
      });
   } catch(err) {
      console.log(err);
      res.redirect('/student/dashboard');
   }
});

router.get('/student/edit-profile', isStudent, async function(req, res, next) {
   try {
      const student = await Student.findById(req.session.user.id);
      res.render('student/edit-profile', { 
         user: req.session.user,
         student: student
      });
   } catch(err) {
      console.log(err);
      res.redirect('/student/profile');
   }
});

router.post('/student/update-profile', isStudent, upload.single('profilepicture'), async function(req, res, next) {
   try {
      const { phone, dob, gender, street, city, state, pincode } = req.body;
      
      const updateData = {
         phone: phone,
         dob: dob,
         gender: gender,
         address: {
            street: street,
            city: city,
            state: state,
            pincode: pincode
         }
      };
      
      // Add profile picture if uploaded (Cloudinary returns full URL in req.file.path)
      if (req.file) {
         updateData.profilepicture = req.file.path;
      }
      
      await Student.findByIdAndUpdate(req.session.user.id, updateData);
      
      res.redirect('/student/profile');
   } catch(err) {
      console.log(err);
      res.redirect('/student/edit-profile');
   }
});

router.get('/student/change-password', isStudent, function(req, res, next) {
   res.render('student/change-password', { user: req.session.user, error: null, success: null });
});

router.post('/student/change-password', isStudent, async function(req, res, next) {
   try {
      const { currentPassword, newPassword, confirmPassword } = req.body;
      
      // Get student from database
      const student = await Student.findById(req.session.user.id);
      
      // Check if current password matches
      if (student.password !== currentPassword) {
         return res.render('student/change-password', { 
            user: req.session.user, 
            error: 'Current password is incorrect', 
            success: null 
         });
      }
      
      // Check if new passwords match
      if (newPassword !== confirmPassword) {
         return res.render('student/change-password', { 
            user: req.session.user, 
            error: 'New passwords do not match', 
            success: null 
         });
      }
      
      // Check minimum length
      if (newPassword.length < 6) {
         return res.render('student/change-password', { 
            user: req.session.user, 
            error: 'New password must be at least 6 characters long', 
            success: null 
         });
      }
      
      // Check if new password is same as current
      if (newPassword === currentPassword) {
         return res.render('student/change-password', { 
            user: req.session.user, 
            error: 'New password cannot be the same as current password', 
            success: null 
         });
      }
      
      // Update password
      await Student.findByIdAndUpdate(req.session.user.id, {
         password: newPassword
      });
      
      // Store success message in session and redirect
      req.session.successMessage = 'Password changed successfully!';
      res.redirect('/student/profile');
   } catch(err) {
      console.log(err);
      res.render('student/change-password', { 
         user: req.session.user, 
         error: 'An error occurred. Please try again.', 
         success: null 
      });
   }
});

/* Teacher routes */
router.get('/teacher/dashboard', isTeacher, function(req, res, next) {
   res.render('teacher/dashboard-teacher', { user: req.session.user });
});

// Manage Subjects Routes
router.get('/teacher/manage-subjects', isTeacher, async function(req, res, next) {
   try {
      const subjects = await Subject.find().sort({ course: 1, semester: 1, code: 1 });
      res.render('teacher/manage-subjects', { 
         user: req.session.user,
         subjects: subjects
      });
   } catch(err) {
      console.log(err);
      res.render('teacher/manage-subjects', { 
         user: req.session.user,
         subjects: []
      });
   }
});

router.post('/teacher/add-subject', isTeacher, async function(req, res, next) {
   try {
      const { code, name, course, semester, credits, max_marks } = req.body;
      
      await Subject.create({
         code: code,
         name: name,
         course: course,
         semester: semester,
         credits: parseInt(credits) || 3,
         max_marks: parseInt(max_marks) || 100
      });
      
      res.redirect('/teacher/manage-subjects');
   } catch(err) {
      console.log(err);
      res.redirect('/teacher/manage-subjects');
   }
});

router.post('/teacher/delete-subject/:id', isTeacher, async function(req, res, next) {
   try {
      await Subject.findByIdAndDelete(req.params.id);
      res.redirect('/teacher/manage-subjects');
   } catch(err) {
      console.log(err);
      res.redirect('/teacher/manage-subjects');
   }
});



router.get('/teacher/add-marks', isTeacher, async function(req, res, next) {
   try {
      const { course, semester, section, student_id } = req.query;
      
      let students = [];
      let courses = [];
      let semesters = [];
      let sections = [];
      let selectedStudent = null;
      let subjects = [];
      let examTypes = ['Mid Term', 'End Term', 'Assignment', 'Quiz', 'Project'];
      
      // Fetch unique courses, semesters, sections for dropdowns
      courses = await Student.distinct('course');
      semesters = await Student.distinct('semester');
      sections = await Student.distinct('section');
      
      // If filters are applied, fetch matching students
      if (course && semester && section) {
         students = await Student.find({
            course: course,
            semester: semester,
            section: section
         }).sort({ rollnumber: 1 });
      }
      
      // If student is selected, fetch their details and subjects
      if (student_id) {
         selectedStudent = await Student.findById(student_id);
         if (selectedStudent) {
            console.log('\n===== SUBJECT SEARCH DEBUG =====');
            console.log('Student Course:', selectedStudent.course);
            console.log('Student Semester:', selectedStudent.semester);
            
            // Fetch subjects for this course and semester
            subjects = await Subject.find({
               course: selectedStudent.course,
               semester: selectedStudent.semester
            }).sort({ code: 1 });
            
            console.log('Subjects found:', subjects.length);
            subjects.forEach(s => {
               console.log(`- ${s.code}: ${s.name} (Course: ${s.course}, Semester: ${s.semester})`);
            });
            console.log('================================\n');
         }
      }
      
      res.render('teacher/add-marks', { 
         user: req.session.user,
         students: students,
         courses: courses,
         semesters: semesters,
         sections: sections,
         selectedCourse: course || '',
         selectedSemester: semester || '',
         selectedSection: section || '',
         selectedStudent: selectedStudent,
         subjects: subjects,
         examTypes: examTypes
      });
   } catch(err) {
      console.log(err);
      res.render('teacher/add-marks', { 
         user: req.session.user,
         students: [],
         courses: [],
         semesters: [],
         sections: [],
         selectedCourse: '',
         selectedSemester: '',
         selectedSection: '',
         selectedStudent: null,
         subjects: [],
         examTypes: ['Mid Term', 'End Term', 'Assignment', 'Quiz', 'Project']
      });
   }
});

// POST marks entry
router.post('/teacher/add-marks', isTeacher, async function(req, res, next) {
   try {
      console.log('\n===== MARKS SUBMISSION DEBUG =====');
      console.log('Full request body:', JSON.stringify(req.body, null, 2));
      
      const { student_id, exam_type, course, semester, section } = req.body;
      
      // Validate required fields
      if (!student_id || !exam_type) {
         console.log('Missing required fields: student_id or exam_type');
         return res.redirect('/teacher/add-marks');
      }
      
      // Get student details
      const student = await Student.findById(student_id);
      if (!student) {
         console.log('Student not found');
         return res.redirect('/teacher/add-marks');
      }
      
      console.log('Processing marks for student:', student.name, 'Exam Type:', exam_type);
      
      // Get all subject keys (format: subject_<subject_id>_marks OR subject_<subject_id>_written/practical)
      const subjectIds = new Set();
      Object.keys(req.body).forEach(key => {
         if (key.startsWith('subject_') && (key.includes('_written') || key.includes('_practical') || key.endsWith('_marks'))) {
            const subjectId = key.replace('subject_', '').split('_')[0];
            subjectIds.add(subjectId);
         }
      });
      
      console.log('Found', subjectIds.size, 'subjects with marks');
      
      let savedCount = 0;
      
      // Process marks for each subject
      for (const subjectId of subjectIds) {
         try {
            // Get subject details
            const subject = await Subject.findById(subjectId);
            
            if (!subject) {
               console.log(`Subject ${subjectId} not found`);
               continue;
            }
            
            let marksData = {
               student_id: student._id,
               student_name: student.name,
               student_rollnumber: student.rollnumber,
               course: student.course,
               semester: student.semester,
               subject: subject.name,
               exam_type: exam_type,
               max_marks: subject.max_marks,
               teacher_id: req.session.user.id,
               teacher_name: req.session.user.name
            };
            
            // Handle different exam types
            if (exam_type === 'End Term') {
               // End Term: Practical (30) + Written (70)
               const practicalMarks = req.body[`subject_${subjectId}_practical`];
               const writtenMarks = req.body[`subject_${subjectId}_written`];
               const remarks = req.body[`subject_${subjectId}_remarks`] || '';
               
               console.log(`\n----- Processing Subject ${subjectId} (${subject.name}) -----`);
               console.log('Practical field name:', `subject_${subjectId}_practical`);
               console.log('Practical value from form:', practicalMarks);
               console.log('Written field name:', `subject_${subjectId}_written`);
               console.log('Written value from form:', writtenMarks);
               
               // Only save if at least one field has a value (not empty string, not undefined, not null)
               const hasPractical = practicalMarks !== undefined && practicalMarks !== '' && practicalMarks !== null;
               const hasWritten = writtenMarks !== undefined && writtenMarks !== '' && writtenMarks !== null;
               
               if (hasPractical || hasWritten) {
                  // For End Term, we expect BOTH fields to be filled
                  // If only one is filled, we'll still save it but log a warning
                  const practical = hasPractical ? parseFloat(practicalMarks) : 0;
                  const written = hasWritten ? parseFloat(writtenMarks) : 0;
                  
                  console.log('Parsed practical:', practical);
                  console.log('Parsed written:', written);
                  console.log('Total:', practical + written);
                  
                  if (!hasPractical || !hasWritten) {
                     console.log(`⚠️ WARNING: End Term for ${subject.name} is incomplete!`);
                     if (!hasPractical) console.log('  - Practical marks not entered (will be 0)');
                     if (!hasWritten) console.log('  - Written marks not entered (will be 0)');
                  }
                  
                  marksData.practical_marks = practical;
                  marksData.practical_max_marks = 30;
                  marksData.written_marks = written;
                  marksData.written_max_marks = 70;
                  marksData.marks_obtained = practical + written;
                  marksData.max_marks = 100; // End Term total is always 100 (30+70)
                  marksData.remarks = remarks;
                  
                  await Marks.create(marksData);
                  savedCount++;
                  console.log(`✅ Saved End Term marks for ${subject.name}: Practical=${practical}/30, Written=${written}/70, Total=${practical + written}/100`);
               } else {
                  console.log('⚠️ Skipped - no marks entered for either practical or written');
               }
            } else {
               // Mid Term and other exams: Only written (70 marks for Mid Term)
               const marksObtained = req.body[`subject_${subjectId}_written`] || req.body[`subject_${subjectId}_marks`];
               const remarks = req.body[`subject_${subjectId}_remarks`] || '';
               
               if (marksObtained !== undefined && marksObtained !== '' && marksObtained !== null) {
                  const marks = parseFloat(marksObtained);
                  
                  marksData.written_marks = marks;
                  marksData.written_max_marks = exam_type === 'Mid Term' ? 70 : subject.max_marks;
                  marksData.marks_obtained = marks;
                  marksData.max_marks = exam_type === 'Mid Term' ? 70 : subject.max_marks;
                  marksData.remarks = remarks;
                  
                  await Marks.create(marksData);
                  savedCount++;
                  console.log(`Saved ${exam_type} marks for ${subject.name}: Written=${marks}/${marksData.max_marks}`);
               }
            }
         } catch(err) {
            console.log(`Error saving marks for subject ${subjectId}:`, err);
         }
      }
      
      console.log(`Total marks saved: ${savedCount}`);
      
      if (savedCount > 0) {
         // Redirect back to the same student to add more marks or to next student
         const redirectUrl = `/teacher/add-marks?course=${course}&semester=${semester}&section=${section}`;
         res.redirect(redirectUrl);
      } else {
         console.log('No marks were saved - redirecting back');
         res.redirect('/teacher/add-marks');
      }
      
   } catch(err) {
      console.log('Error in add-marks route:', err);
      res.redirect('/teacher/add-marks');
   }
});

// GET view all marks added by teacher
router.get('/teacher/view-marks', isTeacher, async function(req, res, next) {
   try {
      const { course, subject } = req.query;
      
      // Build query for filtering
      let query = { teacher_id: req.session.user.id };
      
      if (course) {
         query.course = course;
      }
      
      if (subject) {
         query.subject = subject;
      }
      
      // Fetch filtered marks
      const marks = await Marks.find(query)
         .sort({ created_at: -1 });
      
      // Fetch distinct courses and subjects for dropdowns
      const courses = await Marks.distinct('course', { teacher_id: req.session.user.id });
      const subjects = await Marks.distinct('subject', { teacher_id: req.session.user.id });
      
      res.render('teacher/view-marks', { 
         user: req.session.user,
         marks: marks,
         courses: courses,
         subjects: subjects,
         selectedCourse: course || '',
         selectedSubject: subject || ''
      });
   } catch(err) {
      console.log(err);
      res.render('teacher/view-marks', { 
         user: req.session.user,
         marks: [],
         courses: [],
         subjects: [],
         selectedCourse: '',
         selectedSubject: ''
      });
   }
});

// Edit marks
router.get('/teacher/edit-marks/:id', isTeacher, async function(req, res, next) {
   try {
      const mark = await Marks.findById(req.params.id);
      
      if(!mark) {
         return res.redirect('/teacher/view-marks');
      }
      
      const student = await Student.findById(mark.student_id);
      
      res.render('teacher/edit-marks', { 
         user: req.session.user,
         mark: mark,
         student: student
      });
   } catch(err) {
      console.log(err);
      res.redirect('/teacher/view-marks');
   }
});

router.post('/teacher/edit-marks/:id', isTeacher, async function(req, res, next) {
   try {
      const { subject, exam_type, max_marks, marks_obtained, remarks } = req.body;
      
      await Marks.findByIdAndUpdate(req.params.id, {
         subject: subject,
         exam_type: exam_type,
         max_marks: max_marks,
         marks_obtained: marks_obtained,
         remarks: remarks,
         updated_at: Date.now()
      });
      
      res.redirect('/teacher/view-marks');
   } catch(err) {
      console.log(err);
      res.redirect('/teacher/edit-marks/' + req.params.id);
   }
});

// Delete marks
router.post('/teacher/delete-marks/:id', isTeacher, async function(req, res, next) {
   try {
      await Marks.findByIdAndDelete(req.params.id);
      res.redirect('/teacher/view-marks');
   } catch(err) {
      console.log(err);
      res.redirect('/teacher/view-marks');
   }
});

router.get('/teacher/mark-attendance', isTeacher, async function(req, res, next) {
   try {
      const { course, semester, section } = req.query;
      
      let students = [];
      let courses = [];
      let semesters = [];
      let sections = [];
      
      // Fetch unique courses, semesters, sections for dropdowns
      courses = await Student.distinct('course');
      semesters = await Student.distinct('semester');
      sections = await Student.distinct('section');
      
      // If filters are applied, fetch matching students
      if (course && semester && section) {
         students = await Student.find({
            course: course,
            semester: semester,
            section: section
         }).sort({ rollnumber: 1 });
      }
      
      // Get success/error messages from session and clear them
      const successMessage = req.session.successMessage || null;
      const errorMessage = req.session.errorMessage || null;
      req.session.successMessage = null;
      req.session.errorMessage = null;
      
      res.render('teacher/mark-attendance', { 
         user: req.session.user,
         students: students,
         courses: courses,
         semesters: semesters,
         sections: sections,
         selectedCourse: course || '',
         selectedSemester: semester || '',
         selectedSection: section || '',
         successMessage: successMessage,
         errorMessage: errorMessage
      });
   } catch(err) {
      console.log(err);
      res.render('teacher/mark-attendance', { 
         user: req.session.user,
         students: [],
         courses: [],
         semesters: [],
         sections: [],
         selectedCourse: '',
         selectedSemester: '',
         selectedSection: '',
         successMessage: null,
         errorMessage: null
      });
   }
});

router.post('/teacher/submit-attendance', isTeacher, async function(req, res, next) {
   try {
      const { course, semester, section, date } = req.body;
      
      console.log('\n===== ATTENDANCE SUBMISSION =====');
      console.log('Course:', course);
      console.log('Semester:', semester);
      console.log('Section:', section);
      console.log('Date:', date);
      
      // Parse date as local date (YYYY-MM-DD) without time component
      const [year, month, day] = date.split('-').map(Number);
      const attendanceDate = new Date(year, month - 1, day, 0, 0, 0, 0);
      
      console.log('Parsed attendance date:', attendanceDate);
      
      // Get all students for this course/semester/section
      const students = await Student.find({
         course: course,
         semester: semester,
         section: section
      });
      
      console.log('Total students:', students.length);
      
      // Delete existing attendance for this date/course/semester/section to avoid duplicates
      // Use date range to match the entire day
      const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
      const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);
      
      await Attendance.deleteMany({
         course: course,
         semester: semester,
         section: section,
         date: {
            $gte: startOfDay,
            $lte: endOfDay
         }
      });
      
      let savedCount = 0;
      
      // Process attendance for each student
      for (const student of students) {
         const attendanceFieldName = `attendance_${student._id}`;
         const isPresent = req.body[attendanceFieldName] === 'present';
         
         // Create attendance record
         await Attendance.create({
            student_id: student._id,
            student_name: student.name,
            student_rollnumber: student.rollnumber,
            course: course,
            semester: semester,
            section: section,
            date: attendanceDate,
            status: isPresent ? 'present' : 'absent',
            teacher_id: req.session.user.id,
            teacher_name: req.session.user.name
         });
         
         savedCount++;
         console.log(`${student.rollnumber} - ${student.name}: ${isPresent ? 'Present' : 'Absent'}`);
      }
      
      console.log(`Attendance saved for ${savedCount} students`);
      console.log('=================================\n');
      
      // Store success message in session
      req.session.successMessage = `Attendance submitted successfully for ${savedCount} students on ${date}`;
      
      // Redirect back to mark attendance page with success message
      res.redirect(`/teacher/mark-attendance?course=${course}&semester=${semester}&section=${section}`);
      
   } catch(err) {
      console.log('Error submitting attendance:', err);
      req.session.errorMessage = 'Error submitting attendance. Please try again.';
      res.redirect('/teacher/mark-attendance');
   }
});

router.get('/teacher/profile', isTeacher, async function(req, res, next) {
   try {
      const teacher = await Teacher.findById(req.session.user.id);
      
      // Get success message from session and clear it
      const successMessage = req.session.successMessage || null;
      req.session.successMessage = null;
      
      res.render('teacher/profile', { 
         user: req.session.user,
         teacher: teacher,
         successMessage: successMessage
      });
   } catch(err) {
      console.log(err);
      res.redirect('/teacher/dashboard');
   }
});

router.get('/teacher/edit-profile', isTeacher, async function(req, res, next) {
   try {
      const teacher = await Teacher.findById(req.session.user.id);
      res.render('teacher/edit-profile', { 
         user: req.session.user,
         teacher: teacher
      });
   } catch(err) {
      console.log(err);
      res.redirect('/teacher/profile');
   }
});

router.post('/teacher/update-profile', isTeacher, async function(req, res, next) {
   try {
      const { phone, dob, gender, qualification, experience, street, city, state, pincode } = req.body;
      
      await Teacher.findByIdAndUpdate(req.session.user.id, {
         phone: phone,
         dob: dob,
         gender: gender,
         qualification: qualification,
         experience: experience,
         address: {
            street: street,
            city: city,
            state: state,
            pincode: pincode
         }
      });
      
      res.redirect('/teacher/profile');
   } catch(err) {
      console.log(err);
      res.redirect('/teacher/edit-profile');
   }
});

router.get('/teacher/change-password', isTeacher, function(req, res, next) {
   res.render('teacher/change-password', { user: req.session.user, error: null, success: null });
});

router.post('/teacher/change-password', isTeacher, async function(req, res, next) {
   try {
      const { currentPassword, newPassword, confirmPassword } = req.body;
      
      // Get teacher from database
      const teacher = await Teacher.findById(req.session.user.id);
      
      // Check if current password matches
      if (teacher.password !== currentPassword) {
         return res.render('teacher/change-password', { 
            user: req.session.user, 
            error: 'Current password is incorrect', 
            success: null 
         });
      }
      
      // Check if new passwords match
      if (newPassword !== confirmPassword) {
         return res.render('teacher/change-password', { 
            user: req.session.user, 
            error: 'New passwords do not match', 
            success: null 
         });
      }
      
      // Check minimum length
      if (newPassword.length < 6) {
         return res.render('teacher/change-password', { 
            user: req.session.user, 
            error: 'New password must be at least 6 characters long', 
            success: null 
         });
      }
      
      // Check if new password is same as current
      if (newPassword === currentPassword) {
         return res.render('teacher/change-password', { 
            user: req.session.user, 
            error: 'New password cannot be the same as current password', 
            success: null 
         });
      }
      
      // Update password
      await Teacher.findByIdAndUpdate(req.session.user.id, {
         password: newPassword
      });
      
      // Store success message in session and redirect
      req.session.successMessage = 'Password changed successfully!';
      res.redirect('/teacher/profile');
   } catch(err) {
      console.log(err);
      res.render('teacher/change-password', { 
         user: req.session.user, 
         error: 'An error occurred. Please try again.', 
         success: null 
      });
   }
});

// Admin middleware
function isAdmin(req, res, next) {
   if(req.session.user && req.session.user.role === 'admin'){
      next();
   } else {
      res.redirect('/login');
   }
}

/* Admin routes */
router.get('/admin/dashboard', isAdmin, async function(req, res, next) {
   try {
      // Count students and teachers
      const studentCount = await Student.countDocuments();
      const teacherCount = await Teacher.countDocuments();
      const totalUsers = studentCount + teacherCount;
      
      // Fetch recent activities (last 10)
      const recentActivities = await Activity.find()
         .sort({ timestamp: -1 })
         .limit(10);
      
      res.render('admin/dashboard', { 
         user: req.session.user,
         studentCount: studentCount,
         teacherCount: teacherCount,
         totalUsers: totalUsers,
         activities: recentActivities
      });
   } catch(err) {
      console.log(err);
      res.render('admin/dashboard', { 
         user: req.session.user,
         studentCount: 0,
         teacherCount: 0,
         totalUsers: 0,
         activities: []
      });
   }
});

router.get('/admin/students', isAdmin, async function(req, res, next) {
   try {
      // Get search and filter parameters from query string
      const searchQuery = req.query.search || '';
      const selectedCourse = req.query.course || '';
      const selectedStatus = req.query.status || '';

      // Build the query object
      let query = {};

      // Add search filter (search in name, email, rollnumber)
      if (searchQuery) {
         query.$or = [
            { name: { $regex: searchQuery, $options: 'i' } },
            { email: { $regex: searchQuery, $options: 'i' } },
            { rollnumber: { $regex: searchQuery, $options: 'i' } }
         ];
      }

      // Add course filter
      if (selectedCourse) {
         query.course = selectedCourse;
      }

      // Add status filter
      if (selectedStatus) {
         query.status = selectedStatus;
      }

      // Fetch filtered students from database
      const students = await Student.find(query);

      // Fetch all unique courses for the dropdown
      const courses = await Student.distinct('course');
      
      res.render('admin/students', { 
         user: req.session.user,
         students: students,
         courses: courses,
         searchQuery: searchQuery,
         selectedCourse: selectedCourse,
         selectedStatus: selectedStatus
      });
   } catch(err) {
      console.log(err);
      res.render('admin/students', { 
         user: req.session.user,
         students: [],
         courses: [],
         searchQuery: '',
         selectedCourse: '',
         selectedStatus: ''
      });
   }
});

router.get('/admin/teachers', isAdmin, async function(req, res, next) {
   try {
      // Get search and filter parameters from query string
      const searchQuery = req.query.search || '';
      const selectedDepartment = req.query.department || '';
      const selectedDesignation = req.query.designation || '';
      const selectedStatus = req.query.status || '';

      // Build the query object
      let query = {};

      // Add search filter (search in name, email, employee_id)
      if (searchQuery) {
         query.$or = [
            { name: { $regex: searchQuery, $options: 'i' } },
            { email: { $regex: searchQuery, $options: 'i' } },
            { employee_id: { $regex: searchQuery, $options: 'i' } }
         ];
      }

      // Add department filter
      if (selectedDepartment) {
         query.department = selectedDepartment;
      }

      // Add designation filter
      if (selectedDesignation) {
         query.designation = selectedDesignation;
      }

      // Add status filter
      if (selectedStatus) {
         query.status = selectedStatus;
      }

      // Fetch filtered teachers from database
      const teachers = await Teacher.find(query);

      // Fetch all unique departments and designations for the dropdowns
      const departments = await Teacher.distinct('department');
      const designations = await Teacher.distinct('designation');
      
      res.render('admin/teachers', { 
         user: req.session.user,
         teachers: teachers,
         departments: departments,
         designations: designations,
         searchQuery: searchQuery,
         selectedDepartment: selectedDepartment,
         selectedDesignation: selectedDesignation,
         selectedStatus: selectedStatus
      });
   } catch(err) {
      console.log(err);
      res.render('admin/teachers', { 
         user: req.session.user,
         teachers: [],
         departments: [],
         designations: [],
         searchQuery: '',
         selectedDepartment: '',
         selectedDesignation: '',
         selectedStatus: ''
      });
   }
});
router.get('/admin/profile', isAdmin, async function(req, res, next) {
   try {
      // Fetch full admin data from database
      const admin = await Admin.findById(req.session.user.id);
      
      // Count students and teachers
      const studentCount = await Student.countDocuments();
      const teacherCount = await Teacher.countDocuments();
      const totalActions = studentCount + teacherCount;
      
      res.render('admin/profile', { 
         user: admin,
         studentCount: studentCount,
         teacherCount: teacherCount,
         totalActions: totalActions
      });
   } catch(err) {
      console.log(err);
      res.render('admin/profile', { 
         user: req.session.user,
         studentCount: 0,
         teacherCount: 0,
         totalActions: 0
      });
   }
});

router.get('/admin/create-student', isAdmin, function(req, res, next) {
   res.render('admin/create-student', { user: req.session.user });
});

router.post('/admin/create-student', isAdmin, async function(req, res, next) {
   try {
      const { name, email, password, rollnumber, course, semester, section, batch } = req.body;
      
      const student = await Student.create({
         name: name,
         email: email,
         password: password,
         rollnumber: rollnumber,
         course: course,
         semester: semester,
         section: section,
         batch: batch
      });
      
      // Log activity
      await Activity.create({
         admin_id: req.session.user.id,
         admin_name: req.session.user.name,
         action: 'create',
         target_type: 'student',
         target_name: name,
         description: `Created new student: ${name} (${rollnumber})`
      });
      
      res.redirect('/admin/students');
   } catch(err) {
      console.log(err);
      res.redirect('/admin/create-student');
   }
});

router.get('/admin/edit-student/:id', isAdmin, async function(req, res, next) {
   try {
      const student = await Student.findById(req.params.id);
      
      if(!student) {
         return res.redirect('/admin/students');
      }
      
      res.render('admin/edit-student', { 
         user: req.session.user,
         student: student 
      });
   } catch(err) {
      console.log(err);
      res.redirect('/admin/students');
   }
});

router.post('/admin/edit-student/:id', isAdmin, async function(req, res, next) {
   try {
      const { name, email, password, rollnumber, course, semester, section, batch } = req.body;
      
      const updateData = {
         name: name,
         email: email,
         rollnumber: rollnumber,
         course: course,
         semester: semester,
         section: section,
         batch: batch
      };
      
      // Only update password if provided
      if(password && password.trim() !== '') {
         updateData.password = password;
      }
      
      await Student.findByIdAndUpdate(req.params.id, updateData);
      
      // Log activity
      await Activity.create({
         admin_id: req.session.user.id,
         admin_name: req.session.user.name,
         action: 'update',
         target_type: 'student',
         target_name: name,
         description: `Updated student profile: ${name}`
      });
      
      res.redirect('/admin/students');
   } catch(err) {
      console.log(err);
      res.redirect('/admin/edit-student/' + req.params.id);
   }
});

router.post('/admin/delete-student/:id', isAdmin, async function(req, res, next) {
   try {
      const student = await Student.findById(req.params.id);
      const studentName = student ? student.name : 'Unknown';
      
      await Student.findByIdAndDelete(req.params.id);
      
      // Log activity
      await Activity.create({
         admin_id: req.session.user.id,
         admin_name: req.session.user.name,
         action: 'delete',
         target_type: 'student',
         target_name: studentName,
         description: `Deleted student: ${studentName}`
      });
      
      res.redirect('/admin/students');
   } catch(err) {
      console.log(err);
      res.redirect('/admin/students');
   }
});

// Teacher Management Routes
router.get('/admin/create-teacher', isAdmin, function(req, res, next) {
   res.render('admin/create-teacher', { user: req.session.user });
});

// Replace the existing POST /admin/create-teacher route with this:
router.post('/admin/create-teacher', isAdmin, async function(req, res, next) {
   try {
      console.log('Creating teacher with data:', req.body); // Debug log
      
      const { name, email, password, employee_id, department, designation, date_of_joining } = req.body;
      
      // Validate required fields
      if (!name || !email || !password || !employee_id || !department || !designation || !date_of_joining) {
         console.log('Missing required fields');
         return res.redirect('/admin/create-teacher');
      }
      
      const teacher = await Teacher.create({
         name: name,
         email: email,
         password: password,
         employee_id: employee_id,
         department: department,
         designation: designation,
         date_of_joining: date_of_joining,
         role: 'teacher'
      });
      
      // Log activity
      await Activity.create({
         admin_id: req.session.user.id,
         admin_name: req.session.user.name,
         action: 'create',
         target_type: 'teacher',
         target_name: name,
         description: `Created new teacher: ${name} (${employee_id})`
      });
      
      console.log('Teacher created successfully:', teacher); // Debug log
      res.redirect('/admin/teachers');
   } catch(err) {
      console.log('Error creating teacher:', err.message); // Debug log
      console.log('Full error:', err); // Full error details
      res.redirect('/admin/create-teacher');
   }
});

router.get('/admin/edit-teacher/:id', isAdmin, async function(req, res, next) {
   try {
      const teacher = await Teacher.findById(req.params.id);
      
      if(!teacher) {
         return res.redirect('/admin/teachers');
      }
      
      res.render('admin/edit-teacher', { 
         user: req.session.user,
         teacher: teacher 
      });
   } catch(err) {
      console.log(err);
      res.redirect('/admin/teachers');
   }
});

router.post('/admin/edit-teacher/:id', isAdmin, async function(req, res, next) {
   try {
      const { name, email, password, employee_id, department, designation, date_of_joining, qualification, experience } = req.body;
      
      const updateData = {
         name: name,
         email: email,
         employee_id: employee_id,
         department: department,
         designation: designation,
         date_of_joining: date_of_joining,
         qualification: qualification,
         experience: experience
      };
      
      // Only update password if provided
      if(password && password.trim() !== '') {
         updateData.password = password;
      }
      
      await Teacher.findByIdAndUpdate(req.params.id, updateData);
      
      // Log activity
      await Activity.create({
         admin_id: req.session.user.id,
         admin_name: req.session.user.name,
         action: 'update',
         target_type: 'teacher',
         target_name: name,
         description: `Updated teacher profile: ${name}`
      });
      
      res.redirect('/admin/teachers');
   } catch(err) {
      console.log(err);
      res.redirect('/admin/edit-teacher/' + req.params.id);
   }
});

router.post('/admin/delete-teacher/:id', isAdmin, async function(req, res, next) {
   try {
      const teacher = await Teacher.findById(req.params.id);
      const teacherName = teacher ? teacher.name : 'Unknown';
      
      await Teacher.findByIdAndDelete(req.params.id);
      
      // Log activity
      await Activity.create({
         admin_id: req.session.user.id,
         admin_name: req.session.user.name,
         action: 'delete',
         target_type: 'teacher',
         target_name: teacherName,
         description: `Deleted teacher: ${teacherName}`
      });
      
      res.redirect('/admin/teachers');
   } catch(err) {
      console.log(err);
      res.redirect('/admin/teachers');
   }
});


router.get('/logout', function(req, res){
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
      res.redirect('/');
    } else {
      res.clearCookie('connect.sid'); // Clear session cookie
      res.redirect('/login');
    }
  });
});

module.exports = router;