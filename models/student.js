const mongoose = require('mongoose');
  
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rollnumber: { type: String, unique: true, sparse : true },
  course: { type: String },
  semester: { type: String },
  section: { type: String },
  batch: { type: String },
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

module.exports = mongoose.model('Student', studentSchema);