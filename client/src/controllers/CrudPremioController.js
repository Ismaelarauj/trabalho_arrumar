import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../services/api.js';
import { toast } from 'react-toastify';

const CrudPremioController = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const user = auth.user;
    const isAdmin = user?.tipo === 'admin';

    const [premios, setPremios] = useState({ createdByUser: [], createdByOthers: [] });
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        ano: '',
        cronogramas: [{ dataInicio: '', etapa: '', dataFim: '' }]
    });

    useEffect(() => {
        if (auth.isAuthenticated === null) return;
        if (!auth.isAuthenticated) {
            setPremios({ createdByUser: [], createdByOthers: [] });
            setError('Você precisa estar autenticado para visualizar prêmios.');
            navigate('/login', { replace: true });
            return;
        }
        fetchPremios();
    }, [auth.isAuthenticated, navigate]);

    const fetchPremios = async () => {
        try {
            const response = await api.get('/premios');
            if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
                setPremios(response.data); // Espera { createdByUser: [], createdByOthers: [] }
                setError(null);
            } else {
                setPremios({ createdByUser: [], createdByOthers: [] });
                setError('Resposta do servidor inválida.');
            }
        } catch (error) {
            console.error('Erro ao buscar prêmios:', error);
            const errorMessage = error.response?.data?.error || error.message;
            if (errorMessage === 'Não autenticado') {
                setPremios({ createdByUser: [], createdByOthers: [] });
                setError('Você precisa estar autenticado para visualizar prêmios.');
                navigate('/login', { replace: true });
            } else {
                setError('Erro ao carregar prêmios: ' + errorMessage);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const handleOpen = (premio = null) => {
        if (!isAdmin) return;
        if (premio) {
            setEditId(premio.id);
            setFormData({
                nome: premio.nome,
                descricao: premio.descricao,
                ano: premio.ano.toString(),
                cronogramas: premio.cronogramas?.length > 0
                    ? premio.cronogramas.map(c => ({
                        dataInicio: formatDate(c.dataInicio),
                        etapa: c.etapa,
                        dataFim: formatDate(c.dataFim)
                    }))
                    : [{ dataInicio: '', etapa: '', dataFim: '' }]
            });
        } else {
            setEditId(null);
            setFormData({
                nome: '',
                descricao: '',
                ano: '',
                cronogramas: [{ dataInicio: '', etapa: '', dataFim: '' }]
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e, index = null, field = null) => {
        if (index !== null && field) {
            const newCronogramas = [...formData.cronogramas];
            newCronogramas[index] = { ...newCronogramas[index], [field]: e.target.value };
            setFormData({ ...formData, cronogramas: newCronogramas });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const addCronograma = () => {
        setFormData({
            ...formData,
            cronogramas: [...formData.cronogramas, { dataInicio: '', etapa: '', dataFim: '' }]
        });
    };

    const removeCronograma = (index) => {
        const newCronogramas = formData.cronogramas.filter((_, i) => i !== index);
        setFormData({ ...formData, cronogramas: newCronogramas });
    };

    const validateCronograma = (cronograma) => {
        if (!cronograma.etapa || !cronograma.dataInicio || !cronograma.dataFim) {
            return 'Todos os campos do cronograma são obrigatórios';
        }
        const startDate = new Date(cronograma.dataInicio);
        const endDate = new Date(cronograma.dataFim);
        if (startDate >= endDate) {
            return 'A data de início deve ser anterior à data de fim';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAdmin) {
            toast.error('Apenas administradores podem salvar prêmios.');
            return;
        }
        try {
            if (!formData.nome.trim() || !formData.descricao.trim()) {
                throw new Error('Nome e descrição são obrigatórios');
            }
            const ano = Number(formData.ano);
            if (isNaN(ano) || ano < 2000 || ano > 2100) {
                throw new Error('Ano deve ser um número entre 2000 e 2100');
            }

            const cronogramas = formData.cronogramas.map(c => ({
                dataInicio: c.dataInicio,
                etapa: c.etapa.trim(),
                dataFim: c.dataFim
            }));
            for (const c of cronogramas) {
                const cronogramaError = validateCronograma(c);
                if (cronogramaError) {
                    throw new Error(cronogramaError);
                }
            }

            const payload = {
                nome: formData.nome.trim(),
                descricao: formData.descricao.trim(),
                ano,
                cronogramas
            };

            if (editId) {
                await api.put(`/premios/${editId}`, payload);
                toast.success('Prêmio atualizado com sucesso!');
            } else {
                await api.post('/premios', { ...payload, criadorId: user.id }); // Adiciona criadorId
                toast.success('Prêmio criado com sucesso!');
            }
            fetchPremios();
            handleClose();
        } catch (error) {
            console.error('Erro ao salvar prêmio:', error.response?.data || error.message);
            toast.error('Erro ao salvar prêmio: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (!isAdmin) {
            toast.error('Apenas administradores podem excluir prêmios.');
            return;
        }
        if (window.confirm('Deseja excluir este prêmio?')) {
            try {
                await api.delete(`/premios/${id}`);
                toast.success('Prêmio excluído com sucesso!');
                fetchPremios();
            } catch (error) {
                console.error('Erro ao excluir prêmio:', error.response?.data || error.message);
                toast.error('Erro ao excluir prêmio: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    return {
        premios,
        open,
        editId,
        error,
        formData,
        isAdmin,
        handleOpen,
        handleClose,
        handleChange,
        addCronograma,
        removeCronograma,
        handleSubmit,
        handleDelete,
        formatDate
    };
};

export default CrudPremioController;