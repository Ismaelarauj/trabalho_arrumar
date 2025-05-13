import express from 'express';
import { AvaliadoresService } from '../services/AvaliadoresService.js';

export class AvaliadoresController {
    constructor(avaliadoresService = new AvaliadoresService()) {
        this.avaliadoresService = avaliadoresService;
        this.router = express.Router();
        this.router.get('/', this.getAll.bind(this));
        this.router.get('/:id', this.getById.bind(this));
        this.router.post('/', this.create.bind(this));
        this.router.put('/:id', this.update.bind(this));
        this.router.delete('/:id', this.delete.bind(this));
    }

    async getAll(req, res) {
        try {
            const avaliadores = await this.avaliadoresService.getAll();
            res.json(avaliadores);
        } catch (error) {
            console.error('Erro ao listar avaliadores:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const avaliador = await this.avaliadoresService.getById(req.params.id);
            res.json(avaliador);
        } catch (error) {
            console.error('Erro ao buscar avaliador:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            console.log('POST /api/avaliadores - Dados recebidos:', req.body);
            const avaliador = await this.avaliadoresService.create(req.body);
            res.status(201).json(avaliador);
        } catch (error) {
            console.error('Erro ao criar avaliador:', error.message, error.stack);
            res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            console.log('PUT /api/avaliadores/:id - Dados recebidos:', req.body);
            const avaliador = await this.avaliadoresService.update(req.params.id, req.body);
            res.json(avaliador);
        } catch (error) {
            console.error('Erro ao atualizar avaliador:', error.message);
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            await this.avaliadoresService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            console.error('Erro ao deletar avaliador:', error.message);
            res.status(400).json({ error: error.message });
        }
    }
}