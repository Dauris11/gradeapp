// Data Service using localStorage for persistence

// ============ STUDENTS API ============
export const studentsAPI = {
    getAll: () => {
        const data = localStorage.getItem('students');
        return data ? JSON.parse(data) : [];
    },
    
    getById: (id) => {
        const students = studentsAPI.getAll();
        return students.find(s => s.id === id);
    },
    
    create: (student) => {
        try {
            const students = studentsAPI.getAll();
            
            // Validación: email duplicado
            if (students.some(s => s.email === student.email)) {
                throw new Error('Ya existe un estudiante con este email');
            }
            
            // Generar matrícula automáticamente
            const year = new Date().getFullYear();
            const sequential = students.length > 0 
                ? Math.max(...students.map(s => {
                    // Extraer número secuencial de matrículas existentes del mismo año
                    if (s.matricula && s.matricula.startsWith(`GE${year}`)) {
                        return parseInt(s.matricula.substring(6)) || 0;
                    }
                    return 0;
                })) + 1
                : 1;
            
            const matricula = `GE${year}${String(sequential).padStart(4, '0')}`;
            
            const newStudent = {
                id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
                matricula,
                year,
                ...student,
                createdAt: new Date().toISOString()
            };
            students.push(newStudent);
            localStorage.setItem('students', JSON.stringify(students));
            return newStudent;
        } catch (error) {
            throw error;
        }
    },
    
    update: (id, updates) => {
        const students = studentsAPI.getAll();
        const index = students.findIndex(s => s.id === id);
        if (index !== -1) {
            students[index] = { ...students[index], ...updates };
            localStorage.setItem('students', JSON.stringify(students));
            return students[index];
        }
        return null;
    },
    
    delete: (id) => {
        const students = studentsAPI.getAll();
        const filtered = students.filter(s => s.id !== id);
        localStorage.setItem('students', JSON.stringify(filtered));
        
        // Also delete related enrollments and grades
        const enrollments = enrollmentsAPI.getAll();
        const filteredEnrollments = enrollments.filter(e => e.studentId !== id);
        localStorage.setItem('enrollments', JSON.stringify(filteredEnrollments));
        
        const grades = gradesAPI.getAll();
        const filteredGrades = grades.filter(g => g.studentId !== id);
        localStorage.setItem('grades', JSON.stringify(filteredGrades));
        
        return true;
    }
};

// ============ SUBJECTS API ============
export const subjectsAPI = {
    getAll: () => {
        const data = localStorage.getItem('subjects');
        return data ? JSON.parse(data) : [];
    },
    
    getById: (id) => {
        const subjects = subjectsAPI.getAll();
        return subjects.find(s => s.id === id);
    },
    
    create: (subject) => {
        const subjects = subjectsAPI.getAll();
        const colors = [
            '#3B82F6, #2563EB',
            '#22C55E, #16A34A',
            '#A855F7, #9333EA',
            '#F97316, #EA580C',
            '#EC4899, #DB2777',
            '#6366F1, #4F46E5'
        ];
        
        // Componentes por defecto si no se especifican
        const defaultComponents = subject.components || [
            {
                id: 1,
                name: "Tareas",
                type: "numeric",
                weight: 40,
                maxScore: 100
            },
            {
                id: 2,
                name: "Exámenes",
                type: "numeric",
                weight: 60,
                maxScore: 100
            }
        ];
        
        const newSubject = {
            id: subjects.length > 0 ? Math.max(...subjects.map(s => s.id)) + 1 : 1,
            ...subject,
            cycle: subject.cycle || "First cycle",
            components: defaultComponents,
            color: colors[subjects.length % colors.length],
            enrolled: 0,
            createdAt: new Date().toISOString()
        };
        subjects.push(newSubject);
        localStorage.setItem('subjects', JSON.stringify(subjects));
        return newSubject;
    },
    
    update: (id, updates) => {
        const subjects = subjectsAPI.getAll();
        const index = subjects.findIndex(s => s.id === id);
        if (index !== -1) {
            subjects[index] = { ...subjects[index], ...updates };
            localStorage.setItem('subjects', JSON.stringify(subjects));
            return subjects[index];
        }
        return null;
    },
    
    delete: (id) => {
        const subjects = subjectsAPI.getAll();
        const filtered = subjects.filter(s => s.id !== id);
        localStorage.setItem('subjects', JSON.stringify(filtered));
        
        // Also delete related enrollments and grades
        const enrollments = enrollmentsAPI.getAll();
        const filteredEnrollments = enrollments.filter(e => e.subjectId !== id);
        localStorage.setItem('enrollments', JSON.stringify(filteredEnrollments));
        
        const grades = gradesAPI.getAll();
        const filteredGrades = grades.filter(g => g.subjectId !== id);
        localStorage.setItem('grades', JSON.stringify(filteredGrades));
        
        return true;
    }
};

