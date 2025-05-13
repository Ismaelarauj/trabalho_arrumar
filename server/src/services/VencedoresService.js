import { Projeto } from '../models/Projeto.js';
import { Avaliacao } from '../models/Avaliacao.js';
import { Autor } from '../models/Autor.js';
import { Premio } from '../models/Premio.js';
import { Op } from 'sequelize';

export class VencedoresService {
    async getAll() {
        try {
            const projetos = await Projeto.findAll({
                include: [
                    { model: Autor, as: 'Autor' },
                    { model: Autor, as: 'Coautores' },
                    { model: Premio },
                    {
                        model: Avaliacao,
                        required: true,
                        as: 'Avaliacoes',
                        attributes: ['nota']
                    }
                ],
                where: {
                    status: 'avaliado'
                },
                order: [[{ model: Avaliacao, as: 'Avaliacoes' }, 'nota', 'DESC']]
            });
            console.log('Projetos vencedores:', JSON.stringify(projetos, null, 2)); // Log para depuração
            return projetos;
        } catch (error) {
            console.error('Erro ao buscar vencedores:', error);
            throw error;
        }
    }
}