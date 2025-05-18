import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import api from '../services/api.js';
import { jwtDecode } from 'jwt-decode';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; // Medalha de ouro
import SilverIcon from '@mui/icons-material/LooksTwo'; // Representa prata (usando um ícone alternativo)
import BronzeIcon from '@mui/icons-material/Looks3'; // Representa bronze (usando um ícone alternativo)

const ListaVencedores = () => {
    const [vencedores, setVencedores] = useState([]);
    const token = localStorage.getItem('token');
    const isAllowed = token && ['admin', 'autor', 'avaliador'].includes(jwtDecode(token).role);

    useEffect(() => {
        if (!isAllowed) {
            alert('Você não tem permissão para ver a lista de vencedores.');
            return;
        }
        fetchVencedores();
    }, [isAllowed]);

    const fetchVencedores = async () => {
        try {
            const response = await api.get('/vencedores');
            console.log('Dados dos vencedores:', JSON.stringify(response.data, null, 2));
            setVencedores(response.data);
        } catch (error) {
            console.error('Erro ao buscar vencedores:', error);
        }
    };

    const getPodiumIcon = (index) => {
        switch (index) {
            case 0:
                return <EmojiEventsIcon color="warning" fontSize="large" />; // Ouro
            case 1:
                return <SilverIcon color="disabled" fontSize="large" />; // Prata
            case 2:
                return <BronzeIcon color="error" fontSize="large" />; // Bronze
            default:
                return null;
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Lista de Vencedores
                </Typography>
                {isAllowed ? (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Posição</TableCell> {/* Nova coluna para o ícone */}
                                <TableCell>Título do Projeto</TableCell>
                                <TableCell>Autor Principal</TableCell>
                                <TableCell>Coautores</TableCell>
                                <TableCell>Prêmio</TableCell>
                                <TableCell>Nota</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {vencedores.map((projeto, index) => (
                                <TableRow key={projeto.id}>
                                    <TableCell>{getPodiumIcon(index)}</TableCell> {/* Adiciona o ícone */}
                                    <TableCell>{projeto.titulo}</TableCell>
                                    <TableCell>{projeto.Autor?.nome || 'N/A'}</TableCell>
                                    <TableCell>
                                        {projeto.Coautores?.length > 0
                                            ? projeto.Coautores.map((c) => c.nome).join(', ')
                                            : 'Nenhum'}
                                    </TableCell>
                                    <TableCell>{projeto.Premio?.nome || 'N/A'}</TableCell>
                                    <TableCell>
                                        {projeto.avaliacoes?.[0]?.nota
                                            ? parseFloat(projeto.avaliacoes[0].nota).toFixed(2)
                                            : 'Sem nota'}
                                    </TableCell>
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

export default ListaVencedores;