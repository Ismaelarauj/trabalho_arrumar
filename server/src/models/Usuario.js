import { DataTypes } from 'sequelize';

export const defineUsuario = (sequelize) => {
    const Usuario = sequelize.define('Usuario', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cpf: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        dataNascimento: {
            type: DataTypes.DATE, // Ajustado de DATEONLY para DATE para corresponder à tabela
            allowNull: false
        },
        tipo: {
            type: DataTypes.ENUM('admin', 'autor', 'avaliador'),
            allowNull: false
        },
        instituicao: {
            type: DataTypes.STRING,
            allowNull: true
        },
        especialidade: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: true }
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'Usuarios',
        timestamps: false
    });

    return Usuario;
};