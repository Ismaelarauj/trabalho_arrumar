export class AvaliacoesService {
    constructor({ Avaliacao, Projeto, Usuario }) {
        this.Avaliacao = Avaliacao;
        this.Projeto = Projeto;
        this.Usuario = Usuario;
    }

    async getAll() {
        return await this.Avaliacao.findAll({
            include: [
                { model: this.Projeto, as: 'Projeto' },
                { model: this.Usuario, as: 'Avaliador' },
            ],
        });
    }

    async getById(id) {
        const avaliacao = await this.Avaliacao.findByPk(id, {
            include: [
                { model: this.Projeto, as: 'Projeto' },
                { model: this.Usuario, as: 'Avaliador' },
            ],
        });
        if (!avaliacao) throw new Error('Avaliação não encontrada');
        return avaliacao;
    }

    async create(data) {
        const avaliacao = await this.Avaliacao.create(data);
        await this.Projeto.update({ status: 'avaliado' }, { where: { id: data.projetoId } });
        return await this.getById(avaliacao.id);
    }

    async update(id, data) {
        const avaliacao = await this.Avaliacao.findByPk(id);
        if (!avaliacao) throw new Error('Avaliação não encontrada');
        await avaliacao.update(data);
        return await this.getById(id);
    }

    async delete(id) {
        const avaliacao = await this.Avaliacao.findByPk(id);
        if (!avaliacao) throw new Error('Avaliação não encontrada');
        await avaliacao.destroy();
    }
}