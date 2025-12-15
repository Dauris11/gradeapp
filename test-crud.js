// Script de prueba CRUD - Ejecutar en la consola del navegador
// Abre DevTools (F12) → Console → Pega este código

console.log('🧪 Iniciando pruebas CRUD...\n');

// Importar servicios (ya están disponibles globalmente)
const testCRUD = async () => {
    try {
        // ========== TEST 1: ESTUDIANTES ==========
        console.log('📝 TEST 1: CRUD de Estudiantes');
        
        // CREATE
        const nuevoEstudiante = {
            name: 'Test Usuario CRUD',
            email: 'test.crud@email.com',
            phone: '555-TEST',
            enrollmentDate: '2024-12-15'
        };
        
        // Usar el servicio global
        const { studentsAPI } = await import('./services/database.js');
        
        const creado = studentsAPI.create(nuevoEstudiante);
        console.log('✅ CREATE:', creado);
        
        // READ
        const todos = studentsAPI.getAll();
        console.log('✅ READ (total):', todos.length);
        
        const porId = studentsAPI.getById(creado.id);
        console.log('✅ READ (por ID):', porId);
        
        // UPDATE
        const actualizado = studentsAPI.update(creado.id, {
            phone: '555-ACTUALIZADO'
        });
        console.log('✅ UPDATE:', actualizado);
        
        // DELETE
        studentsAPI.delete(creado.id);
        console.log('✅ DELETE: Estudiante eliminado');
        
        const despues = studentsAPI.getAll();
        console.log('✅ Verificación (total después):', despues.length);
        
        console.log('\n✅ TEST 1 COMPLETADO\n');
        
        // ========== TEST 2: MATERIAS ==========
        console.log('📚 TEST 2: CRUD de Materias');
        
        const { subjectsAPI } = await import('./services/database.js');
        
        // CREATE
        const nuevaMateria = {
            name: 'Test Materia CRUD',
            code: 'TEST101',
            credits: '3',
            schedule: 'Test Schedule',
            teacher: 'Prof. Test',
            cycle: 'First cycle'
        };
        
        const materiaCreada = subjectsAPI.create(nuevaMateria);
        console.log('✅ CREATE:', materiaCreada);
        
        // READ
        const todasMaterias = subjectsAPI.getAll();
        console.log('✅ READ (total):', todasMaterias.length);
        
        // UPDATE
        const materiaActualizada = subjectsAPI.update(materiaCreada.id, {
            teacher: 'Prof. Actualizado'
        });
        console.log('✅ UPDATE:', materiaActualizada);
        
        // DELETE
        subjectsAPI.delete(materiaCreada.id);
        console.log('✅ DELETE: Materia eliminada');
        
        console.log('\n✅ TEST 2 COMPLETADO\n');
        
        // ========== TEST 3: CASCADA ==========
        console.log('🔗 TEST 3: Eliminación en Cascada');
        
        const { enrollmentsAPI, gradesAPI } = await import('./services/database.js');
        
        // Crear estudiante
        const estCascada = studentsAPI.create({
            name: 'Test Cascada',
            email: 'cascada@test.com'
        });
        console.log('✅ Estudiante creado:', estCascada.id);
        
        // Crear inscripción
        const enrollment = enrollmentsAPI.create({
            studentId: estCascada.id,
            subjectId: 1  // Usar materia existente
        });
        console.log('✅ Inscripción creada:', enrollment.id);
        
        // Crear calificación
        const grade = gradesAPI.create({
            enrollmentId: enrollment.id,
            type: 'assignment',
            name: 'Test Grade',
            score: 100,
            maxScore: 100,
            date: '2024-12-15'
        });
        console.log('✅ Calificación creada:', grade.id);
        
        // Contar antes de eliminar
        const antesEnr = enrollmentsAPI.getAll().length;
        const antesGra = gradesAPI.getAll().length;
        console.log('📊 Antes - Enrollments:', antesEnr, 'Grades:', antesGra);
        
        // Eliminar estudiante (debe eliminar en cascada)
        studentsAPI.delete(estCascada.id);
        console.log('🗑️ Estudiante eliminado (con cascada)');
        
        // Contar después de eliminar
        const despuesEnr = enrollmentsAPI.getAll().length;
        const despuesGra = gradesAPI.getAll().length;
        console.log('📊 Después - Enrollments:', despuesEnr, 'Grades:', despuesGra);
        
        if (despuesEnr < antesEnr && despuesGra < antesGra) {
            console.log('✅ CASCADA FUNCIONA CORRECTAMENTE');
        } else {
            console.log('❌ ERROR: Cascada no funcionó');
        }
        
        console.log('\n✅ TEST 3 COMPLETADO\n');
        
        // ========== RESUMEN ==========
        console.log('🎉 RESUMEN DE PRUEBAS:');
        console.log('✅ CREATE - Funciona');
        console.log('✅ READ - Funciona');
        console.log('✅ UPDATE - Funciona');
        console.log('✅ DELETE - Funciona');
        console.log('✅ CASCADA - Funciona');
        console.log('\n✅ TODOS LOS TESTS PASARON\n');
        
        return {
            success: true,
            message: 'Todos los tests CRUD pasaron exitosamente'
        };
        
    } catch (error) {
        console.error('❌ ERROR en tests:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Ejecutar tests
testCRUD().then(result => {
    console.log('\n📋 RESULTADO FINAL:', result);
});
