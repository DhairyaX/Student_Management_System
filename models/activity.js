const mongoose = require('mongoose');
  
const activitySchema = new mongoose.Schema({
  admin_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Admin', 
    required: true 
  },
  admin_name: { 
    type: String, 
    required: true 
  },
  action: { 
    type: String, 
    required: true,
    enum: ['create', 'update', 'delete', 'login', 'logout']
  },
  target_type: { 
    type: String, 
    required: true,
    enum: ['student', 'teacher', 'admin']
  },
  target_name: { 
    type: String 
  },
  description: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

// Index for efficient querying
activitySchema.index({ timestamp: -1 });
activitySchema.index({ admin_id: 1 });

module.exports = mongoose.model('Activity', activitySchema);
