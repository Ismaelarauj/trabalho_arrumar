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
    MenuItem
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const CrudUsuarioView = ({
                             usuarios,
                             open,
                             editId,
                             formData,
                             token,
                             currentUserId,
                             isAdmin,
                             isCadastroRoute,
                             handleOpen,
                             handleClose,
                             handleChange,
                             handleSubmit,
                             handleDelete
                         }) => {
    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {isCadastroRoute ? 'Cadastro de Novo Usuário' : 'Gerenciamento de Usuários'}
                </Typography>
                {!isCadastroRoute && isAdmin && (
                    <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpen()}>
                        Novo Usuário
                    </Button>
                )}
                {token && !isCadastroRoute && (
                    <Table sx={{ mt: 2 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>CPF</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {usuarios.map((usuario) => (
                                <TableRow key={usuario.id}>
                                    <TableCell>{usuario.nome}</TableCell>
                                    <TableCell>{usuario.cpf}</TableCell>
                                    <TableCell>{usuario.tipo}</TableCell>
                                    <TableCell>{usuario.email}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleOpen(usuario)} disabled={!isAdmin && currentUserId !== usuario.id}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(usuario.id)} disabled={!isAdmin}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Box>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editId ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            select
                            label="Tipo"
                            name="tipo"
                            fullWidth
                            margin="normal"
                            value={formData.tipo}
                            onChange={handleChange}
                            required
                            disabled={editId !== null && !isAdmin}
                        >
                            <MenuItem value="autor">Autor</MenuItem>
                            <MenuItem value="avaliador">Avaliador</MenuItem>
                        </TextField>
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
                            label="CPF"
                            name="cpf"
                            fullWidth
                            margin="normal"
                            value={formData.cpf}
                            onChange={handleChange}
                            required
                            disabled={editId && !isAdmin}
                            inputProps={{ maxLength: 11, pattern: "\\d{11}" }}
                            helperText="Digite apenas os 11 dígitos do CPF"
                        />
                        <TextField
                            label="Data de Nascimento"
                            name="dataNascimento"
                            type="date"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            value={formData.dataNascimento}
                            onChange={handleChange}
                            required
                        />
                        {formData.tipo === 'autor' && (
                            <TextField
                                label="Instituição"
                                name="instituicao"
                                fullWidth
                                margin="normal"
                                value={formData.instituicao}
                                onChange={handleChange}
                                required
                            />
                        )}
                        {formData.tipo === 'avaliador' && (
                            <TextField
                                label="Especialidade"
                                name="especialidade"
                                fullWidth
                                margin="normal"
                                value={formData.especialidade}
                                onChange={handleChange}
                                required
                            />
                        )}
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            fullWidth
                            margin="normal"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={editId && !isAdmin}
                        />
                        <TextField
                            label="Senha"
                            name="senha"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={formData.senha}
                            onChange={handleChange}
                            required={!editId}
                        />
                        <TextField
                            label="Telefone"
                            name="telefone"
                            fullWidth
                            margin="normal"
                            value={formData.telefone}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Rua"
                            name="rua"
                            fullWidth
                            margin="normal"
                            value={formData.rua}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Cidade"
                            name="cidade"
                            fullWidth
                            margin="normal"
                            value={formData.cidade}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Estado"
                            name="estado"
                            fullWidth
                            margin="normal"
                            value={formData.estado}
                            onChange={handleChange}
                        />
                        <TextField
                            label="CEP"
                            name="cep"
                            fullWidth
                            margin="normal"
                            value={formData.cep}
                            onChange={handleChange}
                            inputProps={{ maxLength: 8, pattern: "\\d{8}" }}
                            helperText="Digite apenas os 8 dígitos do CEP"
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button type="submit" variant="contained" onClick={handleSubmit}>
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CrudUsuarioView;