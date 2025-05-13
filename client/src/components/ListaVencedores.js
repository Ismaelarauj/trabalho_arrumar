import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material';
import api from '../services/api.js';

const ListaVencedores = () => {
    const [vencedores, setVencedores] = useState([]);

    useEffect(() => {
        fetchVencedores();
    }, []);

    const fetchVencedores = async () => {
        try {
            const response = await api.get('/vencedores');
            console.log('Dados dos vencedores:', JSON.stringify(response.data, null, 2)); // Log detalhado
            setVencedores(response.data);
        } catch (error) {
            console.error('Erro ao buscar vencedores:', error);
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Lista de Vencedores
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Título do Projeto</TableCell>
                            <TableCell>Autor Principal</TableCell>
                            <TableCell>Coautores</TableCell>
                            <TableCell>Prêmio</TableCell>
                            <TableCell>Nota</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {vencedores.map((projeto) => (
                            <TableRow key={projeto.id}>
                                <TableCell>{projeto.titulo}</TableCell>
                                <TableCell>{projeto.Autor?.nome || 'N/A'}</TableCell>
                                <TableCell>
                                    {projeto.Coautores?.length > 0
                                        ? projeto.Coautores.map((c) => c.nome).join(', ')
                                        : 'Nenhum'}
                                </TableCell>
                                <TableCell>{projeto.Premio?.nome || 'N/A'}</TableCell>
                                <TableCell>
                                    {projeto.Avaliacoes?.[0]?.nota
                                        ? parseFloat(projeto.Avaliacoes[0].nota).toFixed(2)
                                        : 'Sem nota'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Container>
    );
};

export default ListaVencedores;