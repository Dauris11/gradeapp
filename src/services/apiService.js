// Servicio API que conecta con el backend REST
const API_URL = 'http://127.0.0.1:3001/api';

// ==================== USUARIOS ====================
export const usersAPI = {
    getAll: async () => {
        try {
            const response = await fetch(`${API_URL}/users`);
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error en usersAPI.getAll:', error);
            return [];
        }
    },
    
    create: async (user) => {
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
            return response.json();
        } catch (error) {
            console.error('Error en usersAPI.create:', error);
            throw error;
        }
    },
    
    login: async (username, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en usersAPI.login:', error);
            return { success: false, message: 'Error al conectar con el servidor' };
        }
    }
};


// ==================== ESTUDIANTES ====================
export const studentsAPI = {
    getAll: async () => {
        try {
            const response = await fetch(`${API_URL}/students`);
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error en studentsAPI.getAll:', error);
            return [];
        }
    },
    
    getById: async (id) => {
        try {
            const response = await fetch(`${API_URL}/students/${id}`);
            return response.json();
        } catch (error) {
            console.error('Error en studentsAPI.getById:', error);
            return null;
        }
    },
    
    create: async (student) => {
        try {
            const response = await fetch(`${API_URL}/students`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(student)
            });
            return response.json();
        } catch (error) {
            console.error('Error en studentsAPI.create:', error);
            throw error;
        }
    },
    
    update: async (id, updates) => {
        try {
            const response = await fetch(`${API_URL}/students/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            return response.json();
        } catch (error) {
            console.error('Error en studentsAPI.update:', error);
            throw error;
        }
    },
    
    delete: async (id) => {
        try {
            const response = await fetch(`${API_URL}/students/${id}`, {
                method: 'DELETE'
            });
            return response.json();
        } catch (error) {
            console.error('Error en studentsAPI.delete:', error);
            throw error;
        }
    },
    
    importStudents: async (students) => {
        try {
            const response = await fetch(`${API_URL}/students/import`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ students })
            });
            return response.json();
        } catch (error) {
            console.error('Error en studentsAPI.importStudents:', error);
            throw error;
        }
    }
};

// ==================== MATERIAS ====================
export const subjectsAPI = {
    getAll: async () => {
        try {
            const response = await fetch(`${API_URL}/subjects`);
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error en subjectsAPI.getAll:', error);
            return [];
        }
    },
    
    create: async (subject) => {
        try {
            const response = await fetch(`${API_URL}/subjects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subject)
            });
            return response.json();
        } catch (error) {
            console.error('Error en subjectsAPI.create:', error);
            throw error;
        }
    },
    
    update: async (id, updates) => {
        try {
            const response = await fetch(`${API_URL}/subjects/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            return response.json();
        } catch (error) {
            console.error('Error en subjectsAPI.update:', error);
            throw error;
        }
    },
    
    delete: async (id) => {
        try {
            const response = await fetch(`${API_URL}/subjects/${id}`, {
                method: 'DELETE'
            });
            return response.json();
        } catch (error) {
            console.error('Error en subjectsAPI.delete:', error);
            throw error;
        }
    }
};

// ==================== INSCRIPCIONES ====================
export const enrollmentsAPI = {
    getAll: async () => {
        try {
            const response = await fetch(`${API_URL}/enrollments`);
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error en enrollmentsAPI.getAll:', error);
            return [];
        }
    },
    
    getByStudent: async (studentId) => {
        try {
            const all = await enrollmentsAPI.getAll();
            return all.filter(e => e.studentId === studentId);
        } catch (error) {
            console.error('Error en enrollmentsAPI.getByStudent:', error);
            return [];
        }
    },
    
    getBySubject: async (subjectId) => {
        try {
            const all = await enrollmentsAPI.getAll();
            return all.filter(e => e.subjectId === subjectId);
        } catch (error) {
            console.error('Error en enrollmentsAPI.getBySubject:', error);
            return [];
        }
    },
    
    create: async (enrollment) => {
        try {
            const response = await fetch(`${API_URL}/enrollments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(enrollment)
            });
            return response.json();
        } catch (error) {
            console.error('Error en enrollmentsAPI.create:', error);
            throw error;
        }
    },
    
    delete: async (id) => {
        try {
            const response = await fetch(`${API_URL}/enrollments/${id}`, {
                method: 'DELETE'
            });
            return response.json();
        } catch (error) {
            console.error('Error en enrollmentsAPI.delete:', error);
            throw error;
        }
    }
};

