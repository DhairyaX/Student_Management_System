const mongoose = require('mongoose');
require('dotenv').config();

const Marks = require('./models/marks');

async function checkRecentMarks() {
   try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB\n');
      
      // Get all marks sorted by creation date (most recent first)
      const allMarks = await Marks.find().sort({ created_at: -1 }).limit(10);
      
      console.log(`Total marks in database: ${await Marks.countDocuments()}`);
      console.log(`\nShowing last 10 marks entries:\n`);
      
      if (allMarks.length === 0) {
         console.log('❌ NO MARKS FOUND IN DATABASE');
      } else {
         allMarks.forEach((mark, index) => {
            console.log(`--- Mark #${index + 1} ---`);
            console.log(`Student: ${mark.student_name}`);
            console.log(`Subject: ${mark.subject}`);
            console.log(`Exam Type: ${mark.exam_type}`);
            console.log(`Practical: ${mark.practical_marks}/${mark.practical_max_marks}`);
            console.log(`Written: ${mark.written_marks}/${mark.written_max_marks}`);
            console.log(`Total: ${mark.marks_obtained}/${mark.max_marks}`);
            console.log(`Created: ${mark.created_at}`);
            console.log('');
         });
      }
      
      await mongoose.connection.close();
   } catch(err) {
      console.error('Error:', err);
      process.exit(1);
   }
}

checkRecentMarks();
