import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../services/api.js';
import { toast } from 'react-toastify';

const AvaliacaoProjetoController = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const user = auth.user;
    const isAvaliador = user?.tipo?.toLowerCase() === 'avaliador';

    const [formData, setFormData] = useState({
        projetoId: '',
        avaliadorId: user?.id || '',
        parecer: '',
        nota: '',
        dataAvaliacao: new Date().toISOString().split('T')[0]
    });
    const [projetos, setProjetos] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (auth.isAuthenticated === null) return; // Aguarda a verificação inicial
        if (!auth.isAuthenticated && !isAvaliador) {
            if (window.location.pathname !== '/login') {
                toast.error('Você precisa estar autenticado como avaliador para acessar esta página.');
                navigate('/login', { replace: true });
            }
            return;
        }
        fetchProjetos();
    }, [auth.isAuthenticated, isAvaliador, navigate]);

    const fetchProjetos = async () => {
        try {
            const response = await api.get('/projetos/pendentes');
            setProjetos(response.data);
            if (response.data.length === 0) {
                toast.info('Nenhum projeto pendente disponível para avaliação.');
            }
        } catch (error) {
            console.error('Erro ao buscar projetos:', error);
            toast.error('Erro ao buscar projetos pendentes: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.projetoId) newErrors.projetoId = 'Selecione um projeto para avaliar';
        if (!formData.parecer.trim()) newErrors.parecer = 'O parecer é obrigatório';
        if (!formData.nota || formData.nota < 0 || formData.nota > 10) {
            newErrors.nota = 'A nota deve estar entre 0 e 10';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAvaliador) {
            toast.error('Você precisa estar autenticado como avaliador para enviar uma avaliação.');
            return;
        }

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const dataToSend = {
                projetoId: parseInt(formData.projetoId),
                avaliadorId: parseInt(formData.avaliadorId),
                parecer: formData.parecer,
                nota: parseFloat(formData.nota),
                dataAvaliacao: formData.dataAvaliacao
            };

            await api.post('/avaliacoes', dataToSend);
            toast.success('Avaliação enviada com sucesso!');
            setFormData({
                projetoId: '',
                avaliadorId: user?.id || '',
                parecer: '',
                nota: '',
                dataAvaliacao: new Date().toISOString().split('T')[0]
            });
            setErrors({});
            fetchProjetos();
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message;
            toast.error('Erro ao enviar avaliação: ' + errorMessage);
        }
    };

    return { formData, projetos, errors, isAvaliador, handleChange, handleSubmit };
};

export default AvaliacaoProjetoController;