// ==================== CALIFICACIONES ====================
export const gradesAPI = {
    getAll: async () => {
        try {
            const response = await fetch(`${API_URL}/grades`);
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error en gradesAPI.getAll:', error);
            return [];
        }
    },
    
    getByEnrollment: async (enrollmentId) => {
        try {
            const response = await fetch(`${API_URL}/grades/enrollment/${enrollmentId}`);
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error en gradesAPI.getByEnrollment:', error);
            return [];
        }
    },
    
    getByStudent: async (studentId) => {
        try {
            const all = await gradesAPI.getAll();
            return all.filter(g => g.studentId === studentId);
        } catch (error) {
            console.error('Error en gradesAPI.getByStudent:', error);
            return [];
        }
    },
    
    create: async (grade) => {
        try {
            const response = await fetch(`${API_URL}/grades`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(grade)
            });
            return response.json();
        } catch (error) {
            console.error('Error en gradesAPI.create:', error);
            throw error;
        }
    },
    
    update: async (id, updates) => {
        try {
            const response = await fetch(`${API_URL}/grades/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            return response.json();
        } catch (error) {
            console.error('Error en gradesAPI.update:', error);
            throw error;
        }
    },
    
    delete: async (id) => {
        try {
            const response = await fetch(`${API_URL}/grades/${id}`, {
                method: 'DELETE'
            });
            return response.json();
        } catch (error) {
            console.error('Error en gradesAPI.delete:', error);
            throw error;
        }
    },

    // Calculate accumulated grade for an enrollment
    calculateAccumulated: async (enrollmentId) => {
        try {
            const grades = await gradesAPI.getByEnrollment(enrollmentId);
            if (!Array.isArray(grades) || grades.length === 0) return null;
            
            const assignments = grades.filter(g => g.type === 'assignment');
            const exams = grades.filter(g => g.type === 'exam');
            
            const assignmentAvg = assignments.length > 0
                ? assignments.reduce((sum, g) => sum + g.score, 0) / assignments.length
                : 0;
            
            const examAvg = exams.length > 0
                ? exams.reduce((sum, g) => sum + g.score, 0) / exams.length
                : 0;
            
            // 40% assignments, 60% exams (Default institutional weights)
            const accumulated = (assignmentAvg * 0.4) + (examAvg * 0.6);
            
            return {
                assignmentAvg: Math.round(assignmentAvg * 10) / 10,
                examAvg: Math.round(examAvg * 10) / 10,
                accumulated: Math.round(accumulated * 10) / 10,
                totalAssignments: assignments.length,
                totalExams: exams.length
            };
        } catch (error) {
            console.error('Error calculating accumulated:', error);
            return null;
        }
    }
};

// ==================== CALENDARIO ====================
export const calendarAPI = {
    getAllEvents: async (filters = {}) => {
        try {
            const params = new URLSearchParams(filters).toString();
            const response = await fetch(`${API_URL}/calendar/events?${params}`);
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error en calendarAPI.getAllEvents:', error);
            return [];
        }
    },

    getTodayEvents: async () => {
        try {
            const response = await fetch(`${API_URL}/calendar/events/today`);
            return response.json();
        } catch (error) {
            console.error('Error en calendarAPI.getTodayEvents:', error);
            return [];
        }
    },

    createEvent: async (event) => {
        try {
            const response = await fetch(`${API_URL}/calendar/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event)
            });
            return response.json();
        } catch (error) {
            console.error('Error en calendarAPI.createEvent:', error);
            throw error;
        }
    },

    updateEvent: async (id, updates) => {
        try {
            const response = await fetch(`${API_URL}/calendar/events/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            return response.json();
        } catch (error) {
            console.error('Error en calendarAPI.updateEvent:', error);
            throw error;
        }
    },

    deleteEvent: async (id) => {
        try {
            const response = await fetch(`${API_URL}/calendar/events/${id}`, {
                method: 'DELETE'
            });
            return response.json();
        } catch (error) {
            console.error('Error en calendarAPI.deleteEvent:', error);
            throw error;
        }
    }
};

// ==================== NOTIFICACIONES ====================
export const notificationsAPI = {
    getByUser: async (userId) => {
        try {
            const response = await fetch(`${API_URL}/calendar/notifications/${userId}`);
            return response.json();
        } catch (error) {
            console.error('Error en notificationsAPI.getByUser:', error);
            return [];
        }
    },

    markAsRead: async (id) => {
        try {
            const response = await fetch(`${API_URL}/calendar/notifications/${id}/read`, {
                method: 'PUT'
            });
            return response.json();
        } catch (error) {
            console.error('Error en notificationsAPI.markAsRead:', error);
            throw error;
        }
    }
};

// ==================== PERÍODOS ACADÉMICOS Y HISTORIAL ====================
export const academicAPI = {
    getAllPeriods: async () => {
        try {
            const response = await fetch(`${API_URL}/academic/periods`);
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error en academicAPI.getAllPeriods:', error);
            return [];
        }
    },

    getActivePeriod: async () => {
        try {
            const response = await fetch(`${API_URL}/academic/periods/active`);
            return response.json();
        } catch (error) {
            console.error('Error en academicAPI.getActivePeriod:', error);
            return null;
        }
    },

    getStudentHistory: async (studentId) => {
        try {
            const response = await fetch(`${API_URL}/academic/students/${studentId}/history`);
            return response.json();
        } catch (error) {
            console.error('Error en academicAPI.getStudentHistory:', error);
            return [];
        }
    },

    getPeriodStudents: async (periodId) => {
        try {
            const response = await fetch(`${API_URL}/academic/periods/${periodId}/students`);
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error en academicAPI.getPeriodStudents:', error);
            return [];
        }
    },

    getPeriodStats: async (periodId) => {
        try {
            const response = await fetch(`${API_URL}/academic/periods/${periodId}/stats`);
            return response.json();
        } catch (error) {
            console.error('Error en academicAPI.getPeriodStats:', error);
            return null;
        }
    },

    activatePeriod: async (periodId) => {
        try {
            const response = await fetch(`${API_URL}/academic/periods/${periodId}/activate`, {
                method: 'POST'
            });
            return response.json();
        } catch (error) {
            console.error('Error en academicAPI.activatePeriod:', error);
            throw error;
        }
    },

    createPeriod: async (period) => {
        try {
            const response = await fetch(`${API_URL}/academic/periods`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(period)
            });
            return response.json();
        } catch (error) {
            console.error('Error en academicAPI.createPeriod:', error);
            throw error;
        }
    },

    getAllTimeStudents: async () => {
        try {
            const response = await fetch(`${API_URL}/academic/students/all-time`);
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error en academicAPI.getAllTimeStudents:', error);
            return [];
        }
    }
};

// ==================== ASISTENCIA ====================
export const attendanceAPI = {
    getBySubjectAndDate: async (subjectId, date) => {
        try {
            const response = await fetch(`${API_URL}/attendance/subject/${subjectId}?date=${date}`);
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error en attendanceAPI.getBySubjectAndDate:', error);
            return [];
        }
    },

    saveBulk: async (attendanceRecords) => {
        try {
            const response = await fetch(`${API_URL}/attendance/bulk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ attendanceRecords })
            });
            return response.json();
        } catch (error) {
            console.error('Error en attendanceAPI.saveBulk:', error);
            throw error;
        }
    },

    getStudentStats: async (studentId, subjectId) => {
        try {
            const response = await fetch(`${API_URL}/attendance/student/${studentId}/subject/${subjectId}/stats`);
            return response.json();
        } catch (error) {
            console.error('Error en attendanceAPI.getStudentStats:', error);
            return [];
        }
    },

    getDetailedReport: async (subjectId, startDate, endDate) => {
        try {
            const response = await fetch(`${API_URL}/attendance/report/subject/${subjectId}?startDate=${startDate}&endDate=${endDate}`);
            return response.json();
        } catch (error) {
            console.error('Error en attendanceAPI.getDetailedReport:', error);
            return null;
        }
    }
};

