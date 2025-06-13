import React from 'react';
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    FormHelperText
} from '@mui/material';

const AvaliacaoProjetoView = ({ formData, projetos, errors, isAvaliador, handleChange, handleSubmit }) => {
    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Avaliação de Projeto
                </Typography>
                {isAvaliador ? (
                    projetos.length > 0 ? (
                        <form onSubmit={handleSubmit}>
                            <FormControl fullWidth margin="normal" error={!!errors.projetoId}>
                                <InputLabel>Projeto</InputLabel>
                                <Select
                                    name="projetoId"
                                    value={formData.projetoId}
                                    onChange={handleChange}
                                    required
                                >
                                    <MenuItem value="" disabled>
                                        Selecione um projeto
                                    </MenuItem>
                                    {projetos.map((projeto) => (
                                        <MenuItem key={projeto.id} value={projeto.id}>
                                            {projeto.titulo}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.projetoId && <FormHelperText>{errors.projetoId}</FormHelperText>}
                            </FormControl>
                            <TextField
                                label="Parecer"
                                name="parecer"
                                fullWidth
                                margin="normal"
                                multiline
                                rows={4}
                                value={formData.parecer}
                                onChange={handleChange}
                                required
                                error={!!errors.parecer}
                                helperText={errors.parecer}
                            />
                            <TextField
                                label="Nota (0 a 10)"
                                name="nota"
                                type="number"
                                fullWidth
                                margin="normal"
                                value={formData.nota}
                                onChange={handleChange}
                                inputProps={{ min: 0, max: 10 }}
                                required
                                error={!!errors.nota}
                                helperText={errors.nota}
                            />
                            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                                Enviar Avaliação
                            </Button>
                        </form>
                    ) : (
                        <Box>
                            <Typography variant="body1" color="textSecondary">
                                Nenhum projeto pendente disponível para avaliação no momento.
                            </Typography>
                            <Button variant="outlined" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
                                Recarregar
                            </Button>
                        </Box>
                    )
                ) : (
                    <Typography variant="body1" color="error">
                        Você não tem permissão para avaliar projetos. Faça login como avaliador.
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default AvaliacaoProjetoView;