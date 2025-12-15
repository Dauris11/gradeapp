const { getDb } = require('./db.cjs');
const bcrypt = require('bcryptjs');

// Helper to get db instance
const db = () => getDb();

// --- Users / Auth ---

const createUser = (username, password, role = 'user') => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const stmt = db().prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)');
  return stmt.run(username, hash, role);
};

const loginUser = (username, password) => {
  const stmt = db().prepare('SELECT * FROM users WHERE username = ?');
  const user = stmt.get(username);
  if (!user) return null;
  
  const valid = bcrypt.compareSync(password, user.password_hash);
  if (valid) {
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }
  return null;
};

const getUsers = () => {
  return db().prepare('SELECT id, username, role, created_at FROM users ORDER BY username').all();
};

const updateUser = (id, data) => {
  const { username, password, role } = data;
  if (password) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const stmt = db().prepare('UPDATE users SET username = ?, password_hash = ?, role = ? WHERE id = ?');
      return stmt.run(username, hash, role, id);
  } else {
      const stmt = db().prepare('UPDATE users SET username = ?, role = ? WHERE id = ?');
      return stmt.run(username, role, id);
  }
};

const deleteUser = (id) => {
  return db().prepare('DELETE FROM users WHERE id = ?').run(id);
};

// --- Students ---

const getStudents = () => {
  return db().prepare('SELECT * FROM students ORDER BY name').all();
};

const createStudent = (student) => {
  const { name, email, phone, enrollment_date } = student;
  const stmt = db().prepare('INSERT INTO students (name, email, phone, enrollment_date) VALUES (?, ?, ?, ?)');
  return stmt.run(name, email, phone, enrollment_date);
};

const updateStudent = (id, student) => {
  const { name, email, phone } = student;
  const stmt = db().prepare('UPDATE students SET name = ?, email = ?, phone = ? WHERE id = ?');
  return stmt.run(name, email, phone, id);
};

const deleteStudent = (id) => {
  return db().prepare('DELETE FROM students WHERE id = ?').run(id);
};

// --- Subjects ---

const getSubjects = () => {
  return db().prepare('SELECT * FROM subjects ORDER BY name').all();
};

const createSubject = (subject) => {
  const { name, teacher_name, description } = subject;
  const stmt = db().prepare('INSERT INTO subjects (name, teacher_name, description) VALUES (?, ?, ?)');
  return stmt.run(name, teacher_name, description);
};

// --- Enrollments & Grades ---

const enrollStudent = (studentId, subjectId, term) => {
  const stmt = db().prepare('INSERT INTO enrollments (student_id, subject_id, term) VALUES (?, ?, ?)');
  return stmt.run(studentId, subjectId, term);
};

const getStudentGrades = (studentId) => {
   const stmt = db().prepare(`
     SELECT 
       s.name as subject_name,
       e.term,
       g.type,
       g.score,
       g.max_score,
       g.date
     FROM enrollments e
     JOIN subjects s ON e.subject_id = s.id
     LEFT JOIN grades g ON e.id = g.enrollment_id
     WHERE e.student_id = ?
   `);
   return stmt.all(studentId);
};

const addGrade = (enrollmentId, grade) => {
  const { type, score, max_score, date, description } = grade;
  const stmt = db().prepare(`
    INSERT INTO grades (enrollment_id, type, score, max_score, date, description) 
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(enrollmentId, type, score, max_score, date, description);
};

// --- Dashboard Stats ---

const getDashboardStats = () => {
  const studentCount = db().prepare('SELECT COUNT(*) as count FROM students').get().count;
  const subjectCount = db().prepare('SELECT COUNT(*) as count FROM subjects').get().count;
  return { studentCount, subjectCount };
};

module.exports = {
  createUser, loginUser, getUsers, updateUser, deleteUser,
  getStudents, createStudent, updateStudent, deleteStudent,
  getSubjects, createSubject,
  enrollStudent, getStudentGrades, addGrade,
  getDashboardStats
};
