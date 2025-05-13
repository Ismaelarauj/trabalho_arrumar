import express from 'express';
import { AutoresService } from '../services/AutoresService.js';

export class AutoresController {
    constructor(autoresService = new AutoresService()) {
        this.autoresService = autoresService;
        this.router = express.Router();
        this.router.get('/', this.getAll.bind(this));
        this.router.get('/:id', this.getById.bind(this));
        this.router.post('/', this.create.bind(this));
        this.router.put('/:id', this.update.bind(this));
        this.router.delete('/:id', this.delete.bind(this));
    }

    async getAll(req, res) {
        try {
            const autores = await this.autoresService.getAll();
            res.json(autores);
        } catch (error) {
            console.error('Erro ao listar autores:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const autor = await this.autoresService.getById(req.params.id);
            res.json(autor);
        } catch (error) {
            console.error('Erro ao buscar autor:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            console.log('POST /api/autores - Dados recebidos:', req.body);
            const autor = await this.autoresService.create(req.body);
            res.status(201).json(autor);
        } catch (error) {
            console.error('Erro ao criar autor:', error.message, error.stack);
            res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            console.log('PUT /api/autores/:id - Dados recebidos:', req.body);
            const autor = await this.autoresService.update(req.params.id, req.body);
            res.json(autor);
        } catch (error) {
            console.error('Erro ao atualizar autor:', error.message);
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            await this.autoresService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            console.error('Erro ao deletar autor:', error.message);
            res.status(400).json({ error: error.message });
        }
    }
}