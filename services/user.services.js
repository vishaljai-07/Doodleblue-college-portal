const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const generateToken = require('../JWT/userToken');

// Helper to create an error with a specific HTTP status code
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// ==========================================
// 1. SIGNUP USER SERVICE (Student only)
// ==========================================
const signupUser = async (userData) => {
  const { name, email, password, isActive, role } = userData;

  // Validate required fields
  if (!name || !email || !password) {
    throw createError('Please provide all required fields: name, email, and password', 400);
  }

  // Reject public signup attempt to create Teacher account
  if (role === 'Teacher') {
    throw createError(
      'Teacher accounts cannot be registered via public signup. Teachers must be manually created by an administrator.',
      400
    );
  }

  // Default role to Student
  const assignedRole = role || 'Student';
  if (assignedRole !== 'Student') {
    throw createError("Invalid role. Only 'Student' role is permitted for public registration.", 400);
  }

  // Check whether email already exists
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw createError('A user with this email already exists', 400);
  }

  // Hash password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Save the student in MongoDB
  const newUser = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    isActive: isActive !== undefined ? isActive : true,
    role: 'Student'
  });

  // Return safe response (token is generated only upon login, never return password)
  return {
    message: 'Student registered successfully. Please log in to get your authentication token.',
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isActive: newUser.isActive,
      createdAt: newUser.createdAt
    }
  };
};

// ==========================================
// 2. LOGIN USER SERVICE
// ==========================================
const loginUser = async (credentials) => {
  const { email, password } = credentials;

  // Validate required fields
  if (!email || !password) {
    throw createError('Please provide email and password', 400);
  }

  // Find user by normalized email
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw createError('Invalid email or password', 401);
  }

  // Verify submitted password against stored bcrypt hash
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw createError('Invalid email or password', 401);
  }

  // Reject inactive accounts
  if (!user.isActive) {
    throw createError('Your account is currently inactive. Please contact an administrator.', 403);
  }

  // Generate JWT token using JWT/userToken.js
  const token = generateToken(user);

  // Return token and safe user details (never return password)
  return {
    message: 'Login successful',
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    }
  };
};

// ==========================================
// 3. GET ALL STUDENTS SERVICE
// ==========================================
const getAllStudents = async () => {
  const students = await User.find({ role: 'Student' }).select('-password');
  return {
    count: students.length,
    students
  };
};

// ==========================================
// 4. GET ONE STUDENT BY ID SERVICE
// ==========================================
const getStudentById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError('Invalid student ID format', 400);
  }

  const student = await User.findOne({ _id: id, role: 'Student' }).select('-password');
  if (!student) {
    throw createError('Student not found', 404);
  }

  return { student };
};

// ==========================================
// 5. GET ALL TEACHERS SERVICE
// ==========================================
const getAllTeachers = async () => {
  const teachers = await User.find({ role: 'Teacher' }).select('-password');
  return {
    count: teachers.length,
    teachers
  };
};

// ==========================================
// 6. GET ONE TEACHER BY ID SERVICE
// ==========================================
const getTeacherById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError('Invalid teacher ID format', 400);
  }

  const teacher = await User.findOne({ _id: id, role: 'Teacher' }).select('-password');
  if (!teacher) {
    throw createError('Teacher not found', 404);
  }

  return { teacher };
};

// ==========================================
// 7. UPDATE PROFILE SERVICE (Own Profile)
// ==========================================
const updateProfile = async (userId, currentEmail, updateData) => {
  const { name, email } = updateData;

  if (!name && !email) {
    throw createError('Please provide at least one field to update: name or email', 400);
  }

  const updates = {};
  if (name) {
    updates.name = name.trim();
  }

  if (email) {
    const normalizedEmail = email.toLowerCase().trim();
    if (normalizedEmail !== currentEmail) {
      const emailExists = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: userId }
      });

      if (emailExists) {
        throw createError('Email is already in use by another account', 400);
      }
      updates.email = normalizedEmail;
    }
  }

  // Update authenticated user record
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  ).select('-password');

  return {
    message: 'Profile updated successfully',
    user: updatedUser
  };
};

// ==========================================
// 8. UPDATE STUDENT SERVICE (Teacher updates student)
// ==========================================
const updateStudent = async (studentId, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw createError('Invalid student ID format', 400);
  }

  const student = await User.findById(studentId);
  if (!student || student.role !== 'Student') {
    throw createError('Student not found with the specified ID', 404);
  }

  const { name, email, isActive } = updateData;
  if (name === undefined && email === undefined && isActive === undefined) {
    throw createError('Please provide at least one field to update: name, email, or isActive', 400);
  }

  const updates = {};
  if (name !== undefined) {
    updates.name = name.trim();
  }
  if (isActive !== undefined) {
    updates.isActive = Boolean(isActive);
  }
  if (email !== undefined) {
    const normalizedEmail = email.toLowerCase().trim();
    if (normalizedEmail !== student.email) {
      const emailExists = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: student._id }
      });

      if (emailExists) {
        throw createError('Email is already in use by another account', 400);
      }
      updates.email = normalizedEmail;
    }
  }

  const updatedStudent = await User.findByIdAndUpdate(
    student._id,
    { $set: updates },
    { new: true, runValidators: true }
  ).select('-password');

  return {
    message: 'Student details updated successfully',
    user: updatedStudent
  };
};

// ==========================================
// 9. SOFT DELETE STUDENT SERVICE (Teacher only)
// ==========================================
const softDeleteStudent = async (studentId) => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw createError('Invalid student ID format', 400);
  }

  const user = await User.findById(studentId);
  if (!user) {
    throw createError('User not found with the specified ID', 404);
  }

  // Incase if the target is a Teacher, access denied
  if (user.role === 'Teacher') {
    throw createError('Access denied: Cannot soft delete a Teacher account', 403);
  }

  if (user.role !== 'Student') {
    throw createError('Access denied: Only student accounts can be soft deleted', 403);
  }

  const updatedStudent = await User.findByIdAndUpdate(
    studentId,
    { $set: { isActive: false } },
    { new: true }
  ).select('-password');

  return {
    message: 'Student account soft deleted successfully',
    student: updatedStudent
  };
};

module.exports = {
  signupUser,
  loginUser,
  getAllStudents,
  getStudentById,
  getAllTeachers,
  getTeacherById,
  updateProfile,
  updateStudent,
  softDeleteStudent
};
