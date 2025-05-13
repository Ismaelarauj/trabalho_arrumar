import { Premio } from '../models/Premio.js';
import { Cronograma } from '../models/Cronograma.js';

export class PremiosService {
    async getAll() {
        return await Premio.findAll({ include: [Cronograma] });
    }

    async getById(id) {
        const premio = await Premio.findByPk(id, { include: [Cronograma] });
        if (!premio) throw new Error('Prêmio não encontrado');
        return premio;
    }

    async create(data) {
        const { cronogramas, ...premioData } = data;
        const premio = await Premio.create(premioData);
        if (cronogramas && cronogramas.length > 0) {
            await Cronograma.bulkCreate(cronogramas.map(c => ({ ...c, premioId: premio.id })));
        }
        return await this.getById(premio.id);
    }

    async update(id, data) {
        const { cronogramas, ...premioData } = data;
        const premio = await Premio.findByPk(id);
        if (!premio) throw new Error('Prêmio não encontrado');
        await premio.update(premioData);
        if (cronogramas) {
            await Cronograma.destroy({ where: { premioId: id } });
            await Cronograma.bulkCreate(cronogramas.map(c => ({ ...c, premioId: id })));
        }
        return await this.getById(id);
    }

    async delete(id) {
        const premio = await Premio.findByPk(id);
        if (!premio) throw new Error('Prêmio não encontrado');
        await premio.destroy();
    }
}