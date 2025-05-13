import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, TextField, Button, Table, TableBody, TableCell,
    TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import api from '../services/api.js';

const CrudAutor = () => {
    const [autores, setAutores] = useState([]);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        dataNascimento: '',
        instituicao: '',
        email: '',
        telefone: '',
        rua: '',
        cidade: '',
        estado: '',
        cep: ''
    });

    useEffect(() => {
        fetchAutores();
    }, []);

    const fetchAutores = async () => {
        try {
            const response = await api.get('/autores');
            console.log('Autores recebidos:', response.data);
            setAutores(response.data);
        } catch (error) {
            console.error('Erro ao buscar autores:', error);
        }
    };

    const handleOpen = (autor = null) => {
        if (autor) {
            setEditId(autor.id);
            setFormData({
                nome: autor.nome || '',
                cpf: autor.cpf || '',
                dataNascimento: autor.dataNascimento ? autor.dataNascimento.split('T')[0] : '',
                instituicao: autor.instituicao || '',
                email: autor.Contato?.email || '',
                telefone: autor.Contato?.telefone || '',
                rua: autor.Endereco?.rua || '',
                cidade: autor.Endereco?.cidade || '',
                estado: autor.Endereco?.estado || '',
                cep: autor.Endereco?.cep || ''
            });
        } else {
            setEditId(null);
            setFormData({
                nome: '',
                cpf: '',
                dataNascimento: '',
                instituicao: '',
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
                await api.put(`/autores/${editId}`, formData);
                alert('Autor atualizado com sucesso!');
            } else {
                await api.post('/autores', formData);
                alert('Autor criado com sucesso!');
            }
            fetchAutores();
            handleClose();
        } catch (error) {
            console.error('Erro ao salvar autor:', error.response?.data || error.message);
            alert('Erro ao salvar autor: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Deseja excluir este autor?')) {
            try {
                await api.delete(`/autores/${id}`);
                alert('Autor excluído com sucesso!');
                fetchAutores();
            } catch (error) {
                console.error('Erro ao excluir autor:', error);
                alert('Erro ao excluir autor: ' + error.message);
            }
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Gerenciamento de Autores
                </Typography>
                <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpen()}>
                    Novo Autor
                </Button>
                <Table sx={{ mt: 2 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>CPF</TableCell>
                            <TableCell>Instituição</TableCell>
                            <TableCell>E-mail</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {autores.map((autor) => (
                            <TableRow key={autor.id}>
                                <TableCell>{autor.nome}</TableCell>
                                <TableCell>{autor.cpf}</TableCell>
                                <TableCell>{autor.instituicao}</TableCell>
                                <TableCell>{autor.Contato?.email}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(autor)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(autor.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editId ? 'Editar Autor' : 'Novo Autor'}</DialogTitle>
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
                            label="Instituição"
                            name="instituicao"
                            fullWidth
                            margin="normal"
                            value={formData.instituicao}
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

export default CrudAutor;