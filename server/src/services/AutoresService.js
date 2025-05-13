import { Autor } from '../models/Autor.js';
import { Contato } from '../models/Contato.js';
import { Endereco } from '../models/Endereco.js';

export class AutoresService {
    async getAll() {
        return await Autor.findAll({
            include: [
                { model: Contato, as: 'Contato' },
                { model: Endereco, as: 'Endereco' },
            ],
        });
    }

    async getById(id) {
        const autor = await Autor.findByPk(id, {
            include: [
                { model: Contato, as: 'Contato' },
                { model: Endereco, as: 'Endereco' },
            ],
        });
        if (!autor) throw new Error('Autor não encontrado');
        return autor;
    }

    async create(data) {
        try {
            console.log('Criando autor com dados:', data);
            const autor = await Autor.create({
                nome: data.nome,
                cpf: data.cpf,
                dataNascimento: data.dataNascimento,
                instituicao: data.instituicao,
            });

            // Criar Contato
            if (data.email || data.telefone) {
                await Contato.create({
                    email: data.email,
                    telefone: data.telefone,
                    autorId: autor.id,
                });
            }

            // Criar Endereço
            if (data.rua || data.cidade || data.estado || data.cep) {
                await Endereco.create({
                    rua: data.rua,
                    cidade: data.cidade,
                    estado: data.estado,
                    cep: data.cep,
                    autorId: autor.id,
                });
            }

            const autorCompleto = await this.getById(autor.id);
            console.log('Autor criado:', autorCompleto.toJSON());
            return autorCompleto;
        } catch (error) {
            console.error('Erro durante a criação:', error.message);
            throw error;
        }
    }

    async update(id, data) {
        try {
            console.log('Atualizando autor ID:', id, 'com dados:', data);
            const autor = await Autor.findByPk(id);
            if (!autor) throw new Error('Autor não encontrado');

            await autor.update({
                nome: data.nome,
                cpf: data.cpf,
                dataNascimento: data.dataNascimento,
                instituicao: data.instituicao,
            });

            // Atualizar Contato
            let contato = await Contato.findOne({ where: { autorId: id } });
            if (data.email || data.telefone) {
                if (contato) {
                    await contato.update({
                        email: data.email,
                        telefone: data.telefone,
                    });
                } else {
                    await Contato.create({
                        email: data.email,
                        telefone: data.telefone,
                        autorId: id,
                    });
                }
            } else if (contato) {
                await contato.destroy();
            }

            // Atualizar Endereço
            let endereco = await Endereco.findOne({ where: { autorId: id } });
            if (data.rua || data.cidade || data.estado || data.cep) {
                if (endereco) {
                    await endereco.update({
                        rua: data.rua,
                        cidade: data.cidade,
                        estado: data.estado,
                        cep: data.cep,
                    });
                } else {
                    await Endereco.create({
                        rua: data.rua,
                        cidade: data.cidade,
                        estado: data.estado,
                        cep: data.cep,
                        autorId: id,
                    });
                }
            } else if (endereco) {
                await endereco.destroy();
            }

            const autorCompleto = await this.getById(id);
            console.log('Autor atualizado:', autorCompleto.toJSON());
            return autorCompleto;
        } catch (error) {
            console.error('Erro durante a atualização:', error.message);
            throw error;
        }
    }

    async delete(id) {
        const autor = await Autor.findByPk(id);
        if (!autor) throw new Error('Autor não encontrado');
        await Contato.destroy({ where: { autorId: id } });
        await Endereco.destroy({ where: { autorId: id } });
        return await autor.destroy();
    }
}