import React, { useState, useContext } from 'react';
import { IconButton, Menu, MenuItem, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const LoginMenu = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const { auth } = useContext(AuthContext);

    const handleMenuOpen = (event) => {
        if (!auth.isAuthenticated) {
            navigate('/login');
            return;
        }
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNavigate = (path) => {
        handleMenuClose();
        navigate(path);
    };

    return (
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton
                edge="end"
                color="inherit"
                aria-label="menu de navegação"
                onClick={handleMenuOpen}
                sx={{ mr: 2 }}
            >
                <MenuIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={() => handleNavigate('/projetos')}>
                    Ver Lista de Projetos
                </MenuItem>
                <MenuItem onClick={() => handleNavigate('/vencedores')}>
                    Ver Lista de Vencedores
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default LoginMenu;