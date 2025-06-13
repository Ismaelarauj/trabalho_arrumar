import React, { useEffect, useState } from 'react';
import {
    AppBar,
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Toolbar,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { Link } from 'react-router-dom';
import LoginMenu from '../components/LoginMenu';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Adicionar a fonte no index.html ou via import CSS
// Exemplo: <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap" rel="stylesheet" />

const LoginView = ({ email, senha, mensagem, setEmail, setSenha, handleLogin }) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    useEffect(() => {
        setEmail('');
        setSenha('');
    }, [setEmail, setSenha]); // Ignorar o warning, pois é intencional para reset

    return (
        <>
            <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar>
                    <LoginMenu />
                </Toolbar>
            </AppBar>
            <Container
                maxWidth="lg"
                sx={{
                    mt: 4,
                    minHeight: '80vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#F5F7FA',
                }}
            >
                <Box sx={{ flex: 1, textAlign: 'center', mr: 4 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontFamily: "'Dancing Script', cursive",
                            fontWeight: 700,
                            background: 'linear-gradient(45deg, #2196F3 30%, #FFD700 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mt: 2,
                            mb: 3,
                        }}
                    >
                        Prêmios Científicos
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleLogin}
                        sx={{ p: 2, border: '1px solid #dbdbdb', borderRadius: '5px', maxWidth: '300px', margin: '0 auto' }}
                    >
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
                            type={showPassword ? 'text' : 'password'}
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            fullWidth
                            margin="normal"
                            required
                            variant="outlined"
                            sx={{ backgroundColor: '#fafafa' }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
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
                        <Link to="/recuperar-senha" sx={{ color: '#00376b', fontSize: '12px' }}>
                            Esqueceu a senha?
                        </Link>
                    </Box>
                    <Box sx={{ mt: 2, p: 2, border: '1px solid #dbdbdb', borderRadius: '5px', maxWidth: '300px', margin: '0 auto' }}>
                        <Typography>
                            Não tem uma conta?{' '}
                            <Link to="/cadastro" sx={{ color: '#0095f6' }}>
                                Cadastre-se
                            </Link>
                        </Typography>
                    </Box>
                    {mensagem && (
                        <Typography sx={{ mt: 2, color: mensagem.includes('sucesso') ? 'green' : 'red' }}>
                            {mensagem}
                        </Typography>
                    )}
                </Box>
                <Box sx={{ flex: 1.5, textAlign: 'right' }}>
                    <img
                        src="https://img.freepik.com/premium-vector/colorful-arrangement-graduation-awards-trophies-books-celebrating-academic-success-graduation-award-prize-talented-successful-students_538213-154788.jpg"
                        alt="Prêmios Científicos"
                        style={{
                            maxWidth: '600px',
                            borderRadius: '10px',
                            background: 'linear-gradient(45deg, #2196F3 30%, #FFD700 90%)',
                            padding: '15px',
                        }}
                        onError={(e) => {
                            console.error('Erro ao carregar a imagem:', e.message);
                            e.target.src = 'https://via.placeholder.com/600';
                            toast.error('Falha ao carregar a imagem de fundo.');
                        }}
                    />
                </Box>
            </Container>
        </>
    );
};

export default LoginView;