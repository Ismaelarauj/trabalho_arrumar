import { UsuariosService } from '../services/UsuariosService.js';

export class UsuariosController {
    constructor({ Usuario, Contato, Endereco }) {
        this.usuarioService = new UsuariosService({ Usuario, Contato, Endereco });
    }

    async login(req, res) {
        try {
            const { email, senha } = req.body;
            const { usuario } = await this.usuarioService.login({ email, senha });
            req.session.user = {
                id: usuario.id,
                email: usuario.email,
                tipo: usuario.tipo,
            };
            req.session.save((err) => {
                if (err) return res.status(500).json({ error: 'Erro ao salvar sessão' });
                res.json({ user: req.session.user });
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao fazer login: ' + error.message });
        }
    }

    async checkAuth(req, res) {
        try {
            if (!req.session.user || typeof req.session.user !== 'object') {
                return res.status(401).json({ error: 'Não autenticado' });
            }
            const usuario = await this.usuarioService.getById(req.session.user.id);
            res.json({ user: { id: usuario.id, email: usuario.email, tipo: usuario.tipo } });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao verificar autenticação: ' + error.message });
        }
    }

    async getAll(req, res) {
        try {
            const usuarioLogado = req.session.user;
            if (!['admin'].includes(usuarioLogado.tipo)) {
                return res.status(403).json({ error: 'Apenas administradores podem listar usuários' });
            }
            const usuarios = await this.usuarioService.getAll();
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar usuários: ' + error.message });
        }
    }

    async getById(req, res) {
        try {
            const usuario = await this.usuarioService.getById(req.params.id);
            const usuarioLogado = req.session.user;
            if (usuarioLogado.tipo !== 'admin' && usuarioLogado.id !== usuario.id) {
                return res.status(403).json({ error: 'Acesso negado' });
            }
            res.json(usuario);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar usuário: ' + error.message });
        }
    }

    async create(req, res) {
        try {
            if (req.body.tipo === 'admin') return res.status(403).json({ error: 'Cadastro de administrador não permitido' });
            const data = req.body;
            const errors = [];
            if (!data.nome) errors.push({ field: 'nome', message: 'O nome é obrigatório' });
            if (errors.length > 0) return res.status(400).json({ errors });
            const { usuario } = await this.usuarioService.create(data);
            res.status(201).json(usuario);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar usuário: ' + error.message });
        }
    }

    async update(req, res) {
        try {
            const usuario = await this.usuarioService.getById(req.params.id);
            const usuarioLogado = req.session.user;
            if (usuarioLogado.tipo !== 'admin' && usuarioLogado.id !== usuario.id) {
                const allowedFields = ['senha'];
                const data = {};
                for (let key in req.body) if (allowedFields.includes(key)) data[key] = req.body[key];
                if (Object.keys(data).length === 0) return res.status(403).json({ error: 'Apenas a senha pode ser editada' });
                await usuario.update(data);
            } else {
                await usuario.update(req.body);
            }
            res.json(await this.usuarioService.getById(req.params.id));
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar usuário: ' + error.message });
        }
    }

    async delete(req, res) {
        try {
            const usuario = await this.usuarioService.getById(req.params.id);
            const usuarioLogado = req.session.user;
            if (usuarioLogado.tipo !== 'admin') return res.status(403).json({ error: 'Apenas administradores podem excluir usuários' });
            if (usuarioLogado.id === usuario.id) return res.status(403).json({ error: 'Você não pode excluir sua própria conta' });
            await this.usuarioService.delete(req.params.id);
            res.json({ message: 'Usuário excluído com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao excluir usuário: ' + error.message });
        }
    }
}