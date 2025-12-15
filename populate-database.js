// Script para limpiar y poblar la base de datos con datos reales
// Ejecutar en la consola del navegador (F12)

// 1. LIMPIAR DATOS ACTUALES
localStorage.clear();
console.log('✅ Datos anteriores eliminados');

// 2. DATOS REALES BASADOS EN LA IMAGEN

// Estudiantes con matrículas
const students = [
    {
        id: 1,
        matricula: "GE202507",
        name: "Edgar Daniel Diaz Beato",
        email: "edgar.diaz@email.com",
        phone: "809-555-0001",
        year: 2025,
        enrollmentDate: "2025-01-15",
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        matricula: "GE202523",
        name: "Emely Caminero",
        email: "emely.caminero@email.com",
        phone: "809-555-0002",
        year: 2025,
        enrollmentDate: "2025-01-15",
        createdAt: new Date().toISOString()
    },
    {
        id: 3,
        matricula: "GE202541",
        name: "Ronalhys De Jesus Cruz Lopez",
        email: "ronalhys.cruz@email.com",
        phone: "809-555-0003",
        year: 2025,
        enrollmentDate: "2025-01-15",
        createdAt: new Date().toISOString()
    },
    {
        id: 4,
        matricula: "GE202553",
        name: "Harol Tapia Gomez",
        email: "harol.tapia@email.com",
        phone: "809-555-0004",
        year: 2025,
        enrollmentDate: "2025-01-15",
        createdAt: new Date().toISOString()
    },
    {
        id: 5,
        matricula: "GE202555",
        name: "Marianyi Acosta Paulino",
        email: "marianyi.acosta@email.com",
        phone: "809-555-0005",
        year: 2025,
        enrollmentDate: "2025-01-15",
        createdAt: new Date().toISOString()
    },
    {
        id: 6,
        matricula: "GE202566",
        name: "Dwaris Manuel Peña Lopez",
        email: "dwaris.pena@email.com",
        phone: "809-555-0006",
        year: 2025,
        enrollmentDate: "2025-01-15",
        createdAt: new Date().toISOString()
    },
    {
        id: 7,
        matricula: "GE202569",
        name: "Soribel Jean Alexander",
        email: "soribel.jean@email.com",
        phone: "809-555-0007",
        year: 2025,
        enrollmentDate: "2025-01-15",
        createdAt: new Date().toISOString()
    },
    {
        id: 8,
        matricula: "GE202571",
        name: "Oliannys Liberato",
        email: "oliannys.liberato@email.com",
        phone: "809-555-0008",
        year: 2025,
        enrollmentDate: "2025-01-15",
        createdAt: new Date().toISOString()
    }
];

// Materia: TECHNICAL ENGLISH COURSE
const subjects = [
    {
        id: 1,
        name: "TECHNICAL ENGLISH COURSE",
        code: "TEC-ENG",
        credits: "4",
        schedule: "Lun, Mie, Vie 08:00-10:00",
        teacher: "Prof. Smith",
        cycle: "First cycle",
        color: "#3B82F6, #2563EB",
        enrolled: 8,
        components: [
            {
                id: 1,
                name: "WRITING SPEAKING",
                type: "numeric",
                weight: 25,
                maxScore: 100
            },
            {
                id: 2,
                name: "READING COMPREHENSION",
                type: "numeric",
                weight: 25,
                maxScore: 100
            },
            {
                id: 3,
                name: "CLASES BIBLICAS",
                type: "letter",
                weight: 25
            },
            {
                id: 4,
                name: "ETICA Y VALORES",
                type: "letter",
                weight: 25
            }
        ],
        createdAt: new Date().toISOString()
    }
];

// Inscripciones (enrollments)
const enrollments = students.map((student, index) => ({
    id: index + 1,
    studentId: student.id,
    studentName: student.name,
    subjectId: 1,
    subjectName: "TECHNICAL ENGLISH COURSE",
    subjectCode: "TEC-ENG",
    teacher: "Prof. Smith",
    color: "#3B82F6, #2563EB",
    enrollmentDate: "2025-01-15",
    createdAt: new Date().toISOString()
}));

// Calificaciones basadas en la imagen
const gradesData = [
    { studentId: 1, writing: 75, reading: 100 },
    { studentId: 2, writing: 83, reading: 100 },
    { studentId: 3, writing: 78, reading: 82 },
    { studentId: 4, writing: 82, reading: 94 },
    { studentId: 5, writing: 88, reading: 100 },
    { studentId: 6, writing: 93, reading: 100 },
    { studentId: 7, writing: 91, reading: 100 },
    { studentId: 8, writing: 98, reading: 100 }
];

let gradeId = 1;
const grades = [];

gradesData.forEach((data, index) => {
    const enrollmentId = index + 1;
    
    // WRITING SPEAKING
    grades.push({
        id: gradeId++,
        enrollmentId: enrollmentId,
        studentId: data.studentId,
        componentId: 1,
        componentName: "WRITING SPEAKING",
        type: "assignment",
        name: "WRITING SPEAKING",
        score: data.writing,
        maxScore: 100,
        date: "2025-01-20",
        createdAt: new Date().toISOString()
    });
    
    // READING COMPREHENSION
    grades.push({
        id: gradeId++,
        enrollmentId: enrollmentId,
        studentId: data.studentId,
        componentId: 2,
        componentName: "READING COMPREHENSION",
        type: "exam",
        name: "READING COMPREHENSION",
        score: data.reading,
        maxScore: 100,
        date: "2025-01-22",
        createdAt: new Date().toISOString()
    });
});

// 3. GUARDAR EN LOCALSTORAGE
localStorage.setItem('students', JSON.stringify(students));
localStorage.setItem('subjects', JSON.stringify(subjects));
localStorage.setItem('enrollments', JSON.stringify(enrollments));
localStorage.setItem('grades', JSON.stringify(grades));

console.log('✅ Datos cargados exitosamente!');
console.log('📊 Estudiantes:', students.length);
console.log('📚 Materias:', subjects.length);
console.log('📝 Inscripciones:', enrollments.length);
console.log('🎯 Calificaciones:', grades.length);
console.log('\n🔄 Recarga la página para ver los cambios');
