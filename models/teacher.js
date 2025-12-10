const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  employee_id: { type: String },
  department: { type: String },
  designation: { type: String },
  date_of_joining: { type: Date },
  qualification: { type: String },
  experience: { type: String },
  phone: { type: String },
  gender : { type: String},
  dob : { type: Date},
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String }
  },
  profilepicture: { type: String }

});

// Drop the old teacher_id index if it exists
teacherSchema.index({ teacher_id: 1 }, { sparse: true, unique: false });

module.exports = mongoose.model('Teacher', teacherSchema);