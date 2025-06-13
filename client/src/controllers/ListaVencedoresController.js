import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../services/api.js';
import { toast } from 'react-toastify';

const ListaVencedoresController = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);

    const [vencedores, setVencedores] = useState([]);

    useEffect(() => {
        if (auth.isAuthenticated === null) return;
        if (!auth.isAuthenticated) {
            navigate('/login', { replace: true });
            return;
        }
        fetchVencedores();
    }, [auth.isAuthenticated, navigate]);

    const fetchVencedores = async () => {
        try {
            const response = await api.get('/vencedores');
            console.log('Dados dos vencedores:', JSON.stringify(response.data, null, 2));
            setVencedores(response.data);
        } catch (error) {
            console.error('Erro ao buscar vencedores:', error);
            toast.error('Erro ao buscar vencedores: ' + (error.response?.data?.error || 'Tente novamente mais tarde'));
        }
    };

    return { vencedores };
};

export default ListaVencedoresController;