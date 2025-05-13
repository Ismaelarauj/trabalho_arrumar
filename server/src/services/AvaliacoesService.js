import { Avaliacao } from '../models/Avaliacao.js';
import { Projeto } from '../models/Projeto.js';
import { Avaliador } from '../models/Avaliador.js';

export class AvaliacoesService {
    async getAll() {
        return await Avaliacao.findAll({
            include: [Projeto, Avaliador]
        });
    }

    async getById(id) {
        const avaliacao = await Avaliacao.findByPk(id, {
            include: [Projeto, Avaliador]
        });
        if (!avaliacao) throw new Error('Avaliação não encontrada');
        return avaliacao;
    }

    async create(data) {
        const avaliacao = await Avaliacao.create(data);
        await Projeto.update({ status: 'avaliado' }, { where: { id: data.projetoId } });
        return await this.getById(avaliacao.id);
    }

    async update(id, data) {
        const avaliacao = await Avaliacao.findByPk(id);
        if (!avaliacao) throw new Error('Avaliação não encontrada');
        await avaliacao.update(data);
        return await this.getById(id);
    }

    async delete(id) {
        const avaliacao = await Avaliacao.findByPk(id);
        if (!avaliacao) throw new Error('Avaliação não encontrada');
        await avaliacao.destroy();
    }
}