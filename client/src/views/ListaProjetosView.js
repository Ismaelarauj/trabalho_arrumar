import React from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableRow, TableHead, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ListaProjetosView = ({ projetos = [], userId, role, handleEdit, handleDelete }) => {
    const navigate = useNavigate();

    const getTitle = () => {
        switch (window.location.pathname) {
            case '/my-projects':
                return 'Meus Projetos';
            case '/projetos/avaliados':
                return 'Projetos Avaliados por Mim';
            default:
                return 'Lista de Projetos';
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {getTitle()}
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Título</TableCell>
                            <TableCell>Autor Principal</TableCell>
                            <TableCell>Coautores</TableCell>
                            <TableCell>Prêmio</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(projetos) && projetos.length > 0 ? (
                            projetos.map((projeto) => (
                                <TableRow key={projeto.id}>
                                    <TableCell>{projeto.titulo || 'Sem título'}</TableCell>
                                    <TableCell>{projeto.Autor?.nome || 'N/A'}</TableCell>
                                    <TableCell>
                                        {projeto.Coautores?.map((c) => c.nome).join(', ') || 'Nenhum'}
                                    </TableCell>
                                    <TableCell>{projeto.Premio?.nome || 'N/A'}</TableCell>
                                    <TableCell>{projeto.status || 'Desconhecido'}</TableCell>
                                    <TableCell>
                                        {role === 'autor' &&
                                            projeto.status === 'pendente' &&
                                            userId === projeto.autorId && (
                                                <>
                                                    <IconButton
                                                        onClick={() => handleEdit(projeto.id)}
                                                        color="primary"
                                                        aria-label="Editar projeto"
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleDelete(projeto.id)}
                                                        color="error"
                                                        aria-label="Excluir projeto"
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </>
                                            )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    Nenhum projeto disponível.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Box>
        </Container>
    );
};

export default ListaProjetosView;