// ==================== ANALÍTICA ====================
export const analyticsAPI = {
    getGradesDistribution: async () => {
        try {
            const response = await fetch(`${API_URL}/analytics/grades-distribution`);
            return response.json();
        } catch (error) {
            console.error('Error en analyticsAPI.getGradesDistribution:', error);
            return [];
        }
    },

    getSubjectPerformance: async () => {
        try {
            const response = await fetch(`${API_URL}/analytics/subject-performance`);
            return response.json();
        } catch (error) {
            console.error('Error en analyticsAPI.getSubjectPerformance:', error);
            return [];
        }
    },

    getAttendanceSummary: async () => {
        try {
            const response = await fetch(`${API_URL}/analytics/attendance-summary`);
            return response.json();
        } catch (error) {
            console.error('Error en analyticsAPI.getAttendanceSummary:', error);
            return [];
        }
    }
};

// Función de inicialización (ya no necesaria, pero la dejamos por compatibilidad)
// ==================== CONFIGURACIONES ====================
export const settingsAPI = {
    getAll: async () => {
        try {
            const response = await fetch(`${API_URL}/settings`);
            return response.json();
        } catch (error) {
            console.error('Error en settingsAPI.getAll:', error);
            return {};
        }
    },
    update: async (key, value) => {
        try {
            const response = await fetch(`${API_URL}/settings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value })
            });
            return response.json();
        } catch (error) {
            console.error('Error en settingsAPI.update:', error);
            return { success: false };
        }
    },
    updateBulk: async (settings) => {
        try {
            const response = await fetch(`${API_URL}/settings/bulk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings })
            });
            return response.json();
        } catch (error) {
            console.error('Error en settingsAPI.updateBulk:', error);
            return { success: false };
        }
    }
};

// ==================== PORTAL ESTUDIANTE ====================
export const portalAPI = {
    getStudentData: async (studentId) => {
        try {
            const response = await fetch(`${API_URL}/portal/student/${studentId}`);
            return response.json();
        } catch (error) {
            console.error('Error en portalAPI.getStudentData:', error);
            return null;
        }
    }
};

export const initDatabase = async () => {
    console.log('✅ Conectado al backend REST en', API_URL);
    return Promise.resolve();
};

export default {
    usersAPI,
    studentsAPI,
    subjectsAPI,
    enrollmentsAPI,
    gradesAPI,
    calendarAPI,
    notificationsAPI,
    academicAPI,
    attendanceAPI,
    analyticsAPI,
    settingsAPI,
    portalAPI,
    initDatabase
};
