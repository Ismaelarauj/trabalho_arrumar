import express from 'express';
import { autenticar } from '../middlewares/auth.js';

export class AvaliacoesController {
    constructor(avaliacoesService) {
        this.avaliacoesService = avaliacoesService;
        this.router = express.Router();
        this.router.get('/', this.getAll.bind(this));
        this.router.get('/:id', this.getById.bind(this));
        this.router.post('/', autenticar(['avaliador']), this.create.bind(this));
        this.router.put('/:id', autenticar(['avaliador']), this.update.bind(this));
        this.router.delete('/:id', autenticar(['admin']), this.delete.bind(this));
    }

    async getAll(req, res) {
        try {
            const avaliacoes = await this.avaliacoesService.getAll();
            res.json(avaliacoes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const avaliacao = await this.avaliacoesService.getById(req.params.id);
            if (!avaliacao) return res.status(404).json({ error: 'Avaliação não encontrada' });
            res.json(avaliacao);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const usuarioLogado = req.usuario;
            const data = { ...req.body, avaliadorId: usuarioLogado.id };
            const projeto = await sequelize.models.Projeto.findByPk(data.projetoId);
            if (!projeto) return res.status(400).json({ error: 'Projeto não encontrado' });
            const avaliacao = await this.avaliacoesService.create(data);
            res.status(201).json(avaliacao);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const usuarioLogado = req.usuario;
            const avaliacao = await this.avaliacoesService.getById(req.params.id);
            if (!avaliacao) return res.status(404).json({ error: 'Avaliação não encontrada' });
            if (avaliacao.avaliadorId !== usuarioLogado.id) {
                return res.status(403).json({ error: 'Apenas o avaliador que criou a avaliação pode atualizá-la' });
            }
            const avaliacaoAtualizada = await this.avaliacoesService.update(req.params.id, req.body);
            res.json(avaliacaoAtualizada);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            await this.avaliacoesService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}