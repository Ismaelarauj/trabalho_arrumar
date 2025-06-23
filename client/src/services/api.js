import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api/',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        console.log('Requisição enviada:', config.url);
        return config;
    },
    (error) => {
        console.error('Erro na requisição:', error.message);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log('Resposta recebida:', response.config.url, response.status);
        return response;
    },
    (error) => {
        console.error('Erro na resposta:', error.response?.status, error.response?.data);
        const publicRoutes = ['/usuarios/login', '/usuarios'];
        const isPublicPost = publicRoutes.includes(error.config?.url) && error.config?.method.toUpperCase() === 'POST';
        if (error.response && error.response.status === 401 && !isPublicPost) {
            console.log('Disparando authError para:', error.config?.url);
            window.dispatchEvent(new Event('authError'));
        }
        return Promise.reject(error);
    }
);

export default api;