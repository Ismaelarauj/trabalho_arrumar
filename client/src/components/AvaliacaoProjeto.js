import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, TextField, Button, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import api from '../services/api.js';
import { jwtDecode } from 'jwt-decode';

const AvaliacaoProjeto = () => {
    const token = localStorage.getItem('token');
    const avaliadorId = token ? jwtDecode(token).id : null;

    const [formData, setFormData] = useState({
        projetoId: '',
        avaliadorId: avaliadorId || '',
        parecer: '',
        nota: '',
        dataAvaliacao: new Date().toISOString().split('T')[0]
    });
    const [projetos, setProjetos] = useState([]);

    useEffect(() => {
        fetchProjetos();
    }, []);

    const fetchProjetos = async () => {
        try {
            const response = await api.get('/projetos');
            setProjetos(response.data.filter((projeto) => projeto.status === 'pendente'));
        } catch (error) {
            console.error('Erro ao buscar projetos:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!avaliadorId) {
            alert('Você precisa estar logado para avaliar um projeto.');
            return;
        }
        try {
            // Converter os campos para os tipos esperados pelo backend
            const dataToSend = {
                projetoId: parseInt(formData.projetoId), // Converter para número
                avaliadorId: parseInt(formData.avaliadorId), // Converter para número
                parecer: formData.parecer,
                nota: parseFloat(formData.nota), // Converter para número
                dataAvaliacao: formData.dataAvaliacao
            };

            await api.post('/avaliacoes', dataToSend);
            alert('Avaliação enviada com sucesso!');
            setFormData({
                projetoId: '',
                avaliadorId: avaliadorId || '',
                parecer: '',
                nota: '',
                dataAvaliacao: new Date().toISOString().split('T')[0]
            });
            fetchProjetos();
        } catch (error) {
            // Exibir mensagem de erro detalhada do backend
            const errorMessage = error.response?.data?.error || error.message;
            alert('Erro ao enviar avaliação: ' + errorMessage);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Avaliação de Projeto
                </Typography>
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Projeto</InputLabel>
                        <Select
                            name="projetoId"
                            value={formData.projetoId}
                            onChange={handleChange}
                            required
                        >
                            {projetos.map((projeto) => (
                                <MenuItem key={projeto.id} value={projeto.id}>
                                    {projeto.titulo}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Parecer"
                        name="parecer"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        value={formData.parecer}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Nota (0 a 10)"
                        name="nota"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={formData.nota}
                        onChange={handleChange}
                        inputProps={{ min: 0, max: 10 }}
                        required
                    />
                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                        Enviar Avaliação
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default AvaliacaoProjeto;