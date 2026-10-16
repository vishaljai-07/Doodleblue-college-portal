const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const permissionMiddleware = require('../middleware/permission.middleware');

// ==========================================
// 1. PUBLIC ROUTES
// ==========================================

// Base directory info
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'College Portal Users API',
    endpoints: {
      public: {
        signup: 'POST /api/users/signup',
        login: 'POST /api/users/login'
      },
      students: {
        getAllStudents: 'GET /api/users/students',
        getStudentById: 'GET /api/users/students/:id',
        updateStudent: 'PATCH/PUT /api/users/students/:id (Teacher only)'
      },
      teachers: {
        getAllTeachers: 'GET /api/users/teachers (Teacher only)',
        getTeacherById: 'GET /api/users/teachers/:id (Teacher only)',
        softDeleteStudent: 'PATCH/DELETE /api/users/teacher/softdelete/:id (Teacher only)'
      },
      profile: {
        updateProfile: 'PATCH/PUT /api/users/profile'
      }
    }
  });
});

// Register a new Student
router.post('/signup', userController.signup);

// Login for both Students and Teachers
router.post('/login', userController.login);

// ==========================================
// 2. STUDENT & TEACHER SHARED ROUTES
// ==========================================

// Get all students (Students and Teachers can access)
router.get('/students', authMiddleware, permissionMiddleware('Student', 'Teacher'), userController.getAllStudents);

// Get single student by ID (Students and Teachers can access)
router.get('/students/:id', authMiddleware, permissionMiddleware('Student', 'Teacher'), userController.getStudentById);
router.get('/student/:id', authMiddleware, permissionMiddleware('Student', 'Teacher'), userController.getStudentById);

// Update own profile (Students and Teachers can update only their own profile)
router.patch('/profile', authMiddleware, permissionMiddleware('Student', 'Teacher'), userController.updateProfile);
router.put('/profile', authMiddleware, permissionMiddleware('Student', 'Teacher'), userController.updateProfile);

// ==========================================
// 3. TEACHER-ONLY ROUTES
// ==========================================

// Get all teachers (Allow access only to teachers)
router.get('/teachers', authMiddleware, permissionMiddleware('Teacher'), userController.getAllTeachers);

// Get single teacher by ID (Allow access only to teachers)
router.get('/teachers/:id', authMiddleware, permissionMiddleware('Teacher'), userController.getTeacherById);
router.get('/teacher/:id', authMiddleware, permissionMiddleware('Teacher'), userController.getTeacherById);

// Update student details (Allow access only to teachers)
router.patch('/students/:id', authMiddleware, permissionMiddleware('Teacher'), userController.updateStudent);
router.put('/students/:id', authMiddleware, permissionMiddleware('Teacher'), userController.updateStudent);
router.patch('/student/:id', authMiddleware, permissionMiddleware('Teacher'), userController.updateStudent);
router.put('/student/:id', authMiddleware, permissionMiddleware('Teacher'), userController.updateStudent);

// Soft delete student (Teacher only, cannot delete a teacher)
router.patch('/teacher/softdelete/:id', authMiddleware, permissionMiddleware('Teacher'), userController.softDeleteStudent);
router.delete('/teacher/softdelete/:id', authMiddleware, permissionMiddleware('Teacher'), userController.softDeleteStudent);
router.put('/teacher/softdelete/:id', authMiddleware, permissionMiddleware('Teacher'), userController.softDeleteStudent);
router.patch('/teachers/softdelete/:id', authMiddleware, permissionMiddleware('Teacher'), userController.softDeleteStudent);
router.delete('/teachers/softdelete/:id', authMiddleware, permissionMiddleware('Teacher'), userController.softDeleteStudent);

module.exports = router;
