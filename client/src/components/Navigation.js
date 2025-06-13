import React, { useState, useEffect, useContext } from 'react';
import { AppBar, Toolbar, Button, IconButton, Menu, MenuItem, TextField, InputAdornment, Avatar, Box, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navigation = ({ showNav }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();
    const { auth, logout } = useContext(AuthContext);

    const user = auth.user;
    const name = user?.nome || 'Usuário';
    const role = user?.tipo;

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await logout();
        handleMenuClose();
    };

    const handleEditProfile = () => {
        navigate('/edit-profile');
        handleMenuClose();
    };

    const handleMyProjects = () => {
        navigate('/my-projects');
        handleMenuClose();
    };

    const handleProjetosAvaliados = () => {
        navigate('/projetos/avaliados');
        handleMenuClose();
    };

    const handleCadastrarAutor = () => {
        navigate('/cadastro?tipo=autor');
        handleMenuClose();
    };

    const handleCadastrarAvaliador = () => {
        navigate('/cadastro?tipo=avaliador');
        handleMenuClose();
    };

    const handleCadastrarPremio = () => {
        navigate('/premios/cadastrar');
        handleMenuClose();
    };

    const handleVerListaPremio = () => {
        navigate('/premios');
        handleMenuClose();
    };

    const handleSearch = () => {
        navigate(`/projetos?query=${searchQuery}&filter=${filter}`);
    };

    if (!showNav) return null;

    return (
        <AppBar position="static">
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    <IconButton onClick={handleMenuOpen} color="inherit">
                        <Avatar alt={name} src="https://via.placeholder.com/40" />
                    </IconButton>
                    <Typography variant="h6" sx={{ ml: 1 }}>
                        {name}
                    </Typography>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <MenuItem onClick={handleEditProfile}>Alterar Cadastro</MenuItem>
                        {role === 'autor' && (
                            <MenuItem onClick={handleMyProjects}>Ver Meus Projetos</MenuItem>
                        )}
                        {role === 'avaliador' && (
                            <MenuItem onClick={handleProjetosAvaliados}>Ver Projetos Avaliados</MenuItem>
                        )}
                        {role === 'admin' && (
                            <>
                                <MenuItem onClick={handleCadastrarAutor}>Cadastrar Autor</MenuItem>
                                <MenuItem onClick={handleCadastrarAvaliador}>Cadastrar Avaliador</MenuItem>
                                <MenuItem onClick={handleCadastrarPremio}>Cadastrar Prêmio</MenuItem>
                                <MenuItem onClick={handleVerListaPremio}>Ver Lista de Prêmio</MenuItem>
                            </>
                        )}
                        <MenuItem onClick={handleLogout}>Sair do Sistema</MenuItem>
                    </Menu>
                </Box>
                <TextField
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ mr: 2, backgroundColor: 'white', borderRadius: 1 }}
                />
                <Button color="inherit" onClick={handleSearch}>Pesquisar</Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navigation;