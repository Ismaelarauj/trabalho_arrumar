import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, TextField, Button, Table, TableBody, TableCell,
    TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    MenuItem
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { jwtDecode } from 'jwt-decode';

const CrudUsuario = () => {
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
    const token = localStorage.getItem('token');
    const currentUserId = token ? jwtDecode(token).id : null;
    const isAdmin = token ? jwtDecode(token).role === 'admin' : false;
    const location = useLocation();
    const navigate = useNavigate();
    const isCadastroRoute = location.pathname === '/cadastro';

    useEffect(() => {
        if (token && !isCadastroRoute) {
            fetchUsuarios();
        }
        if (isCadastroRoute) {
            setOpen(true);
        }
    }, [token, isCadastroRoute]);

    const fetchUsuarios = async () => {
        try {
            const response = await api.get('/usuarios');
            console.log('Usuários recebidos:', response.data);
            setUsuarios(response.data);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
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
        } else if (!isCadastroRoute) {
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
        if (isCadastroRoute) {
            navigate('/login');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validação manual para campos condicionalmente obrigatórios
            const errors = [];
            if (!formData.nome) errors.push('O nome é obrigatório');
            if (!formData.cpf) errors.push('O CPF é obrigatório');
            if (!formData.dataNascimento) errors.push('A data de nascimento é obrigatória');
            if (!formData.tipo) errors.push('O tipo é obrigatório');
            if (formData.tipo === 'autor' && !formData.instituicao) errors.push('A instituição é obrigatória para autores');
            if (formData.tipo === 'avaliador' && !formData.especialidade) errors.push('A especialidade é obrigatória para avaliadores');
            if (!formData.email) errors.push('O email é obrigatório');
            if (!formData.senha && !editId) errors.push('A senha é obrigatória');

            if (errors.length > 0) {
                alert('Erro ao salvar usuário: ' + errors.join(', '));
                return;
            }

            console.log('Enviando dados:', formData);
            if (editId) {
                if (!token) throw new Error('Autenticação necessária para editar');
                const isSelfEdit = currentUserId === editId;
                if (!isAdmin && !isSelfEdit) throw new Error('Apenas o administrador ou o próprio usuário podem editar');
                const originalUser = usuarios.find(u => u.id === editId);
                const dataToSend = { ...formData };
                if (!isAdmin) {
                    dataToSend.cpf = originalUser.cpf;
                    dataToSend.email = originalUser.email;
                }
                await api.put(`/usuarios/${editId}`, dataToSend);
                alert('Usuário atualizado com sucesso!');
            } else {
                await api.post('/usuarios', formData);
                alert('Usuário criado com sucesso!');
                if (isCadastroRoute) {
                    navigate('/login');
                }
            }
            if (!isCadastroRoute) {
                fetchUsuarios();
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
            alert(errorMessage);
        }
    };

    const handleDelete = async (id) => {
        if (!token || !isAdmin) {
            alert('Apenas administradores podem excluir usuários.');
            return;
        }
        if (currentUserId === id) {
            alert('Você não pode excluir sua própria conta.');
            return;
        }
        if (window.confirm('Deseja excluir este usuário?')) {
            try {
                await api.delete(`/usuarios/${id}`);
                alert('Usuário excluído com sucesso!');
                fetchUsuarios();
            } catch (error) {
                console.error('Erro ao excluir usuário:', error);
                alert('Erro ao excluir usuário: ' + error.message);
            }
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {isCadastroRoute ? 'Cadastro de Novo Usuário' : 'Gerenciamento de Usuários'}
                </Typography>
                {!isCadastroRoute && isAdmin && (
                    <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpen()}>
                        Novo Usuário
                    </Button>
                )}
                {token && !isCadastroRoute && (
                    <Table sx={{ mt: 2 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>CPF</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {usuarios.map((usuario) => (
                                <TableRow key={usuario.id}>
                                    <TableCell>{usuario.nome}</TableCell>
                                    <TableCell>{usuario.cpf}</TableCell>
                                    <TableCell>{usuario.tipo}</TableCell>
                                    <TableCell>{usuario.email}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleOpen(usuario)} disabled={!isAdmin && currentUserId !== usuario.id}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(usuario.id)} disabled={!isAdmin}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Box>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editId ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            select
                            label="Tipo"
                            name="tipo"
                            fullWidth
                            margin="normal"
                            value={formData.tipo}
                            onChange={handleChange}
                            required
                            disabled={editId !== null && !isAdmin}
                        >
                            <MenuItem value="autor">Autor</MenuItem>
                            <MenuItem value="avaliador">Avaliador</MenuItem>
                        </TextField>
                        <TextField
                            label="Nome"
                            name="nome"
                            fullWidth
                            margin="normal"
                            value={formData.nome}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="CPF"
                            name="cpf"
                            fullWidth
                            margin="normal"
                            value={formData.cpf}
                            onChange={handleChange}
                            required
                            disabled={editId && !isAdmin}
                        />
                        <TextField
                            label="Data de Nascimento"
                            name="dataNascimento"
                            type="date"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            value={formData.dataNascimento}
                            onChange={handleChange}
                            required
                        />
                        {formData.tipo === 'autor' && (
                            <TextField
                                label="Instituição"
                                name="instituicao"
                                fullWidth
                                margin="normal"
                                value={formData.instituicao}
                                onChange={handleChange}
                                required
                            />
                        )}
                        {formData.tipo === 'avaliador' && (
                            <TextField
                                label="Especialidade"
                                name="especialidade"
                                fullWidth
                                margin="normal"
                                value={formData.especialidade}
                                onChange={handleChange}
                                required
                            />
                        )}
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            fullWidth
                            margin="normal"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={editId && !isAdmin}
                        />
                        <TextField
                            label="Senha"
                            name="senha"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={formData.senha}
                            onChange={handleChange}
                            required={!editId}
                        />
                        <TextField
                            label="Telefone"
                            name="telefone"
                            fullWidth
                            margin="normal"
                            value={formData.telefone}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Rua"
                            name="rua"
                            fullWidth
                            margin="normal"
                            value={formData.rua}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Cidade"
                            name="cidade"
                            fullWidth
                            margin="normal"
                            value={formData.cidade}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Estado"
                            name="estado"
                            fullWidth
                            margin="normal"
                            value={formData.estado}
                            onChange={handleChange}
                        />
                        <TextField
                            label="CEP"
                            name="cep"
                            fullWidth
                            margin="normal"
                            value={formData.cep}
                            onChange={handleChange}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button type="submit" variant="contained" onClick={handleSubmit}>
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CrudUsuario;