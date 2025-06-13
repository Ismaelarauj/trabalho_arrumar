import { DataTypes } from 'sequelize';

export const defineAvaliacao = (sequelize) => {
    const Avaliacao = sequelize.define('Avaliacao', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        projetoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { notNull: true }
        },
        avaliadorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { notNull: true }
        },
        parecer: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: { notEmpty: true }
        },
        nota: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: { min: 0, max: 10 }
        },
        dataAvaliacao: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: { isDate: true }
        }
    }, {
        tableName: 'Avaliacoes',
        timestamps: false
    });

    return Avaliacao;
};

export default defineAvaliacao;