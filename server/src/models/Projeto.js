// server/models/Projeto.js
import { DataTypes } from 'sequelize';

export const defineProjeto = (sequelize) => {
    const Projeto = sequelize.define('Projeto', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        premioId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Premios', key: 'id' }
        },
        autorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Usuarios', key: 'id' }
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
            type: DataTypes.DATE,
            allowNull: false
        },
        arquivoPath: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'pendente'
        }
    }, {
        tableName: 'Projetos'
    });

    Projeto.associate = (models) => {
        Projeto.belongsTo(models.Premio, { foreignKey: 'premioId', as: 'Premio' });
        Projeto.belongsTo(models.Usuario, { foreignKey: 'autorId', as: 'Autor' });
        Projeto.belongsToMany(models.Usuario, {
            through: 'ProjetoCoautores',
            as: 'Coautores',
            foreignKey: 'projetoId',
            otherKey: 'usuarioId'
        });
        Projeto.hasMany(models.Avaliacao, { foreignKey: 'projetoId', as: 'avaliacoes' });
    };

    return Projeto;
};