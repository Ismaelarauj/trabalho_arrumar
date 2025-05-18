import express from 'express';
import { ProjetosService } from '../services/ProjetosService.js';
import autenticar from '../middlewares/auth.js';

export class ProjetosController {
    constructor(projetosService = new ProjetosService()) {
        this.projetosService = projetosService;
        this.router = express.Router();
        this.router.get('/', this.getAll.bind(this));
        this.router.get('/:id', this.getById.bind(this));
        this.router.post('/', autenticar(['autor']), this.create.bind(this));
        this.router.put('/:id', autenticar(['autor']), this.update.bind(this));
        this.router.delete('/:id', autenticar(['admin']), this.delete.bind(this));
    }

    async getAll(req, res) {
        try {
            const projetos = await this.projetosService.getAll();
            res.json(projetos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const projeto = await this.projetosService.getById(req.params.id);
            if (!projeto) return res.status(404).json({ error: 'Projeto não encontrado' });
            res.json(projeto);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const projeto = await this.projetosService.create(req.body);
            res.status(201).json(projeto);
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const errors = error.errors.map(err => ({
                    field: err.path,
                    message: err.message
                }));
                res.status(400).json({ errors });
            } else {
                res.status(400).json({ error: error.message });
            }
        }
    }

    async update(req, res) {
        try {
            const projeto = await this.projetosService.update(req.params.id, req.body);
            res.json(projeto);
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const errors = error.errors.map(err => ({
                    field: err.path,
                    message: err.message
                }));
                res.status(400).json({ errors });
            } else {
                res.status(400).json({ error: error.message });
            }
        }
    }

    async delete(req, res) {
        try {
            await this.projetosService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}