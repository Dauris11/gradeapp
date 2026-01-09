// Servicio de base de datos - Conecta con Backend REST API
import * as apiService from './apiService';

console.log('🗄️ Usando Backend REST API (SQLite)');

export const initDatabase = apiService.initDatabase;
export const usersAPI = apiService.usersAPI;
export const studentsAPI = apiService.studentsAPI;
export const subjectsAPI = apiService.subjectsAPI;
export const enrollmentsAPI = apiService.enrollmentsAPI;
export const gradesAPI = apiService.gradesAPI;
export const calendarAPI = apiService.calendarAPI;
export const notificationsAPI = apiService.notificationsAPI;
export const academicAPI = apiService.academicAPI;
export const attendanceAPI = apiService.attendanceAPI;
export const analyticsAPI = apiService.analyticsAPI;
export const settingsAPI = apiService.settingsAPI;
export const portalAPI = apiService.portalAPI;

export default {
    initDatabase,
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
    portalAPI
};
