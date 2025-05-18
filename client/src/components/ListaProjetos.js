import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import api from '../services/api.js';
import { jwtDecode } from 'jwt-decode';

const ListaProjetos = () => {
    const [projetos, setProjetos] = useState([]);
    const token = localStorage.getItem('token');
    const isAllowed = token && ['admin', 'autor', 'avaliador'].includes(jwtDecode(token).role);

    useEffect(() => {
        if (!isAllowed) {
            alert('Você não tem permissão para ver a lista de projetos.');
            return;
        }
        fetchProjetos();
    }, [isAllowed]);

    const fetchProjetos = async () => {
        try {
            const response = await api.get('/projetos');
            setProjetos(response.data);
        } catch (error) {
            console.error('Erro ao buscar projetos:', error);
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Lista de Projetos
                </Typography>
                {isAllowed ? (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Título</TableCell>
                                <TableCell>Autor Principal</TableCell>
                                <TableCell>Coautores</TableCell>
                                <TableCell>Prêmio</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {projetos.map((projeto) => (
                                <TableRow key={projeto.id}>
                                    <TableCell>{projeto.titulo}</TableCell>
                                    <TableCell>{projeto.Autor?.nome}</TableCell>
                                    <TableCell>{projeto.Coautores?.map((c) => c.nome).join(', ')}</TableCell>
                                    <TableCell>{projeto.Premio?.nome}</TableCell>
                                    <TableCell>{projeto.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Typography>Você não tem permissão para acessar esta página.</Typography>
                )}
            </Box>
        </Container>
    );
};

export default ListaProjetos;