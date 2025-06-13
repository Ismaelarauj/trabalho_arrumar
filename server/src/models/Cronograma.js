import { DataTypes } from 'sequelize';

export const defineCronograma = (sequelize) => {
    const Cronograma = sequelize.define('Cronograma', {
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
            type: DataTypes.STRING,
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

    return Cronograma;
};

export default defineCronograma;