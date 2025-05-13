import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Endereco = sequelize.define('Endereco', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rua: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [0, 255],
                msg: 'Rua deve ter até 255 caracteres',
            },
        },
    },
    cidade: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [0, 100],
                msg: 'Cidade deve ter até 100 caracteres',
            },
        },
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [0, 50],
                msg: 'Estado deve ter até 50 caracteres',
            },
        },
    },
    cep: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [0, 20],
                msg: 'CEP deve ter até 20 caracteres',
            },
        },
    },
    autorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Autores',
            key: 'id',
        },
    },
    avaliadorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Avaliadores',
            key: 'id',
        },
    },
}, {
    tableName: 'Enderecos',
    timestamps: false,
});