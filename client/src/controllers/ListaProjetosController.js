import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../services/api.js';
import { toast } from 'react-toastify';

const ListaProjetosController = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const user = auth.user;
    const userId = user?.id;
    const role = user?.tipo;

    const [projetos, setProjetos] = useState([]);

    useEffect(() => {
        if (auth.isAuthenticated === null) return;
        if (!auth.isAuthenticated) {
            navigate('/login', { replace: true });
            return;
        }
        fetchProjetos();
    }, [auth.isAuthenticated, navigate]);

    const fetchProjetos = async () => {
        try {
            let endpoint = '/projetos';
            if (window.location.pathname === '/my-projects' && role === 'autor') {
                endpoint = '/projetos/my';
            } else if (window.location.pathname === '/projetos/avaliados' && role === 'avaliador') {
                endpoint = '/projetos/avaliados';
            }
            const response = await api.get(endpoint);
            setProjetos(response.data);
        } catch (error) {
            console.error('Erro ao buscar projetos:', error);
            toast.error('Erro ao carregar projetos: ' + (error.response?.data?.error || 'Tente novamente mais tarde'));
        }
    };

    const handleEdit = async (projectId, updatedData) => {
        try {
            await api.put(`/projetos/${projectId}`, updatedData);
            fetchProjetos();
            toast.success('Projeto atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao editar projeto:', error);
            toast.error('Erro ao editar projeto: ' + (error.response?.data?.error || 'Tente novamente'));
            throw error;
        }
    };

    const handleDelete = async (projectId) => {
        try {
            await api.delete(`/projetos/${projectId}`);
            fetchProjetos();
            toast.success('Projeto excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir projeto:', error);
            toast.error('Erro ao excluir projeto: ' + (error.response?.data?.error || 'Tente novamente'));
            throw error;
        }
    };

    return { projetos, userId, role, handleEdit, handleDelete };
};

export default ListaProjetosController;