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
        this.router.get('/', autenticar(['admin', 'autor', 'avaliador']), this.listar.bind(this));
        this.router.post('/', autenticar(['admin']), this.criar.bind(this));
        this.router.put('/:id', autenticar(['admin']), this.atualizar.bind(this));
        this.router.delete('/:id', autenticar(['admin']), this.excluir.bind(this));
        this.router.get('/vencedores', autenticar(['admin', 'autor', 'avaliador']), this.listarVencedores.bind(this));
    }

    async listar(req, res) {
        try {
            const usuarioLogado = req.usuario;
            const premios = await this.Premio.findAll({
                include: [
                    { model: this.Cronograma, as: 'cronogramas' },
                    {
                        model: this.Projeto,
                        as: 'projetos',
                        include: [
                            { model: this.Avaliacao, as: 'avaliacoes' },
                            { model: this.Usuario, as: 'Autor' },
                            { model: this.Usuario, as: 'Coautores', through: { attributes: [] } },
                        ],
                    },
                ],
            });
            // Separar prêmios criados pelo usuário logado dos demais
            const createdByUser = premios.filter(p => p.criadorId === usuarioLogado.id);
            const createdByOthers = premios.filter(p => p.criadorId !== usuarioLogado.id);
            res.json({ createdByUser, createdByOthers });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar prêmios: ' + error.message });
        }
    }
    async getAll(req, res) {
        try {
            const usuarioLogado = req.session.user;
            if (!['admin'].includes(usuarioLogado.tipo)) {
                return res.status(403).json({ error: 'Apenas administradores podem listar prêmios' });
            }
            const createdByUser = await this.premiosService.getAll(true, usuarioLogado.id); // Prêmios criados pelo usuário
            const createdByOthers = await this.premiosService.getAll(false); // Todos os prêmios, exceto filtragem
            const filteredByOthers = createdByOthers.filter(p => p.criadorId !== usuarioLogado.id); // Exclui os do próprio usuário
            res.json({
                createdByUser,
                createdByOthers: filteredByOthers,
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar prêmios: ' + error.message });
        }
    }

    async criar(req, res) {

        try {
            if (req.usuario.tipo !== 'admin') {
                return res.status(403).json({ error: 'Apenas administradores podem criar prêmios' });
            }
            const { nome, ano, descricao, cronogramas, criadorId } = req.body;
            if (!nome || !ano || !descricao || !criadorId) {
                return res.status(400).json({ error: 'Nome, ano, descrição e criadorId são obrigatórios' });
            }
            // Verificar se o criadorId corresponde a um administrador
            const criador = await this.Usuario.findByPk(criadorId);
            if (!criador || criador.tipo !== 'admin') {
                return res.status(400).json({ error: 'Criador inválido ou não é administrador' });
            }
            const premio = await this.Premio.create({ nome, ano, descricao, criadorId });
            if (cronogramas && cronogramas.length > 0) {
                await this.Cronograma.bulkCreate(cronogramas.map(c => ({ ...c, premioId: premio.id })));
            }
            const premioCompleto = await this.Premio.findByPk(premio.id, {
                include: [{ model: this.Cronograma, as: 'cronogramas' }],
            });
            res.status(201).json(premioCompleto);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar prêmio: ' + error.message });
        }
    }

    async atualizar(req, res) {
        try {
            if (req.usuario.tipo !== 'admin') {
                return res.status(403).json({ error: 'Apenas administradores podem atualizar prêmios' });
            }
            const { id } = req.params;
            const { nome, ano, descricao, cronogramas, criadorId } = req.body;
            if (!nome || !ano || !descricao || !criadorId) {
                return res.status(400).json({ error: 'Nome, ano, descrição e criadorId são obrigatórios' });
            }
            const premio = await this.Premio.findByPk(id);
            if (!premio) return res.status(404).json({ error: 'Prêmio não encontrado' });
            // Verificar se o criadorId corresponde a um administrador
            const criador = await this.Usuario.findByPk(criadorId);
            if (!criador || criador.tipo !== 'admin') {
                return res.status(400).json({ error: 'Criador inválido ou não é administrador' });
            }
            await premio.update({ nome, ano, descricao, criadorId });
            if (cronogramas) {
                await this.Cronograma.destroy({ where: { premioId: id } });
                if (cronogramas.length > 0) {
                    await this.Cronograma.bulkCreate(cronogramas.map(c => ({ ...c, premioId: id })));
                }
            }
            const premioAtualizado = await this.Premio.findByPk(id, {
                include: [{ model: this.Cronograma, as: 'cronogramas' }],
            });
            res.json(premioAtualizado);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar prêmio: ' + error.message });
        }
    }

    async excluir(req, res) {
        try {
            if (req.usuario.tipo !== 'admin') {
                return res.status(403).json({ error: 'Apenas administradores podem excluir prêmios' });
            }
            const { id } = req.params;
            const premio = await this.Premio.findByPk(id);
            if (!premio) return res.status(404).json({ error: 'Prêmio não encontrado' });
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
                        { model: this.Usuario, as: 'Coautores', through: { attributes: [] } },
                    ],
                }],
            });
            const vencedores = premios.map(premio => {
                const projetosAvaliados = premio.projetos.filter(p => p.status === 'avaliado' && p.avaliacoes.length > 0);
                if (!projetosAvaliados.length) return null;
                const projetoVencedor = projetosAvaliados.reduce((vencedor, p) => {
                    const mediaNota = p.avaliacoes.reduce((s, a) => s + a.nota, 0) / p.avaliacoes.length;
                    return (!vencedor || mediaNota > vencedor.mediaNota) ? { ...p.dataValues, mediaNota } : vencedor;
                }, null);
                return projetoVencedor ? {
                    premio: { id: premio.id, nome: premio.nome, ano: premio.ano },
                    projetoVencedor: { id: projetoVencedor.id, titulo: projetoVencedor.titulo, mediaNota: projetoVencedor.mediaNota },
                } : null;
            }).filter(v => v);
            res.json(vencedores);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar vencedores: ' + error.message });
        }
    }
}