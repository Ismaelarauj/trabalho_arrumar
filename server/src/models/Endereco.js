import { DataTypes } from 'sequelize';

export const defineEndereco = (sequelize) => {
    const Endereco = sequelize.define('Endereco', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        rua: { type: DataTypes.STRING, allowNull: true },
        cidade: { type: DataTypes.STRING, allowNull: true },
        estado: { type: DataTypes.STRING, allowNull: true },
        cep: { type: DataTypes.STRING, allowNull: true },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Usuarios',
                key: 'id'
            }
        }
    }, {
        tableName: 'Enderecos',
        timestamps: false
    });

    return Endereco;
};

export default defineEndereco;