import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import CrudPremio from './components/CrudPremio.js';
import CrudUsuario from './components/CrudUsuario.js';
import EnvioProjeto from './components/EnvioProjeto.js';
import AvaliacaoProjeto from './components/AvaliacaoProjeto.js';
import ListaVencedores from './components/ListaVencedores.js';
import ListaProjetos from './components/ListaProjetos.js';
import Login from './components/Login.js';
import { AppBar, Toolbar, Button } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ allowedRoles, children }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
                alert('Sua sessão expirou. Faça login novamente.');
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            if (!allowedRoles.includes(decoded.role)) {
                alert('Você não tem permissão para acessar esta página.');
                navigate('/'); // Redireciona para login ou página inicial
            }
        } catch (error) {
            alert('Token inválido. Faça login novamente.');
            localStorage.removeItem('token');
            navigate('/login');
        }
    }, [token, navigate, allowedRoles]);

    return token ? children : null;
};

function App() {
    return (
        <Router>
            <AppBar position="static">
                <Toolbar>
                    <Button color="inherit" href="/login">Login</Button>
                    <Button color="inherit" href="/premios">Prêmios</Button>
                    <Button color="inherit" href="/usuarios">Usuários</Button>
                    <Button color="inherit" href="/projetos/enviar">Enviar Projeto</Button>
                    <Button color="inherit" href="/projetos/avaliar">Avaliar Projeto</Button>
                    <Button color="inherit" href="/projetos">Projetos</Button>
                    <Button color="inherit" href="/vencedores">Vencedores</Button>
                </Toolbar>
            </AppBar>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/premios"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <CrudPremio />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/usuarios"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <CrudUsuario />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/cadastro"
                    element={<CrudUsuario />}
                />
                <Route
                    path="/projetos/enviar"
                    element={
                        <ProtectedRoute allowedRoles={['autor']}>
                            <EnvioProjeto />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/projetos/avaliar"
                    element={
                        <ProtectedRoute allowedRoles={['avaliador']}>
                            <AvaliacaoProjeto />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/projetos"
                    element={
                        <ProtectedRoute allowedRoles={['admin', 'autor', 'avaliador']}>
                            <ListaProjetos />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/vencedores"
                    element={
                        <ProtectedRoute allowedRoles={['admin', 'autor', 'avaliador']}>
                            <ListaVencedores />
                        </ProtectedRoute>
                    }
                />
                <Route path="/" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;