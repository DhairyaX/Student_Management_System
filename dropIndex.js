require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Drop the rollnumber index
    try {
      await mongoose.connection.db.collection('students').dropIndex('rollnumber_1');
      console.log('Successfully dropped rollnumber_1 index');
    } catch (error) {
      console.log('Error dropping index:', error.message);
    }
    
    mongoose.connection.close();
    console.log('Connection closed');
  })
  .catch(err => {
    console.log('Error:', err);
  });
