import { DataTypes } from 'sequelize';

export const definePremio = (sequelize) => {
    const Premio = sequelize.define('Premio', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descricao: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ano: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'Premios',
        timestamps: false
    });

    return Premio;
};