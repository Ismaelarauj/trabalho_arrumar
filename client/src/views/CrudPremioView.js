import React from 'react';
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const CrudPremioView = ({
                            premios,
                            open,
                            editId,
                            error,
                            formData,
                            isAdmin,
                            handleOpen,
                            handleClose,
                            handleChange,
                            addCronograma,
                            removeCronograma,
                            handleSubmit,
                            handleDelete,
                            formatDate
                        }) => {
    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Gerenciamento de Prêmios
                </Typography>
                {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}
                <Tooltip title={isAdmin ? "Adicionar novo prêmio" : "Apenas administradores podem adicionar prêmios"}>
                    <span>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Add />}
                            onClick={() => handleOpen()}
                            disabled={!isAdmin}
                        >
                            Novo Prêmio
                        </Button>
                    </span>
                </Tooltip>

                {/* Seção Meus Prêmios */}
                <Typography variant="h5" sx={{ mt: 4 }}>
                    Meus Prêmios
                </Typography>
                <Table sx={{ mt: 2 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell>Ano</TableCell>
                            <TableCell>Cronogramas</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {premios.createdByUser.map((premio) => (
                            <TableRow key={premio.id}>
                                <TableCell>{premio.nome}</TableCell>
                                <TableCell>{premio.descricao}</TableCell>
                                <TableCell>{premio.ano}</TableCell>
                                <TableCell>
                                    {premio.cronogramas?.map((c, i) => (
                                        <div key={i}>
                                            {c.etapa} ({formatDate(c.dataInicio)} a {formatDate(c.dataFim)})
                                        </div>
                                    ))}
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(premio)} disabled={!isAdmin}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(premio.id)} disabled={!isAdmin}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Seção Outros Prêmios */}
                <Typography variant="h5" sx={{ mt: 4 }}>
                    Outros Prêmios
                </Typography>
                <Table sx={{ mt: 2 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell>Ano</TableCell>
                            <TableCell>Cronogramas</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {premios.createdByOthers.map((premio) => (
                            <TableRow key={premio.id}>
                                <TableCell>{premio.nome}</TableCell>
                                <TableCell>{premio.descricao}</TableCell>
                                <TableCell>{premio.ano}</TableCell>
                                <TableCell>
                                    {premio.cronogramas?.map((c, i) => (
                                        <div key={i}>
                                            {c.etapa} ({formatDate(c.dataInicio)} a {formatDate(c.dataFim)})
                                        </div>
                                    ))}
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(premio)} disabled={!isAdmin}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(premio.id)} disabled={!isAdmin}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editId ? 'Editar Prêmio' : 'Novo Prêmio'}</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Nome"
                            name="nome"
                            fullWidth
                            margin="normal"
                            value={formData.nome}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Descrição"
                            name="descricao"
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                            value={formData.descricao}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Ano"
                            name="ano"
                            type="number"
                            fullWidth
                            margin="normal"
                            value={formData.ano}
                            onChange={handleChange}
                            required
                            inputProps={{ min: 2000, max: 2100 }}
                        />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Cronogramas
                        </Typography>
                        {formData.cronogramas.map((cronograma, index) => (
                            <Box key={index} sx={{ mb: 2, border: '1px solid #ccc', p: 2 }}>
                                <TextField
                                    label="Data de Início"
                                    type="date"
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    value={cronograma.dataInicio}
                                    onChange={(e) => handleChange(e, index, 'dataInicio')}
                                    required
                                />
                                <TextField
                                    label="Etapa"
                                    fullWidth
                                    margin="normal"
                                    value={cronograma.etapa}
                                    onChange={(e) => handleChange(e, index, 'etapa')}
                                    required
                                />
                                <TextField
                                    label="Data de Fim"
                                    type="date"
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    value={cronograma.dataFim}
                                    onChange={(e) => handleChange(e, index, 'dataFim')}
                                    required
                                />
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => removeCronograma(index)}
                                    sx={{ mt: 1 }}
                                >
                                    Remover Cronograma
                                </Button>
                            </Box>
                        ))}
                        <Button variant="outlined" onClick={addCronograma} sx={{ mb: 2 }}>
                            Adicionar Cronograma
                        </Button>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button type="submit" variant="contained" onClick={handleSubmit} disabled={!isAdmin}>
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CrudPremioView;