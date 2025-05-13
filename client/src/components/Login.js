import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('userRole', role);
        navigate(role === 'admin' ? '/premios' : role === 'autor' ? '/projetos/enviar' : '/projetos/avaliar');
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        select
                        label="Tipo de Usuário"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    >
                        <MenuItem value="admin">Administrador</MenuItem>
                        <MenuItem value="autor">Autor</MenuItem>
                        <MenuItem value="avaliador">Avaliador</MenuItem>
                    </TextField>
                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                        Entrar
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default Login;