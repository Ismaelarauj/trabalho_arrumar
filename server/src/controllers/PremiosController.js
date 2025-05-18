import express from 'express';
import { autenticar } from '../middlewares/auth.js';

export class PremiosController {
    constructor({ Premio, Cronograma, Projeto, Avaliacao, Usuario }) {
        this.Premio = Premio;
        this.Cronograma = Cronograma;
        this.Projeto = Projeto;
        this.Avaliacao = Avaliacao;
        this.Usuario = Usuario;
        this.router = express.Router();
        this.router.get('/', this.listar.bind(this));
        this.router.post('/', autenticar(['admin']), this.criar.bind(this));
        this.router.put('/:id', autenticar(['admin']), this.atualizar.bind(this));
        this.router.delete('/:id', autenticar(['admin']), this.excluir.bind(this));
        this.router.get('/vencedores', this.listarVencedores.bind(this));
    }

    async listar(req, res) {
        try {
            const premios = await this.Premio.findAll({
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

            res.json(premios); // Retorna todos os prêmios, sem filtros
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar prêmios: ' + error.message });
        }
    }

    async criar(req, res) {
        try {
            if (req.usuario.role !== 'admin') {
                return res.status(403).json({ error: 'Apenas administradores podem criar prêmios' });
            }
            const { nome, ano, descricao, cronogramas } = req.body;

            if (!nome || !ano || !descricao) {
                return res.status(400).json({ error: 'Nome, ano e descrição são obrigatórios' });
            }

            const premio = await this.Premio.create({ nome, ano, descricao });

            if (cronogramas && cronogramas.length > 0) {
                const cronogramasData = cronogramas.map(c => ({
                    ...c,
                    premioId: premio.id
                }));
                await this.Cronograma.bulkCreate(cronogramasData);
            }

            const premioCompleto = await this.Premio.findByPk(premio.id, {
                include: [{ model: this.Cronograma, as: 'cronogramas' }]
            });

            res.status(201).json(premioCompleto);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar prêmio: ' + error.message });
        }
    }

    async atualizar(req, res) {
        try {
            if (req.usuario.role !== 'admin') {
                return res.status(403).json({ error: 'Apenas administradores podem atualizar prêmios' });
            }

            const { id } = req.params;
            const { nome, ano, descricao, cronogramas } = req.body;

            if (!nome || !ano || !descricao) {
                return res.status(400).json({ error: 'Nome, ano e descrição são obrigatórios' });
            }

            const premio = await this.Premio.findByPk(id);
            if (!premio) {
                return res.status(404).json({ error: 'Prêmio não encontrado' });
            }

            await premio.update({ nome, ano, descricao });

            if (cronogramas) {
                await this.Cronograma.destroy({ where: { premioId: id } });
                if (cronogramas.length > 0) {
                    const cronogramasData = cronogramas.map(c => ({
                        ...c,
                        premioId: id
                    }));
                    await this.Cronograma.bulkCreate(cronogramasData);
                }
            }

            const premioAtualizado = await this.Premio.findByPk(id, {
                include: [{ model: this.Cronograma, as: 'cronogramas' }]
            });

            res.json(premioAtualizado);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar prêmio: ' + error.message });
        }
    }

    async excluir(req, res) {
        try {
            if (req.usuario.role !== 'admin') {
                return res.status(403).json({ error: 'Apenas administradores podem excluir prêmios' });
            }

            const { id } = req.params;
            const premio = await this.Premio.findByPk(id);
            if (!premio) {
                return res.status(404).json({ error: 'Prêmio não encontrado' });
            }

            await this.Cronograma.destroy({ where: { premioId: id } });
            await this.Projeto.destroy({ where: { premioId: id } });

            await premio.destroy();
            res.json({ message: 'Prêmio excluído com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao excluir prêmio: ' + error.message });
        }
    }

    async listarVencedores(req, res) {
        try {
            const premios = await this.Premio.findAll({
                include: [{
                    model: this.Projeto,
                    as: 'projetos',
                    include: [
                        { model: this.Avaliacao, as: 'avaliacoes' },
                        { model: this.Usuario, as: 'Autor' },
                        { model: this.Usuario, as: 'Coautores', through: { attributes: [] } }
                    ]
                }]
            });

            const vencedores = premios.map(premio => {
                const projetosAvaliados = premio.projetos.filter(projeto => projeto.status === 'avaliado');
                if (projetosAvaliados.length === 0) return null;

                const projetoVencedor = projetosAvaliados.reduce((vencedor, projeto) => {
                    const mediaNota = projeto.avaliacoes.reduce((soma, av) => soma + av.nota, 0) / projeto.avaliacoes.length;
                    if (!vencedor || mediaNota > vencedor.mediaNota) {
                        return { ...projeto.dataValues, mediaNota };
                    }
                    return vencedor;
                }, null);

                return {
                    premio: { id: premio.id, nome: premio.nome, ano: premio.ano },
                    projetoVencedor: projetoVencedor ? {
                        id: projetoVencedor.id,
                        titulo: projetoVencedor.titulo,
                        mediaNota: projetoVencedor.mediaNota
                    } : null
                };
            }).filter(v => v && v.projetoVencedor);

            res.json(vencedores);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar vencedores: ' + error.message });
        }
    }
}

export default PremiosController;