# College Portal Backend - Postman API Documentation

This guide provides all the API endpoints, methods, headers, JSON request bodies, and expected responses to test using **Postman**.

> **Base URL:** `http://localhost:3000`

---

## 📌 Postman Setup Instructions

1. **Headers for all POST / PUT requests:**
   * Key: `Content-Type`
   * Value: `application/json`
2. **For Protected Endpoints:**
   * Under the **Authorization** tab in Postman:
     * Type: **Bearer Token**
     * Token: `<paste_jwt_token_received_from_login_or_signup>`
   * Or under the **Headers** tab:
     * Key: `Authorization`
     * Value: `Bearer <paste_jwt_token>`

---

## 1. Check API Status & Endpoint Directory

* **Method:** `GET`
* **URL:** `http://localhost:3000/api/users/`
* **Authorization:** None
* **Expected Response (200 OK):**
```json
{
  "message": "College Portal Users API",
  "endpoints": {
    "public": {
      "signup": "POST /api/users/signup",
      "login": "POST /api/users/login"
    },
    "students": {
      "getAllStudents": "GET /api/users/students",
      "getStudentById": "GET /api/users/students/:id",
      "updateStudentByTeacher": "PUT /api/users/students/:id (Teacher only)"
    },
    "teachers": {
      "getAllTeachers": "GET /api/users/teachers (Teacher only)",
      "getTeacherById": "GET /api/users/teachers/:id (Teacher only)"
    },
    "profile": {
      "updateOwnProfile": "PUT /api/users/profile"
    }
  }
}
```

---

## 2. Register a New Student

* **Method:** `POST`
* **URL:** `http://localhost:3000/api/users/signup`
* **Headers:** `Content-Type: application/json`
* **Body (raw JSON):**
```json
{
  "name": "Vishal",
  "email": "vishal.student@example.com",
  "password": "Vishal@123",
  "role": "Student",
  "isActive": true
}
```
* **Expected Response (201 Created):**
```json
{
  "message": "Student registered successfully. Please log in to get your authentication token.",
  "user": {
    "_id": "673f1a2b4c5d6e7f8a9b0c1d",
    "name": "Vishal",
    "email": "vishal.student@example.com",
    "role": "Student",
    "isActive": true,
    "createdAt": "2026-10-16T04:20:00.000Z"
  }
}
```

---

## 3. Register a New Teacher

* **Method:** `POST`
* **URL:** `http://localhost:3000/api/users/signup`
* **Headers:** `Content-Type: application/json`
* **Body (raw JSON):**
```json
{
  "name": "Prof. Sharma",
  "email": "sharma.teacher@example.com",
  "password": "Teacher@123",
  "role": "Teacher",
  "isActive": true
}
```
* **Expected Response (201 Created):**
```json
{
  "message": "Teacher registered successfully. Please log in to get your authentication token.",
  "user": {
    "_id": "673f1a2b4c5d6e7f8a9b0c2e",
    "name": "Prof. Sharma",
    "email": "sharma.teacher@example.com",
    "role": "Teacher",
    "isActive": true,
    "createdAt": "2026-10-16T04:22:00.000Z"
  }
}
```

---

## 4. Login (Student or Teacher)

* **Method:** `POST`
* **URL:** `http://localhost:3000/api/users/login`
* **Headers:** `Content-Type: application/json`
* **Body (raw JSON):**
```json
{
  "email": "vishal.student@example.com",
  "password": "Vishal@123"
}
```
* **Expected Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "_id": "673f1a2b4c5d6e7f8a9b0c1d",
    "name": "Vishal",
    "email": "vishal.student@example.com",
    "role": "Student",
    "isActive": true,
    "createdAt": "2026-10-16T04:20:00.000Z"
  }
}
```
> 💡 **Tip:** Copy the `token` from this response and use it as the Bearer token for protected requests below.

---

## 5. Get All Students

* **Method:** `GET`
* **URL:** `http://localhost:3000/api/users/students`
* **Authorization:** `Bearer <TOKEN>` *(Allowed: Student, Teacher)*
* **Expected Response (200 OK):**
```json
{
  "count": 1,
  "students": [
    {
      "_id": "673f1a2b4c5d6e7f8a9b0c1d",
      "name": "Vishal",
      "email": "vishal.student@example.com",
      "isActive": true,
      "role": "Student",
      "createdAt": "2026-10-16T04:20:00.000Z",
      "updatedAt": "2026-10-16T04:20:00.000Z"
    }
  ]
}
```

---

## 6. Get Single Student by ID

* **Method:** `GET`
* **URL:** `http://localhost:3000/api/users/students/673f1a2b4c5d6e7f8a9b0c1d`
* **Authorization:** `Bearer <TOKEN>` *(Allowed: Student, Teacher)*
* **Expected Response (200 OK):**
```json
{
  "student": {
    "_id": "673f1a2b4c5d6e7f8a9b0c1d",
    "name": "Vishal",
    "email": "vishal.student@example.com",
    "isActive": true,
    "role": "Student",
    "createdAt": "2026-10-16T04:20:00.000Z",
    "updatedAt": "2026-10-16T04:20:00.000Z"
  }
}
```

---

## 7. Update Own Profile

