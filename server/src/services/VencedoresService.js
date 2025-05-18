import { Op } from 'sequelize';

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
                    {
                        model: this.Avaliacao,
                        as: 'avaliacoes',
                        required: true,
                        where: { nota: { [Op.gte]: 6 } },
                        attributes: ['nota']
                    }
                ],
                where: {
                    status: 'avaliado'
                },
                order: [
                    [{ model: this.Avaliacao, as: 'avaliacoes' }, 'nota', 'DESC'] // Corrigido para usar o alias
                ]
            });
            console.log('Projetos vencedores:', JSON.stringify(projetos, null, 2)); // Log para depuração
            return projetos;
        } catch (error) {
            console.error('Erro ao buscar vencedores:', error);
            throw error;
        }
    }
}