import { studentsAPI, subjectsAPI, enrollmentsAPI, gradesAPI, initDatabase } from '../services/tauriDatabase';

// Script para poblar la base de datos con datos de ejemplo
export async function populateDatabase() {
    try {
        console.log('🔄 Iniciando población de base de datos...');
        
        // Inicializar base de datos
        await initDatabase();
        console.log('✅ Base de datos inicializada');
        
        // Verificar si ya hay datos
        const existingStudents = await studentsAPI.getAll();
        if (existingStudents.length > 0) {
            console.log('⚠️ La base de datos ya contiene datos. Saltando población.');
            return {
                success: true,
                message: 'Base de datos ya poblada',
                data: {
                    students: existingStudents.length,
                    subjects: (await subjectsAPI.getAll()).length,
                    enrollments: (await enrollmentsAPI.getAll()).length,
                    grades: (await gradesAPI.getAll()).length
                }
            };
        }
        
        // 1. Crear Estudiantes
        console.log('📝 Creando estudiantes...');
        const students = [
            {
                name: 'Juan Pérez',
                email: 'juan.perez@email.com',
                phone: '809-555-0001',
                enrollmentDate: '2024-01-15'
            },
            {
                name: 'María González',
                email: 'maria.gonzalez@email.com',
                phone: '809-555-0002',
                enrollmentDate: '2024-01-15'
            },
            {
                name: 'Carlos Rodríguez',
                email: 'carlos.rodriguez@email.com',
                phone: '809-555-0003',
                enrollmentDate: '2024-01-20'
            },
            {
                name: 'Ana Martínez',
                email: 'ana.martinez@email.com',
                phone: '809-555-0004',
                enrollmentDate: '2024-01-20'
            },
            {
                name: 'Luis Sánchez',
                email: 'luis.sanchez@email.com',
                phone: '809-555-0005',
                enrollmentDate: '2024-02-01'
            },
            {
                name: 'Carmen López',
                email: 'carmen.lopez@email.com',
                phone: '809-555-0006',
                enrollmentDate: '2024-02-01'
            },
            {
                name: 'Pedro Ramírez',
                email: 'pedro.ramirez@email.com',
                phone: '809-555-0007',
                enrollmentDate: '2024-02-10'
            },
            {
                name: 'Laura Torres',
                email: 'laura.torres@email.com',
                phone: '809-555-0008',
                enrollmentDate: '2024-02-10'
            }
        ];
        
        const createdStudents = [];
        for (const student of students) {
            const created = await studentsAPI.create(student);
            createdStudents.push(created);
        }
        console.log(`✅ ${createdStudents.length} estudiantes creados`);
        
        // 2. Crear Materias
        console.log('📚 Creando materias...');
        const subjects = [
            {
                name: 'Matemáticas Avanzadas',
                code: 'MAT101',
                credits: '4',
                schedule: 'Lun-Mié-Vie 8:00-10:00',
                teacher: 'Dr. Roberto Fernández',
                cycle: 'First cycle',
                components: [
                    { id: 1, name: 'Tareas', type: 'numeric', weight: 30, maxScore: 100 },
                    { id: 2, name: 'Parciales', type: 'numeric', weight: 40, maxScore: 100 },
                    { id: 3, name: 'Examen Final', type: 'numeric', weight: 30, maxScore: 100 }
                ]
            },
            {
                name: 'Historia Universal',
                code: 'HIS201',
                credits: '3',
                schedule: 'Mar-Jue 10:00-12:00',
                teacher: 'Lic. Patricia Morales',
                cycle: 'First cycle',
                components: [
                    { id: 1, name: 'Investigaciones', type: 'numeric', weight: 35, maxScore: 100 },
                    { id: 2, name: 'Presentaciones', type: 'numeric', weight: 25, maxScore: 100 },
                    { id: 3, name: 'Exámenes', type: 'numeric', weight: 40, maxScore: 100 }
                ]
            },
            {
                name: 'Programación I',
                code: 'PRG101',
                credits: '4',
                schedule: 'Lun-Mié-Vie 14:00-16:00',
                teacher: 'Ing. Miguel Ángel Castro',
                cycle: 'First cycle',
                components: [
                    { id: 1, name: 'Prácticas', type: 'numeric', weight: 40, maxScore: 100 },
                    { id: 2, name: 'Proyectos', type: 'numeric', weight: 35, maxScore: 100 },
                    { id: 3, name: 'Examen Final', type: 'numeric', weight: 25, maxScore: 100 }
                ]
            },
            {
                name: 'Física General',
                code: 'FIS101',
                credits: '4',
                schedule: 'Mar-Jue 8:00-10:00',
                teacher: 'Dr. Jorge Vargas',
                cycle: 'First cycle',
                components: [
                    { id: 1, name: 'Laboratorios', type: 'numeric', weight: 30, maxScore: 100 },
                    { id: 2, name: 'Tareas', type: 'numeric', weight: 20, maxScore: 100 },
                    { id: 3, name: 'Parciales', type: 'numeric', weight: 50, maxScore: 100 }
                ]
            },
            {
                name: 'Química Orgánica',
                code: 'QUI201',
                credits: '4',
                schedule: 'Lun-Mié 16:00-18:00',
                teacher: 'Dra. Sandra Méndez',
                cycle: 'Second cycle',
                components: [
                    { id: 1, name: 'Laboratorios', type: 'numeric', weight: 35, maxScore: 100 },
                    { id: 2, name: 'Informes', type: 'numeric', weight: 25, maxScore: 100 },
                    { id: 3, name: 'Exámenes', type: 'numeric', weight: 40, maxScore: 100 }
                ]
            },
            {
                name: 'Literatura Española',
                code: 'LIT301',
                credits: '3',
                schedule: 'Mar-Jue 14:00-16:00',
                teacher: 'Lic. Fernando Ruiz',
                cycle: 'Second cycle',
                components: [
                    { id: 1, name: 'Ensayos', type: 'numeric', weight: 40, maxScore: 100 },
                    { id: 2, name: 'Participación', type: 'numeric', weight: 20, maxScore: 100 },
                    { id: 3, name: 'Examen Final', type: 'numeric', weight: 40, maxScore: 100 }
                ]
            }
        ];
        
        const createdSubjects = [];
        for (const subject of subjects) {
            const created = await subjectsAPI.create(subject);
            createdSubjects.push(created);
        }
        console.log(`✅ ${createdSubjects.length} materias creadas`);
        
        // 3. Crear Inscripciones (enrollments)
        console.log('📋 Creando inscripciones...');
        const enrollments = [];
        
        // Inscribir cada estudiante en 3-4 materias aleatorias
        for (const student of createdStudents) {
            const numSubjects = Math.floor(Math.random() * 2) + 3; // 3 o 4 materias
            const shuffled = [...createdSubjects].sort(() => 0.5 - Math.random());
            const selectedSubjects = shuffled.slice(0, numSubjects);
            
            for (const subject of selectedSubjects) {
                const enrollment = await enrollmentsAPI.create({
                    studentId: student.id,
                    studentName: student.name,
                    subjectId: subject.id,
                    subjectName: subject.name,
                    subjectCode: subject.code,
                    teacher: subject.teacher,
                    color: subject.color,
                    enrollmentDate: student.enrollmentDate
                });
                enrollments.push(enrollment);
            }
        }
        console.log(`✅ ${enrollments.length} inscripciones creadas`);
        
        // 4. Crear Calificaciones
        console.log('📊 Creando calificaciones...');
        let gradesCount = 0;
        
        for (const enrollment of enrollments) {
            // Obtener la materia para sus componentes
            const subject = createdSubjects.find(s => s.id === enrollment.subjectId);
            if (!subject || !subject.components) continue;
            
            // Crear 2-4 calificaciones por componente
            for (const component of subject.components) {
                const numGrades = Math.floor(Math.random() * 3) + 2; // 2-4 calificaciones
                
                for (let i = 0; i < numGrades; i++) {
                    const score = Math.floor(Math.random() * 30) + 70; // 70-100
                    const date = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
                    
                    await gradesAPI.create({
                        enrollmentId: enrollment.id,
                        studentId: enrollment.studentId,
                        componentId: component.id,
                        componentName: component.name,
                        type: component.name.toLowerCase().includes('tarea') ? 'assignment' : 'exam',
                        name: `${component.name} ${i + 1}`,
                        score: score,
                        maxScore: component.maxScore || 100,
                        date: date.toISOString(),
                        notes: ''
                    });
                    gradesCount++;
                }
            }
        }
        console.log(`✅ ${gradesCount} calificaciones creadas`);
        
        console.log('🎉 ¡Base de datos poblada exitosamente!');
        
        return {
            success: true,
            message: 'Base de datos poblada exitosamente',
            data: {
                students: createdStudents.length,
                subjects: createdSubjects.length,
                enrollments: enrollments.length,
                grades: gradesCount
            }
        };
        
    } catch (error) {
        console.error('❌ Error poblando base de datos:', error);
        return {
            success: false,
            message: error.message,
            error: error
        };
    }
}

// Función para limpiar la base de datos (útil para testing)
export async function clearDatabase() {
    try {
        const db = await initDatabase();
        
        await db.execute('DELETE FROM grades');
        await db.execute('DELETE FROM enrollments');
        await db.execute('DELETE FROM subjects');
        await db.execute('DELETE FROM students');
        
        console.log('✅ Base de datos limpiada');
        return { success: true, message: 'Base de datos limpiada' };
    } catch (error) {
        console.error('❌ Error limpiando base de datos:', error);
        return { success: false, message: error.message };
    }
}

export default { populateDatabase, clearDatabase };
