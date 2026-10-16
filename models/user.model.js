const mongoose = require('mongoose');

// Single User schema for both Student and Teacher roles
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: ['Student', 'Teacher'],
        message: 'Role must be either Student or Teacher'
      }
    }
  },
  {
    timestamps: true // Automatically manages createdAt and updatedAt
  }
);

// Export User model
const User = mongoose.model('User', userSchema);

module.exports = User;
