import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, TextField, Button, Table, TableBody, TableCell,
    TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import api from '../services/api.js';
import { jwtDecode } from 'jwt-decode';

const CrudPremio = () => {
    const [premios, setPremios] = useState([]);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState(null); // Estado para erros
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        ano: '',
        cronogramas: [{ dataInicio: '', etapa: '', dataFim: '' }]
    });
    const token = localStorage.getItem('token');
    const isAdmin = token ? jwtDecode(token).role === 'admin' : false;

    useEffect(() => {
        fetchPremios();
    }, []);

    const fetchPremios = async () => {
        try {
            const response = await api.get('/premios');
            setPremios(response.data);
            setError(null); // Limpa o erro se a requisição for bem-sucedida
        } catch (error) {
            console.error('Erro ao buscar prêmios:', error);
            setError('Erro ao carregar prêmios: ' + (error.response?.data?.error || error.message));
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    };

    const handleOpen = (premio = null) => {
        if (premio && isAdmin) {
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
        } else if (isAdmin) {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAdmin) {
            alert('Apenas administradores podem criar ou editar prêmios.');
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
                if (!c.etapa || !c.dataInicio || !c.dataFim) {
                    throw new Error('Todos os campos do cronograma são obrigatórios');
                }
            }

            const payload = {
                nome: formData.nome.trim(),
                descricao: formData.descricao.trim(),
                ano,
                cronogramas
            };

            console.log('Enviando dados:', payload);

            if (editId) {
                await api.put(`/premios/${editId}`, payload);
                alert('Prêmio atualizado com sucesso!');
            } else {
                await api.post('/premios', payload);
                alert('Prêmio criado com sucesso!');
            }
            fetchPremios();
            handleClose();
        } catch (error) {
            console.error('Erro ao salvar prêmio:', error.response?.data || error.message);
            alert('Erro ao salvar prêmio: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (!isAdmin) {
            alert('Apenas administradores podem excluir prêmios.');
            return;
        }
        if (window.confirm('Deseja excluir este prêmio?')) {
            try {
                await api.delete(`/premios/${id}`);
                alert('Prêmio excluído com sucesso!');
                fetchPremios();
            } catch (error) {
                console.error('Erro ao excluir prêmio:', error.response?.data || error.message);
                alert('Erro ao excluir prêmio: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Gerenciamento de Prêmios
                </Typography>
                {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}
                <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpen()} disabled={!isAdmin}>
                    Novo Prêmio
                </Button>
                <Table sx={{ mt: 2 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell>Ano</TableCell>
                            <TableCell>Cronogramas</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {premios.map((premio) => (
                            <TableRow key={premio.id}>
                                <TableCell>{premio.nome}</TableCell>
                                <TableCell>{premio.descricao}</TableCell>
                                <TableCell>{premio.ano}</TableCell>
                                <TableCell>
                                    {premio.cronogramas?.map((c, i) => (
                                        <div key={i}>
                                            {c.etapa} ({formatDate(c.dataInicio)} a {formatDate(c.dataFim)})
                                        </div>
                                    ))}
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(premio)} disabled={!isAdmin}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(premio.id)} disabled={!isAdmin}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editId ? 'Editar Prêmio' : 'Novo Prêmio'}</DialogTitle>
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
                            label="Descrição"
                            name="descricao"
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                            value={formData.descricao}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Ano"
                            name="ano"
                            type="number"
                            fullWidth
                            margin="normal"
                            value={formData.ano}
                            onChange={handleChange}
                            required
                            inputProps={{ min: 2000, max: 2100 }}
                        />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Cronogramas
                        </Typography>
                        {formData.cronogramas.map((cronograma, index) => (
                            <Box key={index} sx={{ mb: 2, border: '1px solid #ccc', p: 2 }}>
                                <TextField
                                    label="Data de Início"
                                    type="date"
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    value={cronograma.dataInicio}
                                    onChange={(e) => handleChange(e, index, 'dataInicio')}
                                    required
                                />
                                <TextField
                                    label="Etapa"
                                    fullWidth
                                    margin="normal"
                                    value={cronograma.etapa}
                                    onChange={(e) => handleChange(e, index, 'etapa')}
                                    required
                                />
                                <TextField
                                    label="Data de Fim"
                                    type="date"
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    value={cronograma.dataFim}
                                    onChange={(e) => handleChange(e, index, 'dataFim')}
                                    required
                                />
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => removeCronograma(index)}
                                    sx={{ mt: 1 }}
                                >
                                    Remover Cronograma
                                </Button>
                            </Box>
                        ))}
                        <Button variant="outlined" onClick={addCronograma} sx={{ mb: 2 }}>
                            Adicionar Cronograma
                        </Button>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button type="submit" variant="contained" onClick={handleSubmit} disabled={!isAdmin}>
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CrudPremio;