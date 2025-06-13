import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../services/api.js';
import { toast } from 'react-toastify';

const EnvioProjetoController = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const user = auth.user;
    const autorId = user?.id;
    const isAutor = user?.tipo === 'autor';

    const [formData, setFormData] = useState({
        premioId: '',
        autorId: autorId || '',
        titulo: '',
        resumo: '',
        areaTematica: '',
        dataEnvio: new Date().toISOString().split('T')[0],
        coautores: []
    });
    const [errors, setErrors] = useState({});
    const [premios, setPremios] = useState([]);
    const [autores, setAutores] = useState([]);

    useEffect(() => {
        // Aguarda a verificação de autenticação
        if (auth.isAuthenticated === null) return;

        // Se não estiver autenticado, deixa o ProtectedRoute lidar com o redirecionamento
        if (!auth.isAuthenticated) {
            return;
        }

        // Se não for autor, deixa o ProtectedRoute lidar com o redirecionamento
        if (!isAutor || !autorId) {
            return;
        }

        fetchPremios();
        fetchAutores();
    }, [auth.isAuthenticated, isAutor, autorId, navigate]);

    const fetchPremios = async () => {
        try {
            const response = await api.get('/premios');
            setPremios(response.data);
        } catch (error) {
            console.error('Erro ao buscar prêmios:', error);
            toast.error('Erro ao buscar prêmios');
        }
    };

    const fetchAutores = async () => {
        try {
            const response = await api.get('/usuarios');
            setAutores(response.data.filter(usuario => usuario.tipo === 'autor' && usuario.id !== autorId));
        } catch (error) {
            console.error('Erro ao buscar autores:', error);
            toast.error('Erro ao buscar autores');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const handleCoautoresChange = (e) => {
        setFormData({ ...formData, coautores: e.target.value });
        setErrors({ ...errors, coautores: '' });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.premioId) newErrors.premioId = 'O prêmio é obrigatório';
        if (!formData.titulo.trim()) newErrors.titulo = 'O título é obrigatório';
        if (!formData.resumo.trim()) newErrors.resumo = 'O resumo é obrigatório';
        if (!formData.areaTematica.trim()) newErrors.areaTematica = 'A área temática é obrigatória';
        if (!formData.dataEnvio || isNaN(new Date(formData.dataEnvio).getTime())) {
            newErrors.dataEnvio = 'A data de envio é inválida';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAutor || !autorId) {
            toast.error('Você precisa estar autenticado como autor para enviar um projeto.');
            return;
        }
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await api.post('/projetos/enviar', formData);
            toast.success('Projeto enviado com sucesso!');
            setFormData({
                premioId: '',
                autorId: autorId || '',
                titulo: '',
                resumo: '',
                areaTematica: '',
                dataEnvio: new Date().toISOString().split('T')[0],
                coautores: []
            });
            setErrors({});
        } catch (error) {
            console.error('Erro ao enviar projeto:', error.response?.data || error.message);
            if (error.response && error.response.data.errors) {
                const serverErrors = error.response.data.errors.reduce((acc, err) => {
                    acc[err.field] = err.message;
                    return acc;
                }, {});
                setErrors(serverErrors);
            } else {
                toast.error('Erro ao enviar projeto: ' + (error.response?.data.error || error.message));
            }
        }
    };

    return {
        formData,
        errors,
        premios,
        autores,
        isAutor,
        handleChange,
        handleCoautoresChange,
        handleSubmit
    };
};

export default EnvioProjetoController;