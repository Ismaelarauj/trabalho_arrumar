import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, TextField, Button, MenuItem, Select, InputLabel, FormControl, FormHelperText
} from '@mui/material';
import api from '../services/api.js';

const EnvioProjeto = () => {
    const [formData, setFormData] = useState({
        premioId: '',
        autorId: 1, // Simulado para o autor logado
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
        fetchPremios();
        fetchAutores();
    }, []);

    const fetchPremios = async () => {
        try {
            const response = await api.get('/premios');
            setPremios(response.data);
        } catch (error) {
            console.error('Erro ao buscar prêmios:', error);
        }
    };

    const fetchAutores = async () => {
        try {
            const response = await api.get('/autores');
            setAutores(response.data);
        } catch (error) {
            console.error('Erro ao buscar autores:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Limpar erro ao alterar o campo
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
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await api.post('/projetos', formData);
            alert('Projeto enviado com sucesso!');
            setFormData({
                premioId: '',
                autorId: 1,
                titulo: '',
                resumo: '',
                areaTematica: '',
                dataEnvio: new Date().toISOString().split('T')[0],
                coautores: []
            });
            setErrors({});
        } catch (error) {
            if (error.response && error.response.data.errors) {
                const serverErrors = error.response.data.errors.reduce((acc, err) => {
                    acc[err.field] = err.message;
                    return acc;
                }, {});
                setErrors(serverErrors);
            } else {
                alert('Erro ao enviar projeto: ' + (error.response?.data.error || error.message));
            }
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Envio de Projeto
                </Typography>
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth margin="normal" error={!!errors.premioId}>
                        <InputLabel>Prêmio</InputLabel>
                        <Select
                            name="premioId"
                            value={formData.premioId}
                            onChange={handleChange}
                            required
                        >
                            {premios.map((premio) => (
                                <MenuItem key={premio.id} value={premio.id}>
                                    {premio.nome} ({premio.ano})
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.premioId && <FormHelperText>{errors.premioId}</FormHelperText>}
                    </FormControl>
                    <TextField
                        label="Título"
                        name="titulo"
                        fullWidth
                        margin="normal"
                        value={formData.titulo}
                        onChange={handleChange}
                        required
                        error={!!errors.titulo}
                        helperText={errors.titulo}
                    />
                    <TextField
                        label="Resumo"
                        name="resumo"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        value={formData.resumo}
                        onChange={handleChange}
                        required
                        error={!!errors.resumo}
                        helperText={errors.resumo}
                    />
                    <TextField
                        label="Área Temática"
                        name="areaTematica"
                        fullWidth
                        margin="normal"
                        value={formData.areaTematica}
                        onChange={handleChange}
                        required
                        error={!!errors.areaTematica}
                        helperText={errors.areaTematica}
                    />
                    <TextField
                        label="Data de Envio"
                        name="dataEnvio"
                        type="date"
                        fullWidth
                        margin="normal"
                        value={formData.dataEnvio}
                        onChange={handleChange}
                        required
                        error={!!errors.dataEnvio}
                        helperText={errors.dataEnvio}
                        InputLabelProps={{ shrink: true }}
                    />
                    <FormControl fullWidth margin="normal" error={!!errors.coautores}>
                        <InputLabel>Coautores</InputLabel>
                        <Select
                            multiple
                            name="coautores"
                            value={formData.coautores}
                            onChange={handleCoautoresChange}
                        >
                            {autores.map((autor) => (
                                <MenuItem key={autor.id} value={autor.id}>
                                    {autor.nome}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.coautores && <FormHelperText>{errors.coautores}</FormHelperText>}
                    </FormControl>
                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                        Enviar Projeto
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default EnvioProjeto;