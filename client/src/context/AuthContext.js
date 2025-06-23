import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ isAuthenticated: null, user: null });
    const navigate = useNavigate();

    const clearCookies = () => {
        document.cookie.split(';').forEach((c) => {
            document.cookie = c
                .replace(/^ +/, '')
                .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
        });
    };

    const checkAuth = async () => {
        try {
            console.log('Verificando autenticação...');
            const response = await api.get('/usuarios/check-auth', { timeout: 5000 });
            console.log('Resposta checkAuth:', response.data);
            const user = response.data.user || {};
            if (!user.nome) {
                console.warn('Usuário sem nome na resposta:', user);
            }
            setAuth({ isAuthenticated: true, user });
            console.log('Auth atualizado:', { isAuthenticated: true, user });
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error.response?.data || error.message);
            setAuth({ isAuthenticated: false, user: null });
            console.log('Auth após erro:', { isAuthenticated: false, user: null });
            if (error.response?.status === 401 && window.location.pathname !== '/login' && window.location.pathname !== '/cadastro') {
                clearCookies();
                toast.error('Sessão expirada. Faça login novamente.');
                navigate('/login', { replace: true });
            }
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email, senha) => {
        try {
            console.log('Tentando login com:', { email, senha });
            const response = await api.post('/usuarios/login', { email, senha });
            console.log('Resposta login:', response.data);
            const user = response.data.user || response.data;
            if (!user || typeof user !== 'object') {
                throw new Error('Resposta inválida do servidor');
            }
            if (!user.nome) {
                console.warn('Usuário sem nome na resposta:', user);
            }
            setAuth({ isAuthenticated: true, user });
            console.log('Auth após login:', { isAuthenticated: true, user });
            navigate('/', { replace: true });
            return user;
        } catch (error) {
            console.error('Erro ao fazer login:', error.response?.data || error.message);
            setAuth({ isAuthenticated: false, user: null });
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post('/usuarios/logout');
            setAuth({ isAuthenticated: false, user: null });
            clearCookies();
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Erro ao fazer logout:', error.response?.data || error.message);
            toast.error('Erro ao fazer logout: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};

export default AuthContext;