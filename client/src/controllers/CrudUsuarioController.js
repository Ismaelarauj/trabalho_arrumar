import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../services/api.js';
import { toast } from 'react-toastify';

const CrudUsuarioController = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const user = auth.user;
    const isAdmin = user?.tipo === 'admin';
    const currentUserId = user?.id;
    const location = useLocation();
    const isCadastroRoute = location.pathname === '/cadastro';

    const [usuarios, setUsuarios] = useState([]);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        dataNascimento: '',
        tipo: '',
        instituicao: '',
        especialidade: '',
        email: '',
        senha: '',
        telefone: '',
        rua: '',
        cidade: '',
        estado: '',
        cep: ''
    });

    useEffect(() => {
        if (auth.isAuthenticated === null) return;
        if (!isCadastroRoute && !auth.isAuthenticated) {
            navigate('/login', { replace: true });
            return;
        }
        if (!isCadastroRoute) {
            fetchUsuarios();
        } else if (isCadastroRoute && !open) {
            setFormData({
                nome: '',
                cpf: '',
                dataNascimento: '',
                tipo: '',
                instituicao: '',
                especialidade: '',
                email: '',
                senha: '',
                telefone: '',
                rua: '',
                cidade: '',
                estado: '',
                cep: ''
            });
            setOpen(true);
        }
    }, [auth.isAuthenticated, isCadastroRoute, navigate, open]);

    const fetchUsuarios = async () => {
        try {
            const response = await api.get('/usuarios');
            console.log('Usuários recebidos:', response.data);
            setUsuarios(response.data);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            toast.error('Erro ao buscar usuários: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleOpen = (usuario = null) => {
        if (usuario) {
            setEditId(usuario.id);
            setFormData({
                nome: usuario.nome || '',
                cpf: usuario.cpf || '',
                dataNascimento: usuario.dataNascimento ? usuario.dataNascimento.split('T')[0] : '',
                tipo: usuario.tipo || '',
                instituicao: usuario.instituicao || '',
                especialidade: usuario.especialidade || '',
                email: usuario.email || '',
                senha: '',
                telefone: usuario.Contato?.telefone || '',
                rua: usuario.Endereco?.rua || '',
                cidade: usuario.Endereco?.cidade || '',
                estado: usuario.Endereco?.estado || '',
                cep: usuario.Endereco?.cep || ''
            });
        } else {
            setEditId(null);
            setFormData({
                nome: '',
                cpf: '',
                dataNascimento: '',
                tipo: '',
                instituicao: '',
                especialidade: '',
                email: '',
                senha: '',
                telefone: '',
                rua: '',
                cidade: '',
                estado: '',
                cep: ''
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        if (isCadastroRoute && !auth.isAuthenticated) {
            navigate('/login');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const errors = [];
        if (!formData.nome) errors.push('O nome é obrigatório');
        if (!formData.cpf) errors.push('O CPF é obrigatório');
        else if (!/^\d{11}$/.test(formData.cpf)) errors.push('O CPF deve ter 11 dígitos');
        if (!formData.dataNascimento) errors.push('A data de nascimento é obrigatória');
        if (!formData.tipo) errors.push('O tipo é obrigatório');
        if (formData.tipo === 'autor' && !formData.instituicao) errors.push('A instituição é obrigatória para autores');
        if (formData.tipo === 'avaliador' && !formData.especialidade) errors.push('A especialidade é obrigatória para avaliadores');
        if (!formData.email) errors.push('O email é obrigatório');
        if (!formData.senha && !editId) errors.push('A senha é obrigatória');
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            toast.error('Erro ao salvar usuário: ' + validationErrors.join(', '));
            return;
        }

        try {
            if (editId) {
                if (!auth.isAuthenticated) throw new Error('Autenticação necessária para editar');
                const isSelfEdit = currentUserId === editId;
                if (!isAdmin && !isSelfEdit) {
                    toast.error('Você não tem permissão para editar este usuário.');
                    return;
                }
                const originalUser = usuarios.find(u => u.id === editId);
                const dataToSend = { ...formData };
                if (!isAdmin) {
                    dataToSend.cpf = originalUser.cpf;
                    dataToSend.email = originalUser.email;
                }
                await api.put(`/usuarios/${editId}`, dataToSend);
                toast.success('Usuário atualizado com sucesso!');
            } else {
                await api.post('/usuarios', formData);
                toast.success('Usuário criado com sucesso!');
            }

            await fetchUsuarios();

            if (isAdmin) {
                navigate('/usuarios');
            } else if (isCadastroRoute) {
                navigate('/login');
            }

            handleClose();
        } catch (error) {
            console.error('Erro ao salvar usuário:', error.response?.data || error.message);
            let errorMessage = 'Erro ao salvar usuário: ';
            if (error.response?.status === 400 && error.response?.data?.errors) {
                errorMessage += error.response.data.errors.map(err => `${err.field}: ${err.message}`).join(', ');
            } else {
                errorMessage += error.response?.data?.error || error.message;
            }
            toast.error(errorMessage);
        }
    };

    const handleDelete = async (id) => {
        if (!auth.isAuthenticated || !isAdmin) {
            toast.error('Apenas administradores podem excluir usuários.');
            return;
        }
        if (currentUserId === id) {
            toast.error('Você não pode excluir sua própria conta.');
            return;
        }
        if (window.confirm('Deseja excluir este usuário?')) {
            try {
                await api.delete(`/usuarios/${id}`);
                toast.success('Usuário excluído com sucesso!');
                fetchUsuarios();
            } catch (error) {
                console.error('Erro ao excluir usuário:', error);
                toast.error('Erro ao excluir usuário: ' + error.message);
            }
        }
    };

    return {
        usuarios,
        open,
        editId,
        formData,
        currentUserId,
        isAdmin,
        isCadastroRoute,
        handleOpen,
        handleClose,
        handleChange,
        handleSubmit,
        handleDelete
    };
};

export default CrudUsuarioController;