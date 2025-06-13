import bcrypt from 'bcrypt';
import UsuarioDTO from '../dtos/UsuarioDTO.js';

export class UsuariosService {
    constructor({ Usuario, Contato, Endereco }) {
        this.Usuario = Usuario;
        this.Contato = Contato;
        this.Endereco = Endereco;
    }

    async getAll(whereClause = {}) {
        const usuarios = await this.Usuario.findAll({
            where: whereClause,
            include: [
                { model: this.Contato, as: 'Contato' },
                { model: this.Endereco, as: 'Endereco' },
            ],
        });
        return usuarios.map(u => new UsuarioDTO(u));
    }

    async getById(id) {
        const usuario = await this.Usuario.findByPk(id, {
            include: [
                { model: this.Contato, as: 'Contato' },
                { model: this.Endereco, as: 'Endereco' },
            ],
        });
        if (!usuario) throw new Error('Usuário não encontrado');
        return new UsuarioDTO(usuario);
    }

    async create(data) {
        if (data.tipo === 'admin') throw new Error('Cadastro de administrador não permitido');
        const usuarioExistente = await this.Usuario.findOne({ where: { email: data.email } });
        if (usuarioExistente) throw new Error('Email já cadastrado');
        const hashedPassword = await bcrypt.hash(data.senha, 10);
        const usuario = await this.Usuario.create({
            nome: data.nome,
            cpf: data.cpf,
            dataNascimento: data.dataNascimento,
            tipo: data.tipo,
            instituicao: data.tipo === 'autor' ? data.instituicao : null,
            especialidade: data.tipo === 'avaliador' ? data.especialidade : null,
            email: data.email,
            senha: hashedPassword,
        });
        if (data.telefone) await this.Contato.create({ telefone: data.telefone, usuarioId: usuario.id });
        if (data.rua || data.cidade || data.estado || data.cep) {
            await this.Endereco.create({
                rua: data.rua,
                cidade: data.cidade,
                estado: data.estado,
                cep: data.cep,
                usuarioId: usuario.id
            });
        }
        const usuarioCompleto = await this.getById(usuario.id);
        return { usuario: usuarioCompleto };
    }

    async update(id, data) {
        const usuario = await this.Usuario.findByPk(id);
        if (!usuario) throw new Error('Usuário não encontrado');
        if (data.tipo === 'admin') throw new Error('Atualização para administrador não permitida');
        const updatedData = {
            nome: data.nome,
            cpf: data.cpf,
            dataNascimento: data.dataNascimento,
            tipo: data.tipo,
            instituicao: data.tipo === 'autor' ? data.instituicao : null,
            especialidade: data.tipo === 'avaliador' ? data.especialidade : null,
            email: data.email,
            senha: data.senha ? await bcrypt.hash(data.senha, 10) : usuario.senha,
        };
        await usuario.update(updatedData);
        let contato = await this.Contato.findOne({ where: { usuarioId: id } });
        if (data.telefone) {
            if (contato) await contato.update({ telefone: data.telefone });
            else await this.Contato.create({ telefone: data.telefone, usuarioId: id });
        } else if (contato) await contato.destroy();
        let endereco = await this.Endereco.findOne({ where: { usuarioId: id } });
        if (data.rua || data.cidade || data.estado || data.cep) {
            if (endereco) await endereco.update({
                rua: data.rua,
                cidade: data.cidade,
                estado: data.estado,
                cep: data.cep
            });
            else await this.Endereco.create({
                rua: data.rua,
                cidade: data.cidade,
                estado: data.estado,
                cep: data.cep,
                usuarioId: id
            });
        } else if (endereco) await endereco.destroy();
        return await this.getById(id);
    }

    async delete(id) {
        const usuario = await this.Usuario.findByPk(id);
        if (!usuario) throw new Error('Usuário não encontrado');
        if (usuario.tipo === 'admin') throw new Error('Não é permitido excluir administradores');
        await this.Contato.destroy({ where: { usuarioId: id } });
        await this.Endereco.destroy({ where: { usuarioId: id } });
        return await usuario.destroy();
    }

    async login({ email, senha }) {
        const usuario = await this.Usuario.findOne({ where: { email } });
        if (!usuario) throw new Error('Usuário não encontrado');
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) throw new Error('Senha incorreta');
        // Retorna explicitamente os campos necessários
        return {
            usuario: {
                id: usuario.id,
                email: usuario.email,
                tipo: usuario.tipo,
            },
        };
    }
}