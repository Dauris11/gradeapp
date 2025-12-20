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

// Función de inicialización (ya no necesaria, pero la dejamos por compatibilidad)
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
    initDatabase
};