* **Method:** `PUT`
* **URL:** `http://localhost:3000/api/users/profile`
* **Authorization:** `Bearer <TOKEN>` *(Allowed: Student, Teacher)*
* **Headers:** `Content-Type: application/json`
* **Body (raw JSON):**
```json
{
  "name": "Vishal Kumar",
  "email": "vishal.new@example.com"
}
```
*(Note: Only `name` and `email` can be updated through this endpoint. Role and password are not allowed).*
* **Expected Response (200 OK):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "673f1a2b4c5d6e7f8a9b0c1d",
    "name": "Vishal Kumar",
    "email": "vishal.new@example.com",
    "isActive": true,
    "role": "Student",
    "createdAt": "2026-10-16T04:20:00.000Z",
    "updatedAt": "2026-10-16T04:25:00.000Z"
  }
}
```

---

## 8. Get All Teachers *(Teacher Only)*

* **Method:** `GET`
* **URL:** `http://localhost:3000/api/users/teachers`
* **Authorization:** `Bearer <TEACHER_TOKEN>`
* **Expected Response (200 OK):**
```json
{
  "count": 1,
  "teachers": [
    {
      "_id": "673f1a2b4c5d6e7f8a9b0c2e",
      "name": "Prof. Sharma",
      "email": "sharma.teacher@example.com",
      "isActive": true,
      "role": "Teacher",
      "createdAt": "2026-10-16T04:22:00.000Z",
      "updatedAt": "2026-10-16T04:22:00.000Z"
    }
  ]
}
```
* **If accessed using a Student token (403 Forbidden):**
```json
{
  "message": "Access denied"
}
```

---

## 9. Get Single Teacher by ID *(Teacher Only)*

* **Method:** `GET`
* **URL:** `http://localhost:3000/api/users/teachers/673f1a2b4c5d6e7f8a9b0c2e`
* **Authorization:** `Bearer <TEACHER_TOKEN>`
* **Expected Response (200 OK):**
```json
{
  "teacher": {
    "_id": "673f1a2b4c5d6e7f8a9b0c2e",
    "name": "Prof. Sharma",
    "email": "sharma.teacher@example.com",
    "isActive": true,
    "role": "Teacher",
    "createdAt": "2026-10-16T04:22:00.000Z",
    "updatedAt": "2026-10-16T04:22:00.000Z"
  }
}
```

---

## 10. Teacher Updates a Student's Details *(Teacher Only)*

* **Method:** `PUT`
* **URL:** `http://localhost:3000/api/users/students/<STUDENT_ID>` *(or `http://localhost:3000/api/users/student/<STUDENT_ID>`)*
* **Authorization:** `Bearer <TEACHER_TOKEN>`
* **Headers:** `Content-Type: application/json`
* **Body (raw JSON):**
```json
{
  "name": "Vishal Updated By Teacher",
  "email": "vishal.updated@example.com",
  "isActive": true
}
```
*(Teachers can update `name`, `email`, and `isActive` of students).*
* **Expected Response (200 OK):**
```json
{
  "message": "Student details updated successfully",
  "user": {
    "_id": "673f1a2b4c5d6e7f8a9b0c1d",
    "name": "Vishal Updated By Teacher",
    "email": "vishal.updated@example.com",
    "isActive": true,
    "role": "Student",
    "createdAt": "2026-10-16T04:20:00.000Z",
    "updatedAt": "2026-10-16T04:30:00.000Z"
  }
}
```

---

## 11. Teacher Soft Deletes a Student *(Teacher Only)*

* **Method:** `PATCH` (or `DELETE` / `PUT`)
* **URL:** `http://localhost:3000/api/users/teacher/softdelete/<STUDENT_ID>`
* **Authorization:** `Bearer <TEACHER_TOKEN>`
* **Headers:** `Content-Type: application/json`
* **Body:** None (or `{}`)
* **Expected Response (200 OK):**
```json
{
  "message": "Student account soft deleted successfully",
  "student": {
    "_id": "673f1a2b4c5d6e7f8a9b0c1d",
    "name": "Vishal",
    "email": "vishal.student@example.com",
    "role": "Student",
    "isActive": false,
    "createdAt": "2026-10-16T04:20:00.000Z",
    "updatedAt": "2026-10-16T04:35:00.000Z"
  }
}
```

### 🔒 Access Denied Scenarios for Soft Delete:
1. **If the ID provided belongs to a Teacher:**
   * **Status:** `403 Forbidden`
   * **Response:**
     ```json
     {
       "message": "Access denied: Cannot soft delete a Teacher account"
     }
     ```
2. **If a Student calls this endpoint:**
   * **Status:** `403 Forbidden`
   * **Response:**
     ```json
     {
       "message": "Access denied"
     }
     ```

---

## ❌ Common Error Responses & Status Codes

| Scenario | HTTP Status | Sample Response Body |
| :--- | :--- | :--- |
| Missing required fields | `400 Bad Request` | `{"message": "Please provide all required fields: name, email, and password"}` |
| Invalid role | `400 Bad Request` | `{"message": "Invalid role. Role must be either 'Student' or 'Teacher'."}` |
| Duplicate email | `400 Bad Request` | `{"message": "A user with this email already exists"}` |
| Wrong login password | `401 Unauthorized` | `{"message": "Invalid email or password"}` |
| Missing Bearer token | `401 Unauthorized` | `{"message": "Authentication token is required. Format: Bearer <token>"}` |
| Student accesses Teacher route | `403 Forbidden` | `{"message": "Access denied"}` |
| Deactivated account login | `403 Forbidden` | `{"message": "Your account is currently inactive. Please contact an administrator."}` |
| User ID not found | `404 Not Found` | `{"message": "Student not found"}` |
