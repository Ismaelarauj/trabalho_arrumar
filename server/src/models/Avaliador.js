import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Contato } from './Contato.js';
import { Endereco } from './Endereco.js';

export const Avaliador = sequelize.define('Avaliador', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'O nome não pode ser vazio' },
        },
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'O CPF não pode ser vazio' },
            len: {
                args: [11, 14],
                msg: 'CPF deve ter entre 11 e 14 caracteres',
            },
        },
    },
    dataNascimento: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: { msg: 'Data de nascimento inválida' },
        },
    },
    especialidade: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'A especialidade não pode ser vazia' },
        },
    },
}, {
    tableName: 'Avaliadores',
    timestamps: false,
});

// Relacionamentos
Avaliador.hasOne(Contato, {
    foreignKey: {
        name: 'avaliadorId',
        allowNull: true,
        type: DataTypes.INTEGER,
    },
    as: 'Contato',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
});
Contato.belongsTo(Avaliador, {
    foreignKey: {
        name: 'avaliadorId',
        allowNull: true,
        type: DataTypes.INTEGER,
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
});

Avaliador.hasOne(Endereco, {
    foreignKey: {
        name: 'avaliadorId',
        allowNull: true,
        type: DataTypes.INTEGER,
    },
    as: 'Endereco',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
});
Endereco.belongsTo(Avaliador, {
    foreignKey: {
        name: 'avaliadorId',
        allowNull: true,
        type: DataTypes.INTEGER,
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
});