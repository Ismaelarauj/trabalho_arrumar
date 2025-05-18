import { Usuario } from '../models/Usuario.js';
import { Contato } from '../models/Contato.js';
import { Endereco } from '../models/Endereco.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = '505050';

export class UsuariosService {
    async getAll() {
        return await Usuario.findAll({
            include: [
                { model: Contato, as: 'Contato' },
                { model: Endereco, as: 'Endereco' }
            ]
        });
    }

    async getById(id) {
        const usuario = await Usuario.findByPk(id, {
            include: [
                { model: Contato, as: 'Contato' },
                { model: Endereco, as: 'Endereco' }
            ]
        });
        if (!usuario) throw new Error('Usuário não encontrado');
        return usuario;
    }

    async create(data) {
        try {
            console.log('Criando usuário com dados:', data);
            if (data.tipo === 'admin') {
                throw new Error('Cadastro de administrador não permitido');
            }

            const usuarioExistente = await Usuario.findOne({ where: { email: data.email } });
            if (usuarioExistente) {
                throw new Error('Email já cadastrado');
            }

            // Hashear a senha antes de salvar
            const hashedPassword = await bcrypt.hash(data.senha, 10);

            // Criar o usuário apenas com os campos que pertencem à tabela Usuario
            const usuario = await Usuario.create({
                nome: data.nome,
                cpf: data.cpf,
                dataNascimento: data.dataNascimento,
                tipo: data.tipo,
                instituicao: data.tipo === 'autor' ? data.instituicao : null,
                especialidade: data.tipo === 'avaliador' ? data.especialidade : null,
                email: data.email,
                senha: hashedPassword
            });

            // Criar registros em Contato e Endereco, se fornecidos
            if (data.telefone) {
                await Contato.create({
                    telefone: data.telefone,
                    usuarioId: usuario.id
                });
            }

            if (data.rua || data.cidade || data.estado || data.cep) {
                await Endereco.create({
                    rua: data.rua,
                    cidade: data.cidade,
                    estado: data.estado,
                    cep: data.cep,
                    usuarioId: usuario.id
                });
            }

            const usuarioCompleto = await this.getById(usuario.id);
            const token = jwt.sign({ id: usuario.id, email: usuario.email, tipo: usuario.tipo }, JWT_SECRET, {
                expiresIn: '1h'
            });

            return { usuario: usuarioCompleto, token };
        } catch (error) {
            console.error('Erro durante a criação:', error.message);
            throw error;
        }
    }

    async update(id, data) {
        try {
            console.log('Atualizando usuário ID:', id, 'com dados:', data);
            const usuario = await Usuario.findByPk(id);
            if (!usuario) throw new Error('Usuário não encontrado');
            if (data.tipo === 'admin') throw new Error('Atualização para administrador não permitida');

            // Hashear a senha se fornecida
            const updatedData = {
                nome: data.nome,
                cpf: data.cpf,
                dataNascimento: data.dataNascimento,
                tipo: data.tipo,
                instituicao: data.tipo === 'autor' ? data.instituicao : null,
                especialidade: data.tipo === 'avaliador' ? data.especialidade : null,
                email: data.email,
                senha: data.senha ? await bcrypt.hash(data.senha, 10) : usuario.senha
            };

            await usuario.update(updatedData);

            let contato = await Contato.findOne({ where: { usuarioId: id } });
            if (data.telefone) {
                if (contato) {
                    await contato.update({
                        telefone: data.telefone
                    });
                } else {
                    await Contato.create({
                        telefone: data.telefone,
                        usuarioId: id
                    });
                }
            } else if (contato) {
                await contato.destroy();
            }

            let endereco = await Endereco.findOne({ where: { usuarioId: id } });
            if (data.rua || data.cidade || data.estado || data.cep) {
                if (endereco) {
                    await endereco.update({
                        rua: data.rua,
                        cidade: data.cidade,
                        estado: data.estado,
                        cep: data.cep
                    });
                } else {
                    await Endereco.create({
                        rua: data.rua,
                        cidade: data.cidade,
                        estado: data.estado,
                        cep: data.cep,
                        usuarioId: id
                    });
                }
            } else if (endereco) {
                await endereco.destroy();
            }

            return await this.getById(id);
        } catch (error) {
            console.error('Erro durante a atualização:', error.message);
            throw error;
        }
    }

    async delete(id) {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) throw new Error('Usuário não encontrado');
        if (usuario.tipo === 'admin') throw new Error('Não é permitido excluir administradores');
        await Contato.destroy({ where: { usuarioId: id } });
        await Endereco.destroy({ where: { usuarioId: id } });
        return await usuario.destroy();
    }

    async login({ email, senha }) {
        console.log('Tentando login com email:', email);
        try {
            const usuario = await Usuario.findOne({ where: { email } });
            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }

            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                throw new Error('Senha incorreta');
            }

            const token = jwt.sign({ id: usuario.id, email: usuario.email, tipo: usuario.tipo }, JWT_SECRET, {
                expiresIn: '1h'
            });

            return { usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo }, token };
        } catch (error) {
            console.error('Erro no serviço de login:', error);
            throw error;
        }
    }
}