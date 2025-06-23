// src/controllers/EnvioProjetoController.js
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
        if (auth.isAuthenticated === null) return;
        if (!auth.isAuthenticated || !isAutor || !autorId) {
            return;
        }

        fetchPremios()
            .then(() => toast.success("Prêmios carregados com sucesso!"))
            .catch(() => toast.error("Erro ao buscar prêmios"));
        fetchAutores()
            .then(() => toast.success("Autores carregados com sucesso!"))
            .catch(() => toast.error("Erro ao buscar autores"));
    }, [auth.isAuthenticated, isAutor, autorId, navigate]);

    const fetchPremios = async () => {
        try {
            const response = await api.get('/premios');
            console.log('Resposta do endpoint /premios:', JSON.stringify(response.data, null, 2));
            const { createdByUser, createdByOthers } = response.data;
            if (!Array.isArray(createdByUser) || !Array.isArray(createdByOthers)) {
                throw new Error('Formato de dados inválido: createdByUser ou createdByOthers não são arrays');
            }
            const allPremios = [...createdByUser, ...createdByOthers];
            console.log('Prêmios combinados:', JSON.stringify(allPremios, null, 2));
            setPremios(allPremios);
        } catch (error) {
            console.error('Erro ao buscar prêmios:', error.message);
            toast.error('Erro ao buscar prêmios: ' + error.message);
            setPremios([]);
        }
    };

    const fetchAutores = async () => {
        try {
            const response = await api.get('/usuarios');
            const autoresFiltrados = response.data.filter(
                usuario => usuario.tipo === 'autor' && usuario.id !== autorId
            );
            console.log('Autores filtrados:', JSON.stringify(autoresFiltrados, null, 2));
            setAutores(autoresFiltrados);
        } catch (error) {
            console.error('Erro ao buscar autores:', error);
            toast.error('Erro ao buscar autores');
            setAutores([]);
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
            console.log('Enviando projeto:', JSON.stringify(formData, null, 2));
            const response = await api.post('/projetos/enviar', formData);
            console.log('Resposta do envio:', JSON.stringify(response.data, null, 2));
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
            navigate('/my-projects');
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