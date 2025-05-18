import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Removido o "/api" do baseURL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Token enviado:', token); // Log para depuração
    } else {
        console.log('Nenhum token encontrado no localStorage'); // Log para depuração
    }
    console.log('Enviando requisição para:', config.url); // Log adicional para depuração
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            alert('Sua sessão expirou. Por favor, faça login novamente.');
        }
        return Promise.reject(error);
    }
);

export default api;