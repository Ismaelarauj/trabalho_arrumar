import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Contato = sequelize.define('Contato', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: { msg: 'Email inválido' },
        },
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [0, 20],
                msg: 'Telefone deve ter até 20 caracteres',
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
    tableName: 'Contatos',
    timestamps: false,
});