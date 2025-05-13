import express from 'express';
import { AvaliacoesService } from '../services/AvaliacoesService.js';

export class AvaliacoesController {
    constructor(avaliacoesService = new AvaliacoesService()) {
        this.avaliacoesService = avaliacoesService;
        this.router = express.Router();
        this.router.get('/', this.getAll.bind(this));
        this.router.get('/:id', this.getById.bind(this));
        this.router.post('/', this.create.bind(this));
        this.router.put('/:id', this.update.bind(this));
        this.router.delete('/:id', this.delete.bind(this));
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
            const avaliacao = await this.avaliacoesService.create(req.body);
            res.status(201).json(avaliacao);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const avaliacao = await this.avaliacoesService.update(req.params.id, req.body);
            res.json(avaliacao);
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