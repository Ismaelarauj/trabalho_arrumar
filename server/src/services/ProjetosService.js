import ProjetoDTO from '../dtos/ProjetoDTO.js';

console.log('Carregando ProjetosService.js');

export class ProjetosService {
    constructor({ Projeto, Usuario, Premio, Avaliacao }) {
        this.Projeto = Projeto;
        this.Usuario = Usuario;
        this.Premio = Premio;
        this.Avaliacao = Avaliacao;
    }

    async create(data) {
        try {
            console.log('Dados recebidos para criar projeto:', data);
            const { premioId, autorId, coautores, titulo, resumo, areaTematica, dataEnvio, arquivoPath } = data;

            const autor = await this.Usuario.findByPk(autorId);
            console.log('Autor encontrado:', autor ? { id: autor.id, tipo: autor.tipo } : 'Não encontrado');
            if (!autor || autor.tipo !== 'autor') {
                throw new Error('Autor inválido');
            }

            const premio = await this.Premio.findByPk(premioId);
            console.log('Prêmio encontrado:', premio ? { id: premio.id } : 'Não encontrado');
            if (!premio) {
                throw new Error('Prêmio não encontrado');
            }

            const projetoData = {
                premioId,
                autorId,
                titulo,
                resumo,
                areaTematica,
                dataEnvio,
                arquivoPath,
                status: 'pendente'
            };

            const projeto = await this.Projeto.create(projetoData);
            console.log('Projeto criado:', projeto.toJSON());

            if (coautores && coautores.length > 0) {
                const coautorRecords = await Promise.all(coautores.map(async (coautorId) => {
                    const coautor = await this.Usuario.findByPk(coautorId);
                    if (!coautor || coautor.tipo !== 'autor') {
                        throw new Error(`Coautor inválido: ${coautorId}`);
                    }
                    return coautor;
                }));
                await projeto.setCoautores(coautorRecords);
                console.log('Coautores associados:', coautorRecords.map(c => c.id));
            }

            const projetoCompleto = await this.getById(projeto.id);
            return new ProjetoDTO(projetoCompleto);
        } catch (error) {
            console.error('Erro ao criar projeto:', error.message);
            throw error;
        }
    }

    async getById(id) {
        const projeto = await this.Projeto.findByPk(id, {
            include: [
                { model: this.Premio, as: 'Premio' },
                { model: this.Usuario, as: 'Autor' },
                { model: this.Usuario, as: 'Coautores', through: { attributes: [] } },
                {
                    model: this.Avaliacao,
                    as: 'avaliacoes',
                    include: [{ model: this.Usuario, as: 'Avaliador' }]
                }
            ]
        });
        if (!projeto) throw new Error('Projeto não encontrado');
        return projeto;
    }

    async getAll(whereClause = {}) {
        const projetos = await this.Projeto.findAll({
            where: whereClause,
            include: [
                { model: this.Premio, as: 'Premio' },
                { model: this.Usuario, as: 'Autor' },
                { model: this.Usuario, as: 'Coautores', through: { attributes: [] } },
                {
                    model: this.Avaliacao,
                    as: 'avaliacoes',
                    include: [{ model: this.Usuario, as: 'Avaliador' }]
                }
            ]
        });
        return projetos.map(projeto => new ProjetoDTO(projeto));
    }

    async update(id, data) {
        const projeto = await this.Projeto.findByPk(id);
        if (!projeto) throw new Error('Projeto não encontrado');

        const { coautores, ...projetoData } = data;
        await projeto.update(projetoData);

        if (coautores) {
            const coautorRecords = await Promise.all(coautores.map(async (coautorId) => {
                const coautor = await this.Usuario.findByPk(coautorId);
                if (!coautor || coautor.tipo !== 'autor') {
                    throw new Error(`Coautor inválido: ${coautorId}`);
                }
                return coautor;
            }));
            await projeto.setCoautores(coautorRecords);
        }

        const projetoAtualizado = await this.getById(id);
        return new ProjetoDTO(projetoAtualizado);
    }

    async delete(id) {
        const projeto = await this.Projeto.findByPk(id);
        if (!projeto) throw new Error('Projeto não encontrado');
        await projeto.destroy();
        return { message: 'Projeto excluído com sucesso' };
    }
}