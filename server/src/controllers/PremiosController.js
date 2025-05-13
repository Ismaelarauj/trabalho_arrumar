import express from 'express';
import { PremiosService } from '../services/PremiosService.js';

export class PremiosController {
    constructor(premiosService = new PremiosService()) {
        this.premiosService = premiosService;
        this.router = express.Router();
        this.router.get('/', this.getAll.bind(this));
        this.router.get('/:id', this.getById.bind(this));
        this.router.post('/', this.create.bind(this));
        this.router.put('/:id', this.update.bind(this));
        this.router.delete('/:id', this.delete.bind(this));
    }

    async getAll(req, res) {
        try {
            const premios = await this.premiosService.getAll();
            res.json(premios);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const premio = await this.premiosService.getById(req.params.id);
            if (!premio) return res.status(404).json({ error: 'Prêmio não encontrado' });
            res.json(premio);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const premio = await this.premiosService.create(req.body);
            res.status(201).json(premio);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const premio = await this.premiosService.update(req.params.id, req.body);
            res.json(premio);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            await this.premiosService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}