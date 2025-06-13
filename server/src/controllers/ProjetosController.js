import express from 'express';
import { autenticar } from '../middlewares/auth.js';
import { ProjetosService } from '../services/ProjetosService.js'; // Importando ProjetosService
export class ProjetosController {
    constructor(allModels) {
        this.router = express.Router();
        const { Projeto, Usuario, Premio, Avaliacao } = allModels;
        this.projetosService = new ProjetosService({ Projeto, Usuario, Premio, Avaliacao });

        this.router.post('/enviar', autenticar(['autor']), this.create.bind(this));
        this.router.get('/', autenticar(['admin', 'autor', 'avaliador']), this.getAll.bind(this));
        this.router.get('/:id', autenticar(['admin', 'autor', 'avaliador']), this.getById.bind(this));
        this.router.put('/:id', autenticar(['admin', 'autor']), this.update.bind(this));
        this.router.delete('/:id', autenticar(['admin', 'autor']), this.delete.bind(this));
    }

    async create(req, res) {
        try {
            const usuarioLogado = req.usuario;
            const data = { ...req.body, autorId: usuarioLogado.id };
            const projeto = await this.projetosService.create(data);
            res.status(201).json(projeto);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar projeto: ' + error.message });
        }
    }

    async getAll(req, res) {
        try {
            const usuarioLogado = req.usuario;
            const whereClause = usuarioLogado.tipo === 'autor' ? { autorId: usuarioLogado.id } : {};
            const projetos = await this.projetosService.getAll(whereClause);
            res.json(projetos);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar projetos: ' + error.message });
        }
    }

    async getById(req, res) {
        try {
            const projeto = await this.projetosService.getById(req.params.id);
            const usuarioLogado = req.usuario;
            if (usuarioLogado.tipo !== 'admin' && projeto.autorId !== usuarioLogado.id) {
                return res.status(403).json({ error: 'Acesso negado' });
            }
            res.json(projeto);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar projeto: ' + error.message });
        }
    }

    async update(req, res) {
        try {
            const projeto = await this.projetosService.getById(req.params.id);
            const usuarioLogado = req.usuario;
            if (usuarioLogado.tipo !== 'admin' && projeto.autorId !== usuarioLogado.id) {
                return res.status(403).json({ error: 'Acesso negado' });
            }
            const projetoAtualizado = await this.projetosService.update(req.params.id, req.body);
            res.json(projetoAtualizado);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar projeto: ' + error.message });
        }
    }

    async delete(req, res) {
        try {
            const projeto = await this.projetosService.getById(req.params.id);
            const usuarioLogado = req.usuario;
            if (usuarioLogado.tipo !== 'admin' && projeto.autorId !== usuarioLogado.id) {
                return res.status(403).json({ error: 'Acesso negado' });
            }
            await this.projetosService.delete(req.params.id);
            res.json({ message: 'Projeto excluído com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao excluir projeto: ' + error.message });
        }
    }
}