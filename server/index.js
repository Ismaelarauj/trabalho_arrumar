import express from 'express';
import cors from 'cors';
import { connectDB } from './src/config/db.js';

const app = express();
app.use(cors());
app.use(express.json());

const startServer = async () => {
    try {
        await connectDB();
        // Importar controladores após conectar ao banco
        const { PremiosController } = await import('./src/controllers/PremiosController.js');
        const { AutoresController } = await import('./src/controllers/AutoresController.js');
        const { AvaliadoresController } = await import('./src/controllers/AvaliadoresController.js');
        const { ProjetosController } = await import('./src/controllers/ProjetosController.js');
        const { AvaliacoesController } = await import('./src/controllers/AvaliacoesController.js');
        const { VencedoresController } = await import('./src/controllers/VencedoresController.js');

        app.use('/api/premios', new PremiosController().router);
        app.use('/api/autores', new AutoresController().router);
        app.use('/api/avaliadores', new AvaliadoresController().router);
        app.use('/api/projetos', new ProjetosController().router);
        app.use('/api/avaliacoes', new AvaliacoesController().router);
        app.use('/api/vencedores', new VencedoresController().router);

        app.listen(5000, () => {
            console.log('Servidor rodando na porta 5000');
        });
    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error);
    }
};

startServer();