import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UsuariosController {
    constructor({ Usuario, Contato, Endereco }) {
        this.Usuario = Usuario;
        this.Contato = Contato;
        this.Endereco = Endereco;
    }

    async login(req, res) {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({ error: 'Email e senha são obrigatórios' });
            }

            const usuario = await this.Usuario.findOne({ where: { email } });
            if (!usuario) {
                return res.status(401).json({ error: 'Usuário não encontrado' });
            }

            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                return res.status(401).json({ error: 'Senha incorreta' });
            }

            console.log('Gerando token para usuário:', { id: usuario.id, role: usuario.tipo });
            const token = jwt.sign(
                { id: usuario.id, role: usuario.tipo },
                '505050',
                { expiresIn: '24h' }
            );

            res.json({
                usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo },
                token
            });
        } catch (error) {
            console.error('Erro no controlador de login:', error);
            res.status(500).json({ error: 'Erro ao fazer login: ' + error.message });
        }
    }

    async getAll(req, res) {
        try {
            const usuarioLogado = req.usuario;

            // Permitir que admin veja todos os usuários e autor veja apenas outros autores
            if (usuarioLogado.role !== 'admin' && usuarioLogado.role !== 'autor') {
                return res.status(403).json({ error: 'Acesso negado: apenas administradores ou autores podem listar usuários' });
            }

            const whereClause = usuarioLogado.role === 'autor' ? { tipo: 'autor' } : {};

            const usuarios = await this.Usuario.findAll({
                where: whereClause,
                include: [
                    { model: this.Contato, as: 'Contato' },
                    { model: this.Endereco, as: 'Endereco' }
                ]
            });

            console.log('Usuários listados:', JSON.stringify(usuarios, null, 2));
            res.json(usuarios);
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            res.status(500).json({ error: 'Erro ao listar usuários: ' + error.message });
        }
    }

    async getById(req, res) {
        try {
            const usuario = await this.Usuario.findByPk(req.params.id, {
                include: [
                    { model: this.Contato, as: 'Contato' },
                    { model: this.Endereco, as: 'Endereco' }
                ]
            });
            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const usuarioLogado = req.usuario;
            if (usuarioLogado.role !== 'admin' && usuarioLogado.id !== usuario.id) {
                return res.status(403).json({ error: 'Acesso negado' });
            }

            res.json(usuario);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar usuário: ' + error.message });
        }
    }

    async create(req, res) {
        try {
            if (req.body.tipo === 'admin') {
                return res.status(403).json({ error: 'Cadastro de administrador não permitido' });
            }

            const {
                nome, cpf, dataNascimento, tipo, instituicao, especialidade, email, senha,
                telefone, rua, cidade, estado, cep
            } = req.body;

            const errors = [];
            if (!nome) errors.push({ field: 'nome', message: 'O nome é obrigatório' });
            if (!cpf) errors.push({ field: 'cpf', message: 'O CPF é obrigatório' });
            if (!dataNascimento) errors.push({ field: 'dataNascimento', message: 'A data de nascimento é obrigatória' });
            if (!tipo) errors.push({ field: 'tipo', message: 'O tipo é obrigatório' });
            if (!email) errors.push({ field: 'email', message: 'O email é obrigatório' });
            if (!senha) errors.push({ field: 'senha', message: 'A senha é obrigatória' });

            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }

            const usuarioExistente = await this.Usuario.findOne({ where: { email } });
            if (usuarioExistente) {
                return res.status(400).json({ errors: [{ field: 'email', message: 'Email já cadastrado' }] });
            }

            const instituicaoValue = instituicao && instituicao.trim() ? instituicao : null;
            const especialidadeValue = especialidade && especialidade.trim() ? especialidade : null;

            const hashedPassword = await bcrypt.hash(senha, 10);
            const usuario = await this.Usuario.create({
                nome,
                cpf,
                dataNascimento,
                tipo,
                instituicao: tipo === 'autor' ? instituicaoValue : null,
                especialidade: tipo === 'avaliador' ? especialidadeValue : null,
                email,
                senha: hashedPassword
            });

            if (telefone) {
                await this.Contato.create({ usuarioId: usuario.id, telefone });
            }

            if (rua || cidade || estado || cep) {
                await this.Endereco.create({ usuarioId: usuario.id, rua, cidade, estado, cep });
            }

            const usuarioCompleto = await this.Usuario.findByPk(usuario.id, {
                include: [
                    { model: this.Contato, as: 'Contato' },
                    { model: this.Endereco, as: 'Endereco' }
                ]
            });

            res.status(201).json(usuarioCompleto);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar usuário: ' + error.message });
        }
    }

    async update(req, res) {
        try {
            const usuario = await this.Usuario.findByPk(req.params.id);
            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const usuarioLogado = req.usuario;
            if (usuarioLogado.role !== 'admin' && usuarioLogado.id !== usuario.id) {
                return res.status(403).json({ error: 'Acesso negado' });
            }

            const {
                nome, cpf, dataNascimento, tipo, instituicao, especialidade, email, senha,
                telefone, rua, cidade, estado, cep
            } = req.body;

            const errors = [];
            if (nome && !nome.trim()) errors.push({ field: 'nome', message: 'O nome não pode ser vazio' });
            if (cpf && !cpf.trim()) errors.push({ field: 'cpf', message: 'O CPF não pode ser vazio' });
            if (dataNascimento && !dataNascimento.trim()) errors.push({ field: 'dataNascimento', message: 'A data de nascimento não pode ser vazia' });
            if (tipo && !tipo.trim()) errors.push({ field: 'tipo', message: 'O tipo não pode ser vazio' });
            if (email && !email.trim()) errors.push({ field: 'email', message: 'O email não pode ser vazio' });

            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }

            if (email && email !== usuario.email) {
                const usuarioExistente = await this.Usuario.findOne({ where: { email } });
                if (usuarioExistente) {
                    return res.status(400).json({ errors: [{ field: 'email', message: 'Email já cadastrado' }] });
                }
            }

            const updatedData = {};
            if (nome) updatedData.nome = nome;
            if (cpf && usuarioLogado.role === 'admin') updatedData.cpf = cpf;
            if (dataNascimento) updatedData.dataNascimento = dataNascimento;
            if (tipo && usuarioLogado.role === 'admin') updatedData.tipo = tipo;
            if (instituicao && usuario.tipo === 'autor') updatedData.instituicao = instituicao;
            if (especialidade && usuario.tipo === 'avaliador') updatedData.especialidade = especialidade;
            if (email && usuarioLogado.role === 'admin') updatedData.email = email;
            if (senha) updatedData.senha = await bcrypt.hash(senha, 10);

            await usuario.update(updatedData);

            let contato = await this.Contato.findOne({ where: { usuarioId: usuario.id } });
            if (telefone) {
                if (contato) {
                    await contato.update({ telefone });
                } else {
                    await this.Contato.create({ usuarioId: usuario.id, telefone });
                }
            } else if (contato) {
                await contato.destroy();
            }

            let endereco = await this.Endereco.findOne({ where: { usuarioId: usuario.id } });
            if (rua || cidade || estado || cep) {
                if (endereco) {
                    await endereco.update({ rua, cidade, estado, cep });
                } else {
                    await this.Endereco.create({ usuarioId: usuario.id, rua, cidade, estado, cep });
                }
            } else if (endereco) {
                await endereco.destroy();
            }

            const usuarioAtualizado = await this.Usuario.findByPk(usuario.id, {
                include: [
                    { model: this.Contato, as: 'Contato' },
                    { model: this.Endereco, as: 'Endereco' }
                ]
            });

            res.json(usuarioAtualizado);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar usuário: ' + error.message });
        }
    }

    async delete(req, res) {
        try {
            const usuario = await this.Usuario.findByPk(req.params.id);
            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const usuarioLogado = req.usuario;
            if (usuarioLogado.id === usuario.id) {
                return res.status(403).json({ error: 'Você não pode excluir sua própria conta' });
            }
            if (usuarioLogado.role !== 'admin') {
                return res.status(403).json({ error: 'Apenas administradores podem excluir usuários' });
            }

            await usuario.destroy();
            res.json({ message: 'Usuário excluído com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao excluir usuário: ' + error.message });
        }
    }
}