// ============ ENROLLMENTS API ============
export const enrollmentsAPI = {
    getAll: () => {
        const data = localStorage.getItem('enrollments');
        if (!data) return [];
        
        const enrollments = JSON.parse(data);
        const students = studentsAPI.getAll();
        const subjects = subjectsAPI.getAll();
        
        // Enrich with student and subject data
        return enrollments.map(enrollment => {
            const student = students.find(s => s.id === enrollment.studentId);
            const subject = subjects.find(s => s.id === enrollment.subjectId);
            return {
                ...enrollment,
                studentName: student?.name || 'Desconocido',
                subjectName: subject?.name || 'Desconocido',
                subjectCode: subject?.code || 'N/A',
                color: subject?.color || '#3B82F6, #2563EB',
                teacher: subject?.teacher || 'Sin asignar'
            };
        });
    },
    
    getById: (id) => {
        const enrollments = enrollmentsAPI.getAll();
        return enrollments.find(e => e.id === id);
    },
    
    getByStudent: (studentId) => {
        const enrollments = enrollmentsAPI.getAll();
        return enrollments.filter(e => e.studentId === studentId);
    },
    
    getBySubject: (subjectId) => {
        const enrollments = enrollmentsAPI.getAll();
        return enrollments.filter(e => e.subjectId === subjectId);
    },
    
    create: (enrollment) => {
        const enrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
        const newEnrollment = {
            id: enrollments.length > 0 ? Math.max(...enrollments.map(e => e.id)) + 1 : 1,
            ...enrollment,
            enrollDate: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        };
        enrollments.push(newEnrollment);
        localStorage.setItem('enrollments', JSON.stringify(enrollments));
        
        // Update subject enrolled count
        const subjects = subjectsAPI.getAll();
        const subject = subjects.find(s => s.id === enrollment.subjectId);
        if (subject) {
            subject.enrolled = (subject.enrolled || 0) + 1;
            subjectsAPI.update(subject.id, { enrolled: subject.enrolled });
        }
        
        return newEnrollment;
    },
    
    delete: (id) => {
        const enrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
        const enrollment = enrollments.find(e => e.id === id);
        
        if (enrollment) {
            // Update subject enrolled count
            const subjects = subjectsAPI.getAll();
            const subject = subjects.find(s => s.id === enrollment.subjectId);
            if (subject && subject.enrolled > 0) {
                subject.enrolled -= 1;
                subjectsAPI.update(subject.id, { enrolled: subject.enrolled });
            }
        }
        
        const filtered = enrollments.filter(e => e.id !== id);
        localStorage.setItem('enrollments', JSON.stringify(filtered));
        
        // Delete related grades
        const grades = gradesAPI.getAll();
        const filteredGrades = grades.filter(g => g.enrollmentId !== id);
        localStorage.setItem('grades', JSON.stringify(filteredGrades));
        
        return true;
    }
};

