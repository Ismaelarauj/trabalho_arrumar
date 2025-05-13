import { Avaliador } from '../models/Avaliador.js';
import { Contato } from '../models/Contato.js';
import { Endereco } from '../models/Endereco.js';

export class AvaliadoresService {
    async getAll() {
        return await Avaliador.findAll({
            include: [
                { model: Contato, as: 'Contato' },
                { model: Endereco, as: 'Endereco' },
            ],
        });
    }

    async getById(id) {
        const avaliador = await Avaliador.findByPk(id, {
            include: [
                { model: Contato, as: 'Contato' },
                { model: Endereco, as: 'Endereco' },
            ],
        });
        if (!avaliador) throw new Error('Avaliador não encontrado');
        return avaliador;
    }

    async create(data) {
        try {
            console.log('Criando avaliador com dados:', data);
            const avaliador = await Avaliador.create({
                nome: data.nome,
                cpf: data.cpf,
                dataNascimento: data.dataNascimento,
                especialidade: data.especialidade,
            });

            // Criar Contato
            if (data.email || data.telefone) {
                await Contato.create({
                    email: data.email,
                    telefone: data.telefone,
                    avaliadorId: avaliador.id,
                });
            }

            // Criar Endereço
            if (data.rua || data.cidade || data.estado || data.cep) {
                await Endereco.create({
                    rua: data.rua,
                    cidade: data.cidade,
                    estado: data.estado,
                    cep: data.cep,
                    avaliadorId: avaliador.id,
                });
            }

            const avaliadorCompleto = await this.getById(avaliador.id);
            console.log('Avaliador criado:', avaliadorCompleto.toJSON());
            return avaliadorCompleto;
        } catch (error) {
            console.error('Erro durante a criação:', error.message);
            throw error;
        }
    }

    async update(id, data) {
        try {
            console.log('Atualizando avaliador ID:', id, 'com dados:', data);
            const avaliador = await Avaliador.findByPk(id);
            if (!avaliador) throw new Error('Avaliador não encontrado');

            await avaliador.update({
                nome: data.nome,
                cpf: data.cpf,
                dataNascimento: data.dataNascimento,
                especialidade: data.especialidade,
            });

            // Atualizar Contato
            let contato = await Contato.findOne({ where: { avaliadorId: id } });
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
                        avaliadorId: id,
                    });
                }
            } else if (contato) {
                await contato.destroy();
            }

            // Atualizar Endereço
            let endereco = await Endereco.findOne({ where: { avaliadorId: id } });
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
                        avaliadorId: id,
                    });
                }
            } else if (endereco) {
                await endereco.destroy();
            }

            const avaliadorCompleto = await this.getById(id);
            console.log('Avaliador atualizado:', avaliadorCompleto.toJSON());
            return avaliadorCompleto;
        } catch (error) {
            console.error('Erro durante a atualização:', error.message);
            throw error;
        }
    }

    async delete(id) {
        const avaliador = await Avaliador.findByPk(id);
        if (!avaliador) throw new Error('Avaliador não encontrado');
        await Contato.destroy({ where: { avaliadorId: id } });
        await Endereco.destroy({ where: { avaliadorId: id } });
        return await avaliador.destroy();
    }
}