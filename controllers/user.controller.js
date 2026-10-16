const userServices = require('../services/user.services');

// ==========================================
// 1. SIGNUP CONTROLLER (Student only)
// ==========================================
const signup = async (req, res) => {
  try {
    const result = await userServices.signupUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      message: error.message || 'Registration failed'
    });
  }
};

// ==========================================
// 2. LOGIN CONTROLLER (Public)
// ==========================================
const login = async (req, res) => {
  try {
    const result = await userServices.loginUser(req.body);
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      message: error.message || 'Login failed'
    });
  }
};

// ==========================================
// 3. GET ALL STUDENTS CONTROLLER (Student & Teacher)
// ==========================================
const getAllStudents = async (req, res) => {
  try {
    const result = await userServices.getAllStudents();
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      message: error.message || 'Failed to fetch students'
    });
  }
};

// ==========================================
// 4. GET ONE STUDENT BY ID CONTROLLER (Student & Teacher)
// ==========================================
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userServices.getStudentById(id);
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      message: error.message || 'Failed to fetch student'
    });
  }
};

// ==========================================
// 5. GET ALL TEACHERS CONTROLLER (Teacher only)
// ==========================================
const getAllTeachers = async (req, res) => {
  try {
    const result = await userServices.getAllTeachers();
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      message: error.message || 'Failed to fetch teachers'
    });
  }
};

// ==========================================
// 6. GET ONE TEACHER BY ID CONTROLLER (Teacher only)
// ==========================================
const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userServices.getTeacherById(id);
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      message: error.message || 'Failed to fetch teacher'
    });
  }
};

// ==========================================
// 7. UPDATE OWN PROFILE CONTROLLER (Student & Teacher)
// ==========================================
const updateProfile = async (req, res) => {
  try {
    const result = await userServices.updateProfile(req.user._id, req.user.email, req.body);
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      message: error.message || 'Failed to update profile'
    });
  }
};

// ==========================================
// 8. TEACHER UPDATES STUDENT CONTROLLER (Teacher only)
// ==========================================
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userServices.updateStudent(id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      message: error.message || 'Failed to update student'
    });
  }
};

// ==========================================
// 9. SOFT DELETE STUDENT CONTROLLER (Teacher only)
// ==========================================
const softDeleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userServices.softDeleteStudent(id);
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      message: error.message || 'Failed to soft delete student'
    });
  }
};

module.exports = {
  signup,
  login,
  getAllStudents,
  getStudentById,
  getAllTeachers,
  getTeacherById,
  updateProfile,
  updateOwnProfile: updateProfile,
  updateStudent,
  updateStudentById: updateStudent,
  softDeleteStudent
};
