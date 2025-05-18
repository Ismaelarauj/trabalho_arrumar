import { DataTypes } from 'sequelize';

export const defineProjeto = (sequelize) => {
    const Projeto = sequelize.define('Projeto', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        premioId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        autorId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        titulo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        resumo: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        areaTematica: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dataEnvio: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pendente', 'avaliado', 'aprovado', 'rejeitado'),
            defaultValue: 'pendente'
        },
        arquivoPath: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'Projetos',
        timestamps: false
    });

    return Projeto;
};