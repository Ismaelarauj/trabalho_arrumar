import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('premios', 'root', 'Francandrade@6810', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    logging: false
});

export const connectDB = async () => {
    try {
        console.log('Tentando conectar ao MySQL...');
        await sequelize.authenticate();
        console.log('MySQL conectado');

        // Importar modelos após inicializar sequelize
        const { Projeto } = await import('../models/Projeto.js');
        const { Avaliacao } = await import('../models/Avaliacao.js');
        const { Cronograma } = await import('../models/Cronograma.js');
        const { Premio } = await import('../models/Premio.js');
        const { defineAssociations } = await import('../models/associations.js');

        defineAssociations({ Projeto, Avaliacao, Cronograma, Premio });
        await sequelize.sync({ force: true }); // Forçar sincronização
        console.log('Tabelas sincronizadas');
    } catch (error) {
        console.error('Erro ao conectar ao MySQL:', error);
        throw error;
    }
};