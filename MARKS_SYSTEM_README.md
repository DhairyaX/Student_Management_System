# Marks Entry System - New Workflow

## Overview
The marks entry system has been completely restructured. Now teachers add marks for **one student at a time**, entering marks for **all subjects at once** for that student.

## New Workflow

### Step 1: Filter Students
- Teacher selects **Course**, **Semester**, and **Section**
- System displays all students matching the filters

### Step 2: Select Student
- Teacher clicks on a student card
- System displays student information and all subjects for their course/semester

### Step 3: Add Marks
- Teacher selects **Exam Type** (Mid Term, End Term, Assignment, Quiz, Project)
- Enters marks for **all subjects** in a single form
- Marks are saved for that student
- Teacher can go back to student list and select next student

## Key Features

### Subject Management
- **New Route**: `/teacher/manage-subjects`
- Teachers can add subjects with:
  - Subject Code (e.g., BCA101)
  - Subject Name (e.g., Data Structures)
  - Course (e.g., BCA)
  - Semester (1-8)
  - Credits (default: 3)
  - Max Marks (default: 100)

### Workflow Progress Indicator
- Visual 3-step progress bar showing:
  1. Filter Students ✓
  2. Select Student ✓
  3. Add Marks (current)

### Student Selection
- Grid layout with clickable student cards
- Shows student name, roll number, and email
- Easy navigation between students

### Subject-wise Marks Entry
- All subjects for the student's course/semester are displayed
- Single exam type applies to all subjects
- Each subject shows its max marks
- Optional remarks field for each subject

## Database Changes

### New Model: Subject
Located in `models/subject.js`:
- `code`: Subject code (e.g., BCA101)
- `name`: Subject name (e.g., Data Structures)
- `course`: Course name (e.g., BCA)
- `semester`: Semester number (1-8)
- `credits`: Credit hours (default: 3)
- `max_marks`: Maximum marks (default: 100)

### Modified Routes

#### GET `/teacher/add-marks`
- Accepts query params: `course`, `semester`, `section`, `student_id`
- Fetches students based on filters
- Fetches subjects for selected student's course/semester
- Passes exam types for dropdown

#### POST `/teacher/add-marks`
- Accepts: `student_id`, `exam_type`, `subject_<id>_marks`, `subject_<id>_remarks`
- Creates marks entries for each subject with marks entered
- Redirects back to student list for next student

#### GET `/teacher/manage-subjects`
- Displays all subjects grouped by course and semester
- Form to add new subjects

#### POST `/teacher/add-subject`
- Creates new subject with provided details

#### POST `/teacher/delete-subject/:id`
- Deletes subject by ID

## Setup Instructions

### 1. Add Sample Subjects (First Time Only)
Run the sample subjects script to populate the database:
```bash
node addSampleSubjects.js
```

This adds subjects for BCA course (Semesters 1-4).

### 2. Add Your Own Subjects
1. Login as teacher
2. Go to "Subjects" in the navbar
3. Fill in the "Add New Subject" form:
   - Subject Code (unique per course/semester)
   - Subject Name
   - Course (must match student's course exactly)
   - Semester (must match student's semester exactly)
   - Credits (optional, default: 3)
   - Max Marks (optional, default: 100)
4. Click "Add Subject"

### 3. Add Marks
1. Go to "Add Marks" in the navbar
2. **Step 1**: Select Course, Semester, Section → Click "Filter Students"
3. **Step 2**: Click on a student card
4. **Step 3**: 
   - Select Exam Type
   - Enter marks for each subject (leave blank to skip)
   - Add optional remarks
   - Click "Save Marks"
5. Click "Back to Students" to select next student
6. Repeat for all students

## Important Notes

⚠️ **Subject Setup Required**: Before adding marks, subjects MUST be created for each course/semester combination.

⚠️ **Course/Semester Match**: Subject's course and semester must EXACTLY match the student's course and semester.

⚠️ **One Student at a Time**: This design ensures focused data entry and reduces errors.

⚠️ **Exam Type**: Same exam type is used for all subjects in one session. To add marks for different exam types, select the student again.

## Benefits

✅ **Reduced Errors**: Entering marks for one student at a time is more accurate
✅ **Complete Records**: All subjects for a student are entered together
✅ **Clear Workflow**: Visual progress indicator shows where you are
✅ **Flexible**: Skip subjects by leaving marks blank
✅ **Subject Reusability**: Subjects defined once, used for all students

## Files Modified

1. **Models**:
   - `models/subject.js` (NEW)

2. **Routes**:
   - `routes/index.js` (modified add-marks GET/POST, added manage-subjects routes)

3. **Views**:
   - `views/teacher/add-marks.ejs` (completely redesigned)
   - `views/teacher/manage-subjects.ejs` (NEW)
   - `views/partials/navbar.ejs` (NEW - includes Subjects link)

4. **Scripts**:
   - `addSampleSubjects.js` (NEW - sample data)

## Troubleshooting

**Problem**: No subjects showing when adding marks
**Solution**: Add subjects using `/teacher/manage-subjects` first

**Problem**: Subject code already exists error
**Solution**: Each subject code must be unique per course/semester combination

**Problem**: No students found
**Solution**: Ensure students exist with matching course, semester, and section

**Problem**: Navbar not showing
**Solution**: Update your views to use `<%- include('../partials/navbar') %>`
