import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, TextField, Button, Table, TableBody, TableCell,
    TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import api from '../services/api.js';

const CrudAvaliador = () => {
    const [avaliadores, setAvaliadores] = useState([]);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        dataNascimento: '',
        especialidade: '',
        email: '',
        telefone: '',
        rua: '',
        cidade: '',
        estado: '',
        cep: ''
    });

    useEffect(() => {
        fetchAvaliadores();
    }, []);

    const fetchAvaliadores = async () => {
        try {
            const response = await api.get('/avaliadores');
            console.log('Avaliadores recebidos:', response.data);
            setAvaliadores(response.data);
        } catch (error) {
            console.error('Erro ao buscar avaliadores:', error);
        }
    };

    const handleOpen = (avaliador = null) => {
        if (avaliador) {
            setEditId(avaliador.id);
            setFormData({
                nome: avaliador.nome || '',
                cpf: avaliador.cpf || '',
                dataNascimento: avaliador.dataNascimento ? avaliador.dataNascimento.split('T')[0] : '',
                especialidade: avaliador.especialidade || '',
                email: avaliador.Contato?.email || '',
                telefone: avaliador.Contato?.telefone || '',
                rua: avaliador.Endereco?.rua || '',
                cidade: avaliador.Endereco?.cidade || '',
                estado: avaliador.Endereco?.estado || '',
                cep: avaliador.Endereco?.cep || ''
            });
        } else {
            setEditId(null);
            setFormData({
                nome: '',
                cpf: '',
                dataNascimento: '',
                especialidade: '',
                email: '',
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
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Enviando dados:', formData);
            if (editId) {
                await api.put(`/avaliadores/${editId}`, formData);
                alert('Avaliador atualizado com sucesso!');
            } else {
                await api.post('/avaliadores', formData);
                alert('Avaliador criado com sucesso!');
            }
            fetchAvaliadores();
            handleClose();
        } catch (error) {
            console.error('Erro ao salvar avaliador:', error.response?.data || error.message);
            alert('Erro ao salvar avaliador: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Deseja excluir este avaliador?')) {
            try {
                await api.delete(`/avaliadores/${id}`);
                alert('Avaliador excluído com sucesso!');
                fetchAvaliadores();
            } catch (error) {
                console.error('Erro ao excluir avaliador:', error);
                alert('Erro ao excluir avaliador: ' + error.message);
            }
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Gerenciamento de Avaliadores
                </Typography>
                <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpen()}>
                    Novo Avaliador
                </Button>
                <Table sx={{ mt: 2 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>CPF</TableCell>
                            <TableCell>Especialidade</TableCell>
                            <TableCell>E-mail</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {avaliadores.map((avaliador) => (
                            <TableRow key={avaliador.id}>
                                <TableCell>{avaliador.nome}</TableCell>
                                <TableCell>{avaliador.cpf}</TableCell>
                                <TableCell>{avaliador.especialidade}</TableCell>
                                <TableCell>{avaliador.Contato?.email}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(avaliador)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(avaliador.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editId ? 'Editar Avaliador' : 'Novo Avaliador'}</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
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
                        <TextField
                            label="Especialidade"
                            name="especialidade"
                            fullWidth
                            margin="normal"
                            value={formData.especialidade}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="E-mail"
                            name="email"
                            type="email"
                            fullWidth
                            margin="normal"
                            value={formData.email}
                            onChange={handleChange}
                            required
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

export default CrudAvaliador;