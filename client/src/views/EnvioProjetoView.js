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
    FormHelperText,
} from '@mui/material';
import { Link } from 'react-router-dom';

const EnvioProjetoView = ({
                              formData,
                              errors,
                              premios,
                              autores,
                              isAutor,
                              handleChange,
                              handleCoautoresChange,
                              handleSubmit,
                          }) => {
    console.log('Premios em EnvioProjetoView:', premios); // Debug

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Envio de Projeto
                </Typography>
                {isAutor ? (
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth margin="normal" error={!!errors.premioId}>
                            <InputLabel>Prêmio</InputLabel>
                            <Select
                                name="premioId"
                                value={formData.premioId}
                                onChange={handleChange}
                                required
                            >
                                {Array.isArray(premios) && premios.length > 0 ? (
                                    premios.map((premio) => (
                                        <MenuItem key={premio.id} value={premio.id}>
                                            {premio.nome} ({premio.ano})
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem value="" disabled>
                                        Nenhum prêmio disponível
                                    </MenuItem>
                                )}
                            </Select>
                            {errors.premioId && <FormHelperText>{errors.premioId}</FormHelperText>}
                        </FormControl>
                        <TextField
                            label="Título"
                            name="titulo"
                            fullWidth
                            margin="normal"
                            value={formData.titulo}
                            onChange={handleChange}
                            required
                            error={!!errors.titulo}
                            helperText={errors.titulo}
                        />
                        <TextField
                            label="Resumo"
                            name="resumo"
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                            value={formData.resumo}
                            onChange={handleChange}
                            required
                            error={!!errors.resumo}
                            helperText={errors.resumo}
                        />
                        <TextField
                            label="Área Temática"
                            name="areaTematica"
                            fullWidth
                            margin="normal"
                            value={formData.areaTematica}
                            onChange={handleChange}
                            required
                            error={!!errors.areaTematica}
                            helperText={errors.areaTematica}
                        />
                        <TextField
                            label="Data de Envio"
                            name="dataEnvio"
                            type="date"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            value={formData.dataEnvio}
                            onChange={handleChange}
                            required
                            error={!!errors.dataEnvio}
                            helperText={errors.dataEnvio}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Coautores</InputLabel>
                            <Select
                                name="coautores"
                                multiple
                                value={formData.coautores}
                                onChange={handleCoautoresChange}
                            >
                                {Array.isArray(autores) && autores.length > 0 ? (
                                    autores.map((autor) => (
                                        <MenuItem key={autor.id} value={autor.id}>
                                            {autor.nome}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem value="" disabled>
                                        Nenhum autor disponível
                                    </MenuItem>
                                )}
                            </Select>
                            {errors.coautores && (
                                <FormHelperText error>{errors.coautores}</FormHelperText>
                            )}
                        </FormControl>
                        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                            Enviar Projeto
                        </Button>
                    </form>
                ) : (
                    <Typography variant="body1" color="error">
                        Você não tem permissão para enviar projetos. Faça login como autor ou{' '}
                        <Link to="/cadastro?tipo=autor">cadastre-se como autor</Link>.
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default EnvioProjetoView;