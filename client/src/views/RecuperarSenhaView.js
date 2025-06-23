// src/views/RecuperarSenhaView.js
import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography } from '@mui/material';
import api from '../services/api';
import { toast } from 'react-toastify';

const RecuperarSenhaView = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/usuarios/recuperar-senha', { email });
            toast.success('Instruções enviadas para o email!');
        } catch (error) {
            toast.error('Erro: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, border: '1px solid #dbdbdb', borderRadius: '5px' }}>
                <Typography variant="h5" gutterBottom>
                    Recuperar Senha
                </Typography>
                <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                    Enviar
                </Button>
            </Box>
        </Container>
    );
};

export default RecuperarSenhaView;