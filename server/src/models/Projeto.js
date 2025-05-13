import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Premio } from './Premio.js';
import { Autor } from './Autor.js';

export const Projeto = sequelize.define('Projeto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    premioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { notNull: { msg: 'O prêmio é obrigatório' } }
    },
    autorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { notNull: { msg: 'O autor é obrigatório' } }
    },
    titulo: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: { notEmpty: { msg: 'O título não pode ser vazio' } }
    },
    resumo: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { notEmpty: { msg: 'O resumo não pode ser vazio' } }
    },
    areaTematica: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { notEmpty: { msg: 'A área temática não pode ser vazia' } }
    },
    dataEnvio: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: { isDate: { msg: 'A data de envio é inválida' } }
    },
    status: {
        type: DataTypes.ENUM('pendente', 'avaliado'),
        defaultValue: 'pendente',
        allowNull: false
    }
}, {
    tableName: 'Projetos',
    timestamps: false
});

Projeto.belongsTo(Premio, { foreignKey: 'premioId' });
Projeto.belongsTo(Autor, { as: 'Autor', foreignKey: 'autorId' });
Premio.hasMany(Projeto, { foreignKey: 'premioId' });
Autor.hasMany(Projeto, { as: 'Projetos', foreignKey: 'autorId' });

Projeto.belongsToMany(Autor, { through: 'ProjetoCoautores', as: 'Coautores', foreignKey: 'projetoId' });
Autor.belongsToMany(Projeto, { through: 'ProjetoCoautores', as: 'ProjetosCoautorados', foreignKey: 'autorId' });