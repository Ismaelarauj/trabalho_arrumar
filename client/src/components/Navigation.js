import React, { useState, useContext } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar,
    Box,
    Typography,
    Divider,
    Tooltip,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Edit,
    Logout,
    Work,
    Checklist,
    GroupAdd,
    SupervisedUserCircle,
    EmojiEvents,
    ListAlt,
    RocketLaunch,
    AddCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navigation = ({ showNav }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const { auth, logout } = useContext(AuthContext);

    // Verificar se user existe e tem nome, com fallback
    const user = auth.user || {};
    const name = user.nome || 'Usuário';
    const role = user.tipo || '';

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const handleLogout = async () => {
        await logout();
        setDrawerOpen(false);
        navigate('/login'); // Redireciona para a página de login após logout
    };

    const handleEditProfile = () => {
        navigate('/edit-profile');
        setDrawerOpen(false);
    };

    const handleMyProjects = () => {
        navigate('/my-projects');
        setDrawerOpen(false);
    };

    const handleCadastrarProjeto = () => {
        navigate('/projetos/enviar');
        setDrawerOpen(false);
    };

    const handleProjetosAvaliados = () => {
        navigate('/projetos/avaliados');
        setDrawerOpen(false);
    };

    const handleCadastrarAutor = () => {
        navigate('/cadastro?tipo=autor');
        setDrawerOpen(false);
    };

    const handleCadastrarAvaliador = () => {
        navigate('/cadastro?tipo=avaliador');
        setDrawerOpen(false);
    };

    const handleCadastrarPremio = () => {
        navigate('/premios/cadastrar');
        setDrawerOpen(false);
    };

    const handleVerListaPremio = () => {
        navigate('/premios');
        setDrawerOpen(false);
    };

    const handleVerListaProjetos = () => {
        navigate('/projetos');
        setDrawerOpen(false);
    };

    if (!showNav) {
        console.log('Navigation não renderizado: showNav é false');
        return null;
    }

    console.log('Renderizando Navigation, user:', user, 'name:', name, 'role:', role);

    const drawerContent = (
        <Box
            sx={{
                width: 250,
                pt: 2,
                pb: 2,
                bgcolor: '#f5f5f5',
                color: '#333',
                height: '100%',
            }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: '#1976d2', color: 'white' }}>
                <Avatar alt={name} src="https://via.placeholder.com/40" sx={{ mr: 2 }} />
                <Typography variant="h6">{name}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <List>
                <ListItem
                    button
                    onClick={handleEditProfile}
                    sx={{
                        '&:hover': { bgcolor: '#e0e0e0' },
                        borderRadius: 1,
                        mx: 1,
                    }}
                >
                    <ListItemIcon>
                        <Edit sx={{ color: '#1976d2' }} />
                    </ListItemIcon>
                    <ListItemText primary="Alterar Cadastro" />
                </ListItem>
                {auth.isAuthenticated && (
                    <ListItem
                        button
                        onClick={handleVerListaProjetos}
                        sx={{
                            '&:hover': { bgcolor: '#e0e0e0' },
                            borderRadius: 1,
                            mx: 1,
                        }}
                    >
                        <ListItemIcon>
                            <RocketLaunch sx={{ color: '#1976d2' }} />
                        </ListItemIcon>
                        <ListItemText primary="Ver Lista de Projetos" />
                    </ListItem>
                )}
                {role === 'autor' && (
                    <>
                        <ListItem
                            button
                            onClick={handleMyProjects}
                            sx={{
                                '&:hover': { bgcolor: '#e0e0e0' },
                                borderRadius: 1,
                                mx: 1,
                            }}
                        >
                            <ListItemIcon>
                                <Work sx={{ color: '#1976d2' }} />
                            </ListItemIcon>
                            <ListItemText primary="Ver Meus Projetos" />
                        </ListItem>
                        <ListItem
                            button
                            onClick={handleCadastrarProjeto}
                            sx={{
                                '&:hover': { bgcolor: '#e0e0e0' },
                                borderRadius: 1,
                                mx: 1,
                            }}
                        >
                            <ListItemIcon>
                                <AddCircle sx={{ color: '#1976d2' }} />
                            </ListItemIcon>
                            <ListItemText primary="Cadastrar Projeto" />
                        </ListItem>
                    </>
                )}
                {role === 'avaliador' && (
                    <ListItem
                        button
                        onClick={handleProjetosAvaliados}
                        sx={{
                            '&:hover': { bgcolor: '#e0e0e0' },
                            borderRadius: 1,
                            mx: 1,
                        }}
                    >
                        <ListItemIcon>
                            <Checklist sx={{ color: '#1976d2' }} />
                        </ListItemIcon>
                        <ListItemText primary="Ver Projetos Avaliados" />
                    </ListItem>
                )}
                {role === 'admin' && (
                    <>
                        <ListItem
                            button
                            onClick={handleCadastrarAutor}
                            sx={{
                                '&:hover': { bgcolor: '#e0e0e0' },
                                borderRadius: 1,
                                mx: 1,
                            }}
                        >
                            <ListItemIcon>
                                <GroupAdd sx={{ color: '#1976d2' }} />
                            </ListItemIcon>
                            <ListItemText primary="Cadastrar Autor" />
                        </ListItem>
                        <ListItem
                            button
                            onClick={handleCadastrarAvaliador}
                            sx={{
                                '&:hover': { bgcolor: '#e0e0e0' },
                                borderRadius: 1,
                                mx: 1,
                            }}
                        >
                            <ListItemIcon>
                                <SupervisedUserCircle sx={{ color: '#1976d2' }} />
                            </ListItemIcon>
                            <ListItemText primary="Cadastrar Avaliador" />
                        </ListItem>
                        <ListItem
                            button
                            onClick={handleCadastrarPremio}
                            sx={{
                                '&:hover': { bgcolor: '#e0e0e0' },
                                borderRadius: 1,
                                mx: 1,
                            }}
                        >
                            <ListItemIcon>
                                <EmojiEvents sx={{ color: '#1976d2' }} />
                            </ListItemIcon>
                            <ListItemText primary="Cadastrar Prêmio" />
                        </ListItem>
                        <ListItem
                            button
                            onClick={handleVerListaPremio}
                            sx={{
                                '&:hover': { bgcolor: '#e0e0e0' },
                                borderRadius: 1,
                                mx: 1,
                            }}
                        >
                            <ListItemIcon>
                                <ListAlt sx={{ color: '#1976d2' }} />
                            </ListItemIcon>
                            <ListItemText primary="Ver Lista de Prêmio" />
                        </ListItem>
                    </>
                )}
                <Divider sx={{ my: 1 }} />
                <ListItem
                    button
                    onClick={handleLogout}
                    sx={{
                        '&:hover': { bgcolor: '#e0e0e0' },
                        borderRadius: 1,
                        mx: 1,
                    }}
                >
                    <ListItemIcon>
                        <Logout sx={{ color: '#d32f2f' }} />
                    </ListItemIcon>
                    <ListItemText primary="Sair do Sistema" />
                </ListItem>
            </List>
        </Box>
    );

    return (
        <AppBar position="static" sx={{ zIndex: 1200, backgroundColor: '#1976d2', minHeight: '64px' }}>
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    <IconButton onClick={toggleDrawer(true)} color="inherit">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ ml: 1, color: 'white' }}>
                        {name}
                    </Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Tooltip title="Sair do Sistema">
                    <IconButton onClick={handleLogout} color="inherit">
                        <Logout />
                    </IconButton>
                </Tooltip>
                <Drawer
                    anchor="left"
                    open={drawerOpen}
                    onClose={toggleDrawer(false)}
                    sx={{
                        '& .MuiDrawer-paper': {
                            transition: 'width 0.3s ease-in-out',
                            boxShadow: 3,
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            </Toolbar>
        </AppBar>
    );
};

export default Navigation;