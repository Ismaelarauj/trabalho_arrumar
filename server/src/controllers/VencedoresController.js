import express from 'express';
import { VencedoresService } from '../services/VencedoresService.js';

export class VencedoresController {
    constructor(vencedoresService) {
        this.vencedoresService = vencedoresService;
        this.router = express.Router();
        this.router.get('/', this.getAll.bind(this));
    }

    async getAll(req, res) {
        try {
            const vencedores = await this.vencedoresService.getAll();
            res.json(vencedores);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}