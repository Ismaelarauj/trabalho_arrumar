import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import CrudPremio from './components/CrudPremio.js';
import CrudAutor from './components/CrudAutor.js';
import CrudAvaliador from './components/CrudAvaliador.js';
import EnvioProjeto from './components/EnvioProjeto.js';
import AvaliacaoProjeto from './components/AvaliacaoProjeto.js';
import ListaVencedores from './components/ListaVencedores.js';
import ListaProjetos from './components/ListaProjetos.js';
import Login from './components/Login.js';
import { AppBar, Toolbar, Button } from '@mui/material';

const ProtectedRoute = ({ allowedRoles, children }) => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        if (!userRole || !allowedRoles.includes(userRole)) {
            navigate('/login');
        }
    }, [userRole, navigate]);

    return userRole && allowedRoles.includes(userRole) ? children : null;
};

function App() {
    return (
        <Router>
            <AppBar position="static">
                <Toolbar>
                    <Button color="inherit" href="/login">Login</Button>
                    <Button color="inherit" href="/premios">Prêmios</Button>
                    <Button color="inherit" href="/autores">Autores</Button>
                    <Button color="inherit" href="/avaliadores">Avaliadores</Button>
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
                    path="/autores"
                    element={
                        <ProtectedRoute allowedRoles={['admin', 'autor']}>
                            <CrudAutor />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/avaliadores"
                    element={
                        <ProtectedRoute allowedRoles={['admin', 'avaliador']}>
                            <CrudAvaliador />
                        </ProtectedRoute>
                    }
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