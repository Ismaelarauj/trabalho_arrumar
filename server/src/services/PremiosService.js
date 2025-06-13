export class PremiosService {
    constructor({ Premio, Cronograma, Projeto, Avaliacao, Usuario }) {
        this.Premio = Premio;
        this.Cronograma = Cronograma;
        this.Projeto = Projeto;
        this.Avaliacao = Avaliacao;
        this.Usuario = Usuario;
    }
    async getAll(filterByCreator = false, userId = null) {
        let whereClause = {};
        if (filterByCreator && userId) {
            whereClause = { criadorId: userId }; // Assumindo que há um campo criadorId no modelo Premio
        }
        return await this.Premio.findAll({ where: whereClause });
    }

    async getAll() {
        return await this.Premio.findAll({
            include: [
                { model: this.Cronograma, as: 'cronogramas' },
                {
                    model: this.Projeto,
                    as: 'projetos',
                    include: [
                        { model: this.Avaliacao, as: 'avaliacoes' },
                        { model: this.Usuario, as: 'Autor' },
                        { model: this.Usuario, as: 'Coautores', through: { attributes: [] } }
                    ]
                }
            ]
        });
    }

    async getById(id) {
        const premio = await this.Premio.findByPk(id, {
            include: [
                { model: this.Cronograma, as: 'cronogramas' },
                {
                    model: this.Projeto,
                    as: 'projetos',
                    include: [
                        { model: this.Avaliacao, as: 'avaliacoes' },
                        { model: this.Usuario, as: 'Autor' },
                        { model: this.Usuario, as: 'Coautores', through: { attributes: [] } }
                    ]
                }
            ]
        });
        if (!premio) throw new Error('Prêmio não encontrado');
        return premio;
    }

    async create(data) {
        const { cronogramas, ...premioData } = data;
        const premio = await this.Premio.create(premioData);
        if (cronogramas && cronogramas.length > 0) {
            await this.Cronograma.bulkCreate(cronogramas.map(c => ({ ...c, premioId: premio.id })));
        }
        return await this.getById(premio.id);
    }

    async update(id, data) {
        const { cronogramas, ...premioData } = data;
        const premio = await this.Premio.findByPk(id);
        if (!premio) throw new Error('Prêmio não encontrado');
        await premio.update(premioData);
        if (cronogramas) {
            await this.Cronograma.destroy({ where: { premioId: id } });
            if (cronogramas.length > 0) {
                await this.Cronograma.bulkCreate(cronogramas.map(c => ({ ...c, premioId: id })));
            }
        }
        return await this.getById(id);
    }

    async delete(id) {
        const premio = await this.Premio.findByPk(id);
        if (!premio) throw new Error('Prêmio não encontrado');
        await this.Cronograma.destroy({ where: { premioId: id } });
        await this.Projeto.destroy({ where: { premioId: id } });
        await premio.destroy();
    }
}