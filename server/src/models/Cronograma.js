import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Cronograma = sequelize.define('Cronograma', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    premioId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    etapa: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    dataInicio: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    dataFim: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
}, {
    tableName: 'Cronogramas',
    timestamps: false
});

