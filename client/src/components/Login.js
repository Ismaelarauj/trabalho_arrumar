import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/usuarios/login', { email, senha });
            localStorage.setItem('token', response.data.token);
            const { tipo } = response.data.usuario;
            setMensagem('Login realizado com sucesso!');
            setTimeout(() => {
                navigate(tipo === 'admin' ? '/premios' : tipo === 'autor' ? '/projetos/enviar' : '/projetos/avaliar');
            }, 1000);
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            setMensagem(error.response?.data?.error || 'Erro ao fazer login');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
            <Box sx={{ mb: 2 }}>
                <img
                    src="https://images.unsplash.com/photo-1581093450021-4a73631e7d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
                    alt="Projeto Científico"
                    style={{ maxWidth: '300px' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300'; }}
                />
            </Box>
            <Box component="form" onSubmit={handleLogin} sx={{ p: 2, border: '1px solid #dbdbdb', borderRadius: '5px', maxWidth: '350px', margin: '0 auto' }}>
                <TextField
                    label="Telefone, nome de usuário ou email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    variant="outlined"
                    sx={{ backgroundColor: '#fafafa' }}
                />
                <TextField
                    label="Senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    variant="outlined"
                    sx={{ backgroundColor: '#fafafa' }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2, mb: 1, backgroundColor: '#0095f6', '&:hover': { backgroundColor: '#007bb5' } }}
                >
                    Entrar
                </Button>
                <Box sx={{ textAlign: 'center', mb: 2 }}>OU</Box>
                <Link href="#" sx={{ color: '#00376b', fontSize: '12px' }}>
                    Esqueceu a senha?
                </Link>
            </Box>
            <Box sx={{ mt: 2, p: 2, border: '1px solid #dbdbdb', borderRadius: '5px', maxWidth: '350px', margin: '0 auto' }}>
                <Typography>Não tem uma conta? <Link to="/cadastro" sx={{ color: '#0095f6' }}>Cadastre-se</Link></Typography>
            </Box>
            {mensagem && <p style={{ color: mensagem.includes('sucesso') ? 'green' : 'red' }}>{mensagem}</p>}
        </Container>
    );
};

export default Login;