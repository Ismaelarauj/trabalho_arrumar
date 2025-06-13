import React from 'react';
import {
    Container,
    Typography,
    Box,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';

const ListaVencedoresView = ({ vencedores = [] }) => {
    const getPodiumIcon = (index) => {
        switch (index) {
            case 0: // 1º lugar
                return <EmojiEventsIcon sx={{ color: '#FFD700' }} fontSize="large" />; // Dourado
            case 1: // 2º lugar
                return <LooksTwoIcon sx={{ color: '#C0C0C0' }} fontSize="large" />; // Prata
            case 2: // 3º lugar
                return <EmojiEventsIcon sx={{ color: '#CD7F32' }} fontSize="large" />; // Bronze
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
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Posição</TableCell>
                            <TableCell>Título do Projeto</TableCell>
                            <TableCell>Autor Principal</TableCell>
                            <TableCell>Coautores</TableCell>
                            <TableCell>Prêmio</TableCell>
                            <TableCell>Nota</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(vencedores) && vencedores.length > 0 ? (
                            vencedores.map((projeto, index) => (
                                <TableRow key={projeto.id}>
                                    <TableCell>{getPodiumIcon(index)}</TableCell>
                                    <TableCell>{projeto.titulo || 'Sem título'}</TableCell>
                                    <TableCell>{projeto.Autor?.nome || 'N/A'}</TableCell>
                                    <TableCell>
                                        {projeto.Coautores?.length > 0
                                            ? projeto.Coautores.map((c) => c.nome).join(', ')
                                            : 'Nenhum'}
                                    </TableCell>
                                    <TableCell>{projeto.Premio?.nome || 'N/A'}</TableCell>
                                    <TableCell>
                                        {projeto.avaliacoes?.[0]?.nota
                                            ? !isNaN(parseFloat(projeto.avaliacoes[0].nota))
                                                ? parseFloat(projeto.avaliacoes[0].nota).toFixed(2)
                                                : 'Inválida'
                                            : 'Sem nota'}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    Nenhum vencedor disponível.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Box>
        </Container>
    );
};

export default ListaVencedoresView;