// ============ GRADES API (NEW) ============
export const gradesAPI = {
    getAll: () => {
        const data = localStorage.getItem('grades');
        if (!data) return [];
        
        const grades = JSON.parse(data);
        const enrollments = enrollmentsAPI.getAll();
        
        // Enrich with enrollment data
        return grades.map(grade => {
            const enrollment = enrollments.find(e => e.id === grade.enrollmentId);
            return {
                ...grade,
                studentId: enrollment?.studentId,
                studentName: enrollment?.studentName,
                subjectId: enrollment?.subjectId,
                subjectName: enrollment?.subjectName,
                subjectCode: enrollment?.subjectCode,
                color: enrollment?.color
            };
        });
    },
    
    getByEnrollment: (enrollmentId) => {
        const grades = gradesAPI.getAll();
        return grades.filter(g => g.enrollmentId === enrollmentId);
    },
    
    getByStudent: (studentId) => {
        const grades = gradesAPI.getAll();
        return grades.filter(g => g.studentId === studentId);
    },
    
    create: (grade) => {
        const grades = JSON.parse(localStorage.getItem('grades') || '[]');
        const newGrade = {
            id: grades.length > 0 ? Math.max(...grades.map(g => g.id)) + 1 : 1,
            ...grade,
            createdAt: new Date().toISOString()
        };
        grades.push(newGrade);
        localStorage.setItem('grades', JSON.stringify(grades));
        return newGrade;
    },
    
    update: (id, updates) => {
        const grades = JSON.parse(localStorage.getItem('grades') || '[]');
        const index = grades.findIndex(g => g.id === id);
        if (index !== -1) {
            grades[index] = { ...grades[index], ...updates };
            localStorage.setItem('grades', JSON.stringify(grades));
            return grades[index];
        }
        return null;
    },
    
    delete: (id) => {
        const grades = JSON.parse(localStorage.getItem('grades') || '[]');
        const filtered = grades.filter(g => g.id !== id);
        localStorage.setItem('grades', JSON.stringify(filtered));
        return true;
    },
    
    // Calculate accumulated grade for an enrollment
    calculateAccumulated: (enrollmentId) => {
        const grades = gradesAPI.getByEnrollment(enrollmentId);
        if (grades.length === 0) return null;
        
        const assignments = grades.filter(g => g.type === 'assignment');
        const exams = grades.filter(g => g.type === 'exam');
        
        const assignmentAvg = assignments.length > 0
            ? assignments.reduce((sum, g) => sum + g.score, 0) / assignments.length
            : 0;
        
        const examAvg = exams.length > 0
            ? exams.reduce((sum, g) => sum + g.score, 0) / exams.length
            : 0;
        
        // 40% assignments, 60% exams
        const accumulated = (assignmentAvg * 0.4) + (examAvg * 0.6);
        
        return {
            assignmentAvg: Math.round(assignmentAvg * 10) / 10,
            examAvg: Math.round(examAvg * 10) / 10,
            accumulated: Math.round(accumulated * 10) / 10,
            totalAssignments: assignments.length,
            totalExams: exams.length
        };
    }
};

// ============ INITIALIZATION ============
const initializeData = () => {
    // Check if data already exists
    if (localStorage.getItem('students')) return;
    
    // Sample students
    const students = [
        { id: 1, name: 'Juan Pérez', email: 'juan.perez@email.com', phone: '555-0001', enrollmentDate: '2024-09-01' },
        { id: 2, name: 'María González', email: 'maria.gonzalez@email.com', phone: '555-0002', enrollmentDate: '2024-09-01' },
        { id: 3, name: 'Carlos Rodríguez', email: 'carlos.rodriguez@email.com', phone: '555-0003', enrollmentDate: '2024-09-02' },
        { id: 4, name: 'Ana Martínez', email: 'ana.martinez@email.com', phone: '555-0004', enrollmentDate: '2024-09-02' },
        { id: 5, name: 'Luis Sánchez', email: 'luis.sanchez@email.com', phone: '555-0005', enrollmentDate: '2024-09-03' },
        { id: 6, name: 'Sofia López', email: 'sofia.lopez@email.com', phone: '555-0006', enrollmentDate: '2024-09-03' },
        { id: 7, name: 'Diego Torres', email: 'diego.torres@email.com', phone: '555-0007', enrollmentDate: '2024-09-04' },
        { id: 8, name: 'Isabella Ramírez', email: 'isabella.ramirez@email.com', phone: '555-0008', enrollmentDate: '2024-09-04' }
    ];
    
    // Sample subjects with teachers
    const subjects = [
        { id: 1, name: 'Matemáticas', code: 'MAT101', credits: 4, schedule: 'Lun, Mie, Vie 08:00-10:00', teacher: 'Prof. Einstein', color: '#3B82F6, #2563EB', enrolled: 0 },
        { id: 2, name: 'Historia Universal', code: 'HIS201', credits: 3, schedule: 'Mar, Jue 10:00-12:00', teacher: 'Prof. Cleopatra', color: '#22C55E, #16A34A', enrolled: 0 },
        { id: 3, name: 'Física', code: 'FIS101', credits: 4, schedule: 'Lun, Mie, Vie 10:00-12:00', teacher: 'Prof. Newton', color: '#A855F7, #9333EA', enrolled: 0 },
        { id: 4, name: 'Literatura', code: 'LIT301', credits: 3, schedule: 'Mar, Jue 08:00-10:00', teacher: 'Prof. Shakespeare', color: '#F97316, #EA580C', enrolled: 0 },
        { id: 5, name: 'Química', code: 'QUI101', credits: 4, schedule: 'Lun, Mie 14:00-16:00', teacher: 'Prof. Curie', color: '#EC4899, #DB2777', enrolled: 0 },
        { id: 6, name: 'Inglés', code: 'ING101', credits: 3, schedule: 'Mar, Jue, Vie 14:00-16:00', teacher: 'Prof. Austen', color: '#6366F1, #4F46E5', enrolled: 0 }
    ];
    
    // Sample enrollments
    const enrollments = [
        { id: 1, studentId: 1, subjectId: 1, enrollDate: '2024-09-01' },
        { id: 2, studentId: 1, subjectId: 2, enrollDate: '2024-09-01' },
        { id: 3, studentId: 2, subjectId: 1, enrollDate: '2024-09-01' },
        { id: 4, studentId: 2, subjectId: 3, enrollDate: '2024-09-02' },
        { id: 5, studentId: 3, subjectId: 2, enrollDate: '2024-09-03' },
        { id: 6, studentId: 3, subjectId: 4, enrollDate: '2024-09-03' },
        { id: 7, studentId: 4, subjectId: 1, enrollDate: '2024-09-02' },
        { id: 8, studentId: 4, subjectId: 5, enrollDate: '2024-09-02' },
        { id: 9, studentId: 5, subjectId: 3, enrollDate: '2024-09-03' },
        { id: 10, studentId: 5, subjectId: 6, enrollDate: '2024-09-03' },
        { id: 11, studentId: 6, subjectId: 2, enrollDate: '2024-09-03' },
        { id: 12, studentId: 7, subjectId: 4, enrollDate: '2024-09-04' }
    ];
    
    // Sample grades (assignments and exams)
    const grades = [
        // Juan Pérez - Matemáticas
        { id: 1, enrollmentId: 1, type: 'assignment', name: 'Tarea 1', score: 95, maxScore: 100, date: '2024-09-15' },
        { id: 2, enrollmentId: 1, type: 'assignment', name: 'Tarea 2', score: 88, maxScore: 100, date: '2024-09-22' },
        { id: 3, enrollmentId: 1, type: 'exam', name: 'Parcial 1', score: 92, maxScore: 100, date: '2024-10-01' },
        
        // Juan Pérez - Historia
        { id: 4, enrollmentId: 2, type: 'assignment', name: 'Ensayo 1', score: 85, maxScore: 100, date: '2024-09-18' },
        { id: 5, enrollmentId: 2, type: 'exam', name: 'Parcial 1', score: 90, maxScore: 100, date: '2024-10-05' },
        
        // María González - Matemáticas
        { id: 6, enrollmentId: 3, type: 'assignment', name: 'Tarea 1', score: 98, maxScore: 100, date: '2024-09-15' },
        { id: 7, enrollmentId: 3, type: 'assignment', name: 'Tarea 2', score: 92, maxScore: 100, date: '2024-09-22' },
        { id: 8, enrollmentId: 3, type: 'exam', name: 'Parcial 1', score: 96, maxScore: 100, date: '2024-10-01' },
        
        // María González - Física
        { id: 9, enrollmentId: 4, type: 'assignment', name: 'Lab 1', score: 90, maxScore: 100, date: '2024-09-20' },
        { id: 10, enrollmentId: 4, type: 'exam', name: 'Parcial 1', score: 88, maxScore: 100, date: '2024-10-03' },
        
        // Carlos Rodríguez - Historia
        { id: 11, enrollmentId: 5, type: 'assignment', name: 'Ensayo 1', score: 82, maxScore: 100, date: '2024-09-18' },
        { id: 12, enrollmentId: 5, type: 'exam', name: 'Parcial 1', score: 87, maxScore: 100, date: '2024-10-05' }
    ];
    
    // Update enrolled counts
    enrollments.forEach(enrollment => {
        const subject = subjects.find(s => s.id === enrollment.subjectId);
        if (subject) subject.enrolled = (subject.enrolled || 0) + 1;
    });
    
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('subjects', JSON.stringify(subjects));
    localStorage.setItem('enrollments', JSON.stringify(enrollments));
    localStorage.setItem('grades', JSON.stringify(grades));
};

// Initialize data on first load
initializeData();

export default {
    studentsAPI,
    subjectsAPI,
    enrollmentsAPI,
    gradesAPI
};
