export class ProjetosService {
    constructor({ Projeto, Usuario, Premio }) {
        this.Projeto = Projeto;
        this.Usuario = Usuario;
        this.Premio = Premio;
    }

    async getAll() {
        return await this.Projeto.findAll({
            include: [
                { model: this.Usuario, as: 'Autor' },
                { model: this.Premio, as: 'Premio' }, // Adicionado o alias 'Premio' conforme definido no belongsTo
                { model: this.Usuario, as: 'Coautores', through: { attributes: [] } }
            ]
        });
    }

    async getById(id) {
        const projeto = await this.Projeto.findByPk(id, {
            include: [
                { model: this.Usuario, as: 'Autor' },
                { model: this.Premio, as: 'Premio' }, // Adicionado o alias 'Premio' conforme definido no belongsTo
                { model: this.Usuario, as: 'Coautores', through: { attributes: [] } }
            ]
        });
        if (!projeto) throw new Error('Projeto não encontrado');
        return projeto;
    }

    async create(data) {
        try {
            const { coautores, ...projetoData } = data;

            if (!projetoData.premioId) throw new Error('O campo prêmio é obrigatório');
            if (!projetoData.autorId) throw new Error('O campo autor é obrigatório');
            if (!projetoData.titulo || projetoData.titulo.trim() === '') throw new Error('O campo título é obrigatório');
            if (!projetoData.resumo || projetoData.resumo.trim() === '') throw new Error('O campo resumo é obrigatório');
            if (!projetoData.areaTematica || projetoData.areaTematica.trim() === '') throw new Error('O campo área temática é obrigatório');
            if (!projetoData.dataEnvio || isNaN(new Date(projetoData.dataEnvio).getTime())) throw new Error('O campo data de envio é inválido');

            const premio = await this.Premio.findByPk(projetoData.premioId);
            if (!premio) throw new Error('Prêmio não encontrado');
            const autor = await this.Usuario.findByPk(projetoData.autorId);
            if (!autor || autor.tipo !== 'autor') throw new Error('Autor inválido');

            if (coautores && coautores.length > 0) {
                const coautoresExistentes = await this.Usuario.findAll({ where: { id: coautores, tipo: 'autor' } });
                if (coautoresExistentes.length !== coautores.length) {
                    throw new Error('Um ou mais coautores não encontrados ou inválidos');
                }
            }

            const projeto = await this.Projeto.create(projetoData);

            if (coautores && coautores.length > 0) {
                await projeto.setCoautores(coautores);
            }

            return await this.getById(projeto.id);
        } catch (error) {
            console.error('Erro ao criar projeto:', error.message);
            throw error;
        }
    }

    async update(id, data) {
        try {
            const { coautores, ...projetoData } = data;
            const projeto = await this.Projeto.findByPk(id);
            if (!projeto) throw new Error('Projeto não encontrado');

            if (projetoData.premioId && !await this.Premio.findByPk(projetoData.premioId)) {
                throw new Error('Prêmio não encontrado');
            }
            if (projetoData.autorId && !await this.Usuario.findByPk(projetoData.autorId)) {
                throw new Error('Autor não encontrado');
            }
            if (projetoData.titulo && projetoData.titulo.trim() === '') {
                throw new Error('O campo título não pode ser vazio');
            }
            if (projetoData.resumo && projetoData.resumo.trim() === '') {
                throw new Error('O campo resumo não pode ser vazio');
            }
            if (projetoData.areaTematica && projetoData.areaTematica.trim() === '') {
                throw new Error('O campo área temática não pode ser vazio');
            }
            if (projetoData.dataEnvio && isNaN(new Date(projetoData.dataEnvio).getTime())) {
                throw new Error('O campo data de envio é inválido');
            }

            if (coautores && coautores.length > 0) {
                const coautoresExistentes = await this.Usuario.findAll({ where: { id: coautores, tipo: 'autor' } });
                if (coautoresExistentes.length !== coautores.length) {
                    throw new Error('Um ou mais coautores não encontrados ou inválidos');
                }
            }

            await projeto.update(projetoData);
            if (coautores) {
                await projeto.setCoautores(coautores);
            }
            return await this.getById(id);
        } catch (error) {
            console.error('Erro ao atualizar projeto:', error.message);
            throw error;
        }
    }

    async delete(id) {
        const projeto = await this.Projeto.findByPk(id);
        if (!projeto) throw new Error('Projeto não encontrado');
        await projeto.destroy();
    }
}