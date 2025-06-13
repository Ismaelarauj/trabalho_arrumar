import { DataTypes } from 'sequelize';

export const defineContato = (sequelize) => {
    const Contato = sequelize.define('Contato', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Usuarios',
                key: 'id'
            }
        },
        telefone: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: {
                    args: [0, 20],
                    msg: 'Telefone deve ter até 20 caracteres'
                }
            }
        }
    }, {
        tableName: 'Contatos',
        timestamps: false
    });

    return Contato;
};

export default defineContato;