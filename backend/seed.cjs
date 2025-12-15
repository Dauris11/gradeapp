const dbOps = require('./db_ops.cjs');

const seedDatabase = () => {
  console.log('Seeding database...');
  
  // Create admin user
  const existingAdmin = dbOps.loginUser('admin', 'admin');
  if (!existingAdmin) {
    dbOps.createUser('admin', 'admin', 'admin');
    console.log('Admin user created');
  }

  // Create students
  const students = dbOps.getStudents();
  if (students.length === 0) {
    const studentsData = [
      { name: 'Juan Pérez García', email: 'juan.perez@estudiante.com', phone: '555-0101', enrollment_date: '2024-09-01' },
      { name: 'María González López', email: 'maria.gonzalez@estudiante.com', phone: '555-0102', enrollment_date: '2024-09-01' },
      { name: 'Carlos Rodríguez Martínez', email: 'carlos.rodriguez@estudiante.com', phone: '555-0103', enrollment_date: '2024-09-02' },
      { name: 'Ana Martínez Sánchez', email: 'ana.martinez@estudiante.com', phone: '555-0104', enrollment_date: '2024-09-03' },
      { name: 'Luis Sánchez Torres', email: 'luis.sanchez@estudiante.com', phone: '555-0105', enrollment_date: '2024-09-05' },
      { name: 'Carmen Fernández Ruiz', email: 'carmen.fernandez@estudiante.com', phone: '555-0106', enrollment_date: '2024-09-05' },
      { name: 'Diego Ramírez Castro', email: 'diego.ramirez@estudiante.com', phone: '555-0107', enrollment_date: '2024-09-08' },
      { name: 'Sofía López Morales', email: 'sofia.lopez@estudiante.com', phone: '555-0108', enrollment_date: '2024-09-10' },
    ];
    
    studentsData.forEach(student => {
      dbOps.createStudent(student);
    });
    console.log(`${studentsData.length} students created`);
  }

  // Create subjects
  const subjects = dbOps.getSubjects();
  if (subjects.length === 0) {
    const subjectsData = [
      { name: 'Matemáticas', teacher_name: 'Prof. Alberto Einstein', description: 'Cálculo, Álgebra y Geometría Analítica' },
      { name: 'Historia Universal', teacher_name: 'Prof. Heródoto García', description: 'Historia de las civilizaciones antiguas y modernas' },
      { name: 'Física', teacher_name: 'Prof. Isaac Newton', description: 'Mecánica clásica y física moderna' },
      { name: 'Literatura', teacher_name: 'Prof. Gabriel García', description: 'Literatura española y latinoamericana' },
      { name: 'Química', teacher_name: 'Prof. Marie Curie', description: 'Química orgánica e inorgánica' },
      { name: 'Inglés', teacher_name: 'Prof. William Shakespeare', description: 'Gramática y conversación en inglés' },
    ];
    
    subjectsData.forEach(subject => {
      dbOps.createSubject(subject);
    });
    console.log(`${subjectsData.length} subjects created`);
  }

  // Create enrollments
  const enrollments = dbOps.getStudents().length > 0 && dbOps.getSubjects().length > 0;
  if (enrollments) {
    try {
      // Get all students and subjects
      const allStudents = dbOps.getStudents();
      const allSubjects = dbOps.getSubjects();
      
      // Enroll students in various subjects
      const enrollmentData = [
        { studentId: 1, subjectId: 1, term: 'Q1 2024' }, // Juan -> Matemáticas
        { studentId: 1, subjectId: 2, term: 'Q1 2024' }, // Juan -> Historia
        { studentId: 2, subjectId: 1, term: 'Q1 2024' }, // María -> Matemáticas
        { studentId: 2, subjectId: 3, term: 'Q1 2024' }, // María -> Física
        { studentId: 3, subjectId: 2, term: 'Q1 2024' }, // Carlos -> Historia
        { studentId: 3, subjectId: 4, term: 'Q1 2024' }, // Carlos -> Literatura
        { studentId: 4, subjectId: 1, term: 'Q1 2024' }, // Ana -> Matemáticas
        { studentId: 4, subjectId: 5, term: 'Q1 2024' }, // Ana -> Química
        { studentId: 5, subjectId: 3, term: 'Q1 2024' }, // Luis -> Física
        { studentId: 5, subjectId: 6, term: 'Q1 2024' }, // Luis -> Inglés
        { studentId: 6, subjectId: 4, term: 'Q1 2024' }, // Carmen -> Literatura
        { studentId: 7, subjectId: 5, term: 'Q1 2024' }, // Diego -> Química
        { studentId: 8, subjectId: 6, term: 'Q1 2024' }, // Sofía -> Inglés
      ];
      
      enrollmentData.forEach(enrollment => {
        try {
          dbOps.enrollStudent(enrollment.studentId, enrollment.subjectId, enrollment.term);
        } catch (e) {
          // Enrollment might already exist
          console.log('Enrollment already exists or error:', e.message);
        }
      });
      
      console.log('Enrollments created');
      
      // Add some grades
      const gradeData = [
        { enrollmentId: 1, type: 'exam', score: 92, max_score: 100, date: '2024-10-15', description: 'Parcial 1' },
        { enrollmentId: 2, type: 'exam', score: 88, max_score: 100, date: '2024-10-16', description: 'Parcial 1' },
        { enrollmentId: 3, type: 'exam', score: 95, max_score: 100, date: '2024-10-15', description: 'Parcial 1' },
        { enrollmentId: 4, type: 'exam', score: 90, max_score: 100, date: '2024-10-17', description: 'Parcial 1' },
        { enrollmentId: 5, type: 'exam', score: 85, max_score: 100, date: '2024-10-16', description: 'Parcial 1' },
      ];
      
      gradeData.forEach(grade => {
        try {
          dbOps.addGrade(grade.enrollmentId, grade);
        } catch (e) {
          console.log('Grade error:', e.message);
        }
      });
      
      console.log('Grades created');
    } catch (error) {
      console.log('Error creating enrollments:', error.message);
    }
  }
  
  console.log('Seeding complete');
};

module.exports = { seedDatabase };
