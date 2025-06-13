import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';

const LoginController = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();
    const { auth, login } = useContext(AuthContext);

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            toast.error('Por favor, insira um email válido.');
            return;
        }
        if (!senha) {
            toast.error('A senha é obrigatória.');
            return;
        }

        try {
            const user = await login(email, senha);
            toast.success('Login realizado com sucesso!');
            await new Promise((resolve) => setTimeout(resolve, 100));
            const redirectPath = user.tipo === 'admin' ? '/premios' :
                user.tipo === 'autor' ? '/projetos/enviar' :
                    user.tipo === 'avaliador' ? '/projetos/avaliar' : '/';
            console.log('Redirecionando para:', redirectPath, 'com user:', user);
            navigate(redirectPath, { replace: true });
        } catch (error) {
            console.error('Erro ao fazer login:', error.response?.data || error.message);
            toast.error('Erro ao fazer login: ' + (error.response?.data?.error || error.message));
        }
    };

    // Resetar campos após navegação (opcional)
    useEffect(() => {
        if (auth.isAuthenticated) {
            setEmail('');
            setSenha('');
        }
    }, [auth.isAuthenticated]);

    return { email, senha, setEmail, setSenha, handleLogin };
};

export default LoginController;