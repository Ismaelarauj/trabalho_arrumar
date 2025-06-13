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
        },
        criadorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Usuarios', // Nome da tabela de usuários
                key: 'id'
            }
        }
    }, {
        tableName: 'Premios',
        timestamps: false
    });

    return Premio;
};

export default definePremio;