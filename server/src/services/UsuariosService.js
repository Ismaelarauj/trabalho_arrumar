import bcrypt from 'bcrypt';
import UsuarioDTO from '../dtos/UsuarioDTO.js';

export class UsuariosService {
    constructor({ Usuario, Contato, Endereco }) {
        this.Usuario = Usuario;
        this.Contato = Contato;
        this.Endereco = Endereco;
    }

    async getAll(whereClause = {}) {
        console.log('getAll: whereClause=', whereClause);
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
        console.log('getById: id=', id);
        const usuario = await this.Usuario.findByPk(id, {
            include: [
                { model: this.Contato, as: 'Contato' },
                { model: this.Endereco, as: 'Endereco' },
            ],
        });
        if (!usuario) throw new Error('Usuário não encontrado');
        return new UsuarioDTO(usuario);
    }

    async getRawById(id) {
        console.log('getRawById: id=', id);
        const usuario = await this.Usuario.findByPk(id, {
            include: [
                { model: this.Contato, as: 'Contato' },
                { model: this.Endereco, as: 'Endereco' },
            ],
        });
        if (!usuario) throw new Error('Usuário não encontrado');
        return usuario; // Retorna o modelo Sequelize diretamente
    }

    async create(data) {
        console.log('create: dados=', data);
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
        return { usuario: await this.getById(usuario.id) };
    }

    async update(id, data) {
        console.log('update: id=', id, 'data=', data);
        const usuario = await this.getRawById(id); // Usa getRawById para obter o modelo Sequelize
        if (!usuario) throw new Error('Usuário não encontrado');
        if (data.tipo === 'admin') throw new Error('Atualização para administrador não permitida');
        const updatedData = {
            nome: data.nome ?? usuario.nome,
            cpf: data.cpf ?? usuario.cpf,
            dataNascimento: data.dataNascimento ?? usuario.dataNascimento,
            tipo: data.tipo ?? usuario.tipo,
            instituicao: data.tipo === 'autor' ? (data.instituicao ?? usuario.instituicao) : null,
            especialidade: data.tipo === 'avaliador' ? (data.especialidade ?? usuario.especialidade) : null,
            email: data.email ?? usuario.email,
            senha: data.senha ? await bcrypt.hash(data.senha, 10) : usuario.senha,
        };
        console.log('update: updatedData=', updatedData);
        await usuario.update(updatedData);
        let contato = await this.Contato.findOne({ where: { usuarioId: id } });
        if (data.telefone !== undefined) {
            if (contato && data.telefone) await contato.update({ telefone: data.telefone });
            else if (contato && !data.telefone) await contato.destroy();
            else if (data.telefone) await this.Contato.create({ telefone: data.telefone, usuarioId: id });
        }
        let endereco = await this.Endereco.findOne({ where: { usuarioId: id } });
        if (data.rua !== undefined || data.cidade !== undefined || data.estado !== undefined || data.cep !== undefined) {
            const enderecoData = {
                rua: data.rua ?? endereco?.rua,
                cidade: data.cidade ?? endereco?.cidade,
                estado: data.estado ?? endereco?.estado,
                cep: data.cep ?? endereco?.cep
            };
            if (endereco) await endereco.update(enderecoData);
            else if (data.rua || data.cidade || data.estado || data.cep) {
                await this.Endereco.create({ ...enderecoData, usuarioId: id });
            }
        } else if (endereco && !data.rua && !data.cidade && !data.estado && !data.cep) {
            await endereco.destroy();
        }
        const updatedUser = await this.getById(id);
        console.log('update: usuário atualizado=', updatedUser);
        return updatedUser;
    }

    async delete(id) {
        console.log('delete: id=', id);
        const usuario = await this.getRawById(id);
        if (!usuario) throw new Error('Usuário não encontrado');
        if (usuario.tipo === 'admin') throw new Error('Não é permitido excluir administradores');
        await this.Contato.destroy({ where: { usuarioId: id } });
        await this.Endereco.destroy({ where: { usuarioId: id } });
        return await usuario.destroy();
    }

    async login({ email, senha }) {
        console.log('login: email=', email);
        const usuario = await this.Usuario.findOne({ where: { email } });
        if (!usuario) throw new Error('Usuário não encontrado');
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) throw new Error('Senha incorreta');
        return {
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo,
            },
        };
    }

    async getByEmail(email) {
        console.log('getByEmail: email=', email);
        const usuario = await this.Usuario.findOne({ where: { email } });
        if (!usuario) throw new Error('Usuário não encontrado');
        return usuario;
    }
}