import { Op } from 'sequelize';
import ProjetoDTO from '../dtos/ProjetoDTO.js';

export class VencedoresService {
    constructor({ Projeto, Avaliacao, Usuario, Premio }) {
        this.Projeto = Projeto;
        this.Avaliacao = Avaliacao;
        this.Usuario = Usuario;
        this.Premio = Premio;
    }

    async getAll() {
        try {
            const projetos = await this.Projeto.findAll({
                include: [
                    { model: this.Usuario, as: 'Autor' },
                    { model: this.Usuario, as: 'Coautores', through: { attributes: [] } },
                    { model: this.Premio, as: 'Premio' },
                    { model: this.Avaliacao, as: 'avaliacoes', required: true, where: { nota: { [Op.gte]: 6 } } },
                ],
                where: { status: 'avaliado' },
                order: [[{ model: this.Avaliacao, as: 'avaliacoes' }, 'nota', 'DESC']],
            });
            return projetos.map(p => new ProjetoDTO(p));
        } catch (error) {
            throw error;
        }
    }
}