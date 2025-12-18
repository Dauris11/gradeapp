// API de usuarios
const API_URL = 'http://localhost:3001/api';

export const usersAPI = {
    // Obtener todos los usuarios
    getAll: async () => {
        const response = await fetch(`${API_URL}/users`);
        return await response.json();
    },

    // Obtener un usuario por ID
    getById: async (id) => {
        const response = await fetch(`${API_URL}/users/${id}`);
        return await response.json();
    },

    // Crear nuevo usuario
    create: async (userData) => {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return await response.json();
    },

    // Actualizar usuario
    update: async (id, userData) => {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return await response.json();
    },

    // Eliminar usuario
    delete: async (id) => {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    },

    // Cambiar contraseña
    changePassword: async (id, currentPassword, newPassword) => {
        const response = await fetch(`${API_URL}/users/${id}/change-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPassword, newPassword })
        });
        return await response.json();
    },

    // Solicitar recuperación de contraseña
    requestPasswordReset: async (email) => {
        const response = await fetch(`${API_URL}/auth/request-reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        return await response.json();
    },

    // Verificar token de recuperación
    verifyResetToken: async (token) => {
        const response = await fetch(`${API_URL}/auth/verify-reset-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        });
        return await response.json();
    },

    // Restablecer contraseña con token
    resetPasswordWithToken: async (token, newPassword) => {
        const response = await fetch(`${API_URL}/auth/reset-password-with-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, newPassword })
        });
        return await response.json();
    }
};

export default usersAPI;
