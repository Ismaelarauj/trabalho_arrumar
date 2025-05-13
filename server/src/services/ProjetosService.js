import { Projeto } from '../models/Projeto.js';
import { Autor } from '../models/Autor.js';
import { Premio } from '../models/Premio.js';

export class ProjetosService {
    async getAll() {
        return await Projeto.findAll({
            include: [
                { model: Autor, as: 'Autor' },
                { model: Premio },
                { model: Autor, as: 'Coautores' }
            ]
        });
    }

    async getById(id) {
        const projeto = await Projeto.findByPk(id, {
            include: [
                { model: Autor, as: 'Autor' },
                { model: Premio },
                { model: Autor, as: 'Coautores' }
            ]
        });
        if (!projeto) throw new Error('Projeto não encontrado');
        return projeto;
    }

    async create(data) {
        try {
            const { coautores, ...projetoData } = data;

            // Validações manuais
            if (!projetoData.premioId) throw new Error('O campo prêmio é obrigatório');
            if (!projetoData.autorId) throw new Error('O campo autor é obrigatório');
            if (!projetoData.titulo || projetoData.titulo.trim() === '') throw new Error('O campo título é obrigatório');
            if (!projetoData.resumo || projetoData.resumo.trim() === '') throw new Error('O campo resumo é obrigatório');
            if (!projetoData.areaTematica || projetoData.areaTematica.trim() === '') throw new Error('O campo área temática é obrigatório');
            if (!projetoData.dataEnvio || isNaN(new Date(projetoData.dataEnvio).getTime())) throw new Error('O campo data de envio é inválido');

            // Verificar se premioId e autorId existem
            const premio = await Premio.findByPk(projetoData.premioId);
            if (!premio) throw new Error('Prêmio não encontrado');
            const autor = await Autor.findByPk(projetoData.autorId);
            if (!autor) throw new Error('Autor não encontrado');

            // Verificar coautores, se fornecidos
            if (coautores && coautores.length > 0) {
                const coautoresExistentes = await Autor.findAll({ where: { id: coautores } });
                if (coautoresExistentes.length !== coautores.length) {
                    throw new Error('Um ou mais coautores não encontrados');
                }
            }

            // Criar projeto
            const projeto = await Projeto.create(projetoData);

            // Associar coautores
            if (coautores && coautores.length > 0) {
                await projeto.addCoautores(coautores);
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
            const projeto = await Projeto.findByPk(id);
            if (!projeto) throw new Error('Projeto não encontrado');

            // Validações manuais
            if (projetoData.premioId && !await Premio.findByPk(projetoData.premioId)) {
                throw new Error('Prêmio não encontrado');
            }
            if (projetoData.autorId && !await Autor.findByPk(projetoData.autorId)) {
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

            // Verificar coautores
            if (coautores) {
                const coautoresExistentes = await Autor.findAll({ where: { id: coautores } });
                if (coautoresExistentes.length !== coautores.length) {
                    throw new Error('Um ou mais coautores não encontrados');
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
        const projeto = await Projeto.findByPk(id);
        if (!projeto) throw new Error('Projeto não encontrado');
        await projeto.destroy();
    }
}