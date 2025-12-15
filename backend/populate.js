const { db } = require('./database');

// Poblar base de datos con datos de ejemplo
function populateDatabase() {
    console.log('📊 Poblando base de datos...');
    
    // Verificar si ya hay datos
    const studentCount = db.prepare('SELECT COUNT(*) as count FROM students').get();
    if (studentCount.count > 0) {
        console.log('⚠️ La base de datos ya tiene datos');
        return;
    }
    
    // Insertar estudiantes
    const insertStudent = db.prepare(`
        INSERT INTO students (matricula, name, email, phone, year, enrollmentDate)
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const students = [
        ['GE20250001', 'Juan Pérez', 'juan.perez@email.com', '809-555-0001', 2025, '2024-01-15'],
        ['GE20250002', 'María González', 'maria.gonzalez@email.com', '809-555-0002', 2025, '2024-01-15'],
        ['GE20250003', 'Carlos Rodríguez', 'carlos.rodriguez@email.com', '809-555-0003', 2025, '2024-01-20'],
        ['GE20250004', 'Ana Martínez', 'ana.martinez@email.com', '809-555-0004', 2025, '2024-01-20'],
        ['GE20250005', 'Luis Sánchez', 'luis.sanchez@email.com', '809-555-0005', 2025, '2024-02-01'],
        ['GE20250006', 'Carmen López', 'carmen.lopez@email.com', '809-555-0006', 2025, '2024-02-01'],
        ['GE20250007', 'Pedro Ramírez', 'pedro.ramirez@email.com', '809-555-0007', 2025, '2024-02-10'],
        ['GE20250008', 'Laura Torres', 'laura.torres@email.com', '809-555-0008', 2025, '2024-02-10']
    ];
    
    students.forEach(s => insertStudent.run(...s));
    console.log(`✅ ${students.length} estudiantes creados`);
    
    // Insertar materias
    const insertSubject = db.prepare(`
        INSERT INTO subjects (name, code, credits, schedule, teacher, cycle, color, components)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const subjects = [
        ['Matemáticas Avanzadas', 'MAT101', '4', 'Lun-Mié-Vie 8:00-10:00', 'Dr. Roberto Fernández', 'First cycle', '#3B82F6, #2563EB', JSON.stringify([
            { id: 1, name: 'Tareas', type: 'numeric', weight: 30, maxScore: 100 },
            { id: 2, name: 'Parciales', type: 'numeric', weight: 40, maxScore: 100 },
            { id: 3, name: 'Examen Final', type: 'numeric', weight: 30, maxScore: 100 }
        ])],
        ['Historia Universal', 'HIS201', '3', 'Mar-Jue 10:00-12:00', 'Lic. Patricia Morales', 'First cycle', '#22C55E, #16A34A', JSON.stringify([
            { id: 1, name: 'Investigaciones', type: 'numeric', weight: 35, maxScore: 100 },
            { id: 2, name: 'Presentaciones', type: 'numeric', weight: 25, maxScore: 100 },
            { id: 3, name: 'Exámenes', type: 'numeric', weight: 40, maxScore: 100 }
        ])],
        ['Programación I', 'PRG101', '4', 'Lun-Mié-Vie 14:00-16:00', 'Ing. Miguel Ángel Castro', 'First cycle', '#A855F7, #9333EA', JSON.stringify([
            { id: 1, name: 'Prácticas', type: 'numeric', weight: 40, maxScore: 100 },
            { id: 2, name: 'Proyectos', type: 'numeric', weight: 35, maxScore: 100 },
            { id: 3, name: 'Examen Final', type: 'numeric', weight: 25, maxScore: 100 }
        ])],
        ['Física General', 'FIS101', '4', 'Mar-Jue 8:00-10:00', 'Dr. Jorge Vargas', 'First cycle', '#F97316, #EA580C', JSON.stringify([
            { id: 1, name: 'Laboratorios', type: 'numeric', weight: 30, maxScore: 100 },
            { id: 2, name: 'Tareas', type: 'numeric', weight: 20, maxScore: 100 },
            { id: 3, name: 'Parciales', type: 'numeric', weight: 50, maxScore: 100 }
        ])],
        ['Química Orgánica', 'QUI201', '4', 'Lun-Mié 16:00-18:00', 'Dra. Sandra Méndez', 'Second cycle', '#EC4899, #DB2777', JSON.stringify([
            { id: 1, name: 'Laboratorios', type: 'numeric', weight: 35, maxScore: 100 },
            { id: 2, name: 'Informes', type: 'numeric', weight: 25, maxScore: 100 },
            { id: 3, name: 'Exámenes', type: 'numeric', weight: 40, maxScore: 100 }
        ])],
        ['Literatura Española', 'LIT301', '3', 'Mar-Jue 14:00-16:00', 'Lic. Fernando Ruiz', 'Second cycle', '#6366F1, #4F46E5', JSON.stringify([
            { id: 1, name: 'Ensayos', type: 'numeric', weight: 40, maxScore: 100 },
            { id: 2, name: 'Participación', type: 'numeric', weight: 20, maxScore: 100 },
            { id: 3, name: 'Examen Final', type: 'numeric', weight: 40, maxScore: 100 }
        ])]
    ];
    
    subjects.forEach(s => insertSubject.run(...s));
    console.log(`✅ ${subjects.length} materias creadas`);
    
    // Insertar inscripciones (3-4 materias por estudiante)
    const insertEnrollment = db.prepare(`
        INSERT INTO enrollments (studentId, studentName, subjectId, subjectName, subjectCode, teacher, color, enrollmentDate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const allStudents = db.prepare('SELECT * FROM students').all();
    const allSubjects = db.prepare('SELECT * FROM subjects').all();
    
    let enrollmentCount = 0;
    allStudents.forEach(student => {
        const numSubjects = Math.floor(Math.random() * 2) + 3; // 3 o 4
        const shuffled = [...allSubjects].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, numSubjects);
        
        selected.forEach(subject => {
            insertEnrollment.run(
                student.id,
                student.name,
                subject.id,
                subject.name,
                subject.code,
                subject.teacher,
                subject.color,
                student.enrollmentDate
            );
            enrollmentCount++;
        });
    });
    console.log(`✅ ${enrollmentCount} inscripciones creadas`);
    
    // Insertar calificaciones
    const insertGrade = db.prepare(`
        INSERT INTO grades (enrollmentId, studentId, componentId, componentName, type, name, score, maxScore, date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const allEnrollments = db.prepare('SELECT * FROM enrollments').all();
    let gradeCount = 0;
    
    allEnrollments.forEach(enrollment => {
        const subject = allSubjects.find(s => s.id === enrollment.subjectId);
        if (!subject || !subject.components) return;
        
        const components = JSON.parse(subject.components);
        components.forEach(component => {
            const numGrades = Math.floor(Math.random() * 3) + 2; // 2-4 calificaciones
            
            for (let i = 0; i < numGrades; i++) {
                const score = Math.floor(Math.random() * 30) + 70; // 70-100
                const month = Math.floor(Math.random() * 12);
                const day = Math.floor(Math.random() * 28) + 1;
                const date = new Date(2024, month, day).toISOString();
                
                insertGrade.run(
                    enrollment.id,
                    enrollment.studentId,
                    component.id,
                    component.name,
                    component.name.toLowerCase().includes('tarea') ? 'assignment' : 'exam',
                    `${component.name} ${i + 1}`,
                    score,
                    component.maxScore || 100,
                    date
                );
                gradeCount++;
            }
        });
    });
    console.log(`✅ ${gradeCount} calificaciones creadas`);
    
    console.log('🎉 Base de datos poblada exitosamente!');
}

// Ejecutar si se llama directamente
if (require.main === module) {
    populateDatabase();
}

module.exports = { populateDatabase };
