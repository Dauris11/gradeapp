// Servicio de base de datos - Conecta con Backend REST API
import * as apiService from './apiService';

console.log('🗄️ Usando Backend REST API (SQLite)');

export const initDatabase = apiService.initDatabase;
export const usersAPI = apiService.usersAPI;
export const studentsAPI = apiService.studentsAPI;
export const subjectsAPI = apiService.subjectsAPI;
export const enrollmentsAPI = apiService.enrollmentsAPI;
export const gradesAPI = apiService.gradesAPI;

export default {
    initDatabase,
    usersAPI,
    studentsAPI,
    subjectsAPI,
    enrollmentsAPI,
    gradesAPI
};
