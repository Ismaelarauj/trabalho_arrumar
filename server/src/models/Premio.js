import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Premio = sequelize.define('Premio', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { notEmpty: true }
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { notEmpty: true }
    },
    ano: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { isInt: true, min: 2000, max: 2100 }
    }
}, {
    tableName: 'Premios',
    timestamps: false
});