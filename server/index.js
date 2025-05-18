import express from 'express';
import cors from 'cors';
import { connectDB, sequelize } from './src/config/db.js';
import { defineProjeto } from './src/models/Projeto.js';
import { defineAvaliacao } from './src/models/Avaliacao.js';
import { defineCronograma } from './src/models/Cronograma.js';
import { definePremio } from './src/models/Premio.js';
import { defineUsuario } from './src/models/Usuario.js';
import { defineContato } from './src/models/Contato.js';
import { defineEndereco } from './src/models/Endereco.js';
import { defineAssociations } from './src/models/associations.js';
import { PremiosController } from './src/controllers/PremiosController.js';
import { UsuariosController } from './src/controllers/UsuariosController.js';
import { ProjetosService } from './src/services/ProjetosService.js';
import { AvaliacoesController } from './src/controllers/AvaliacoesController.js';
import { AvaliacoesService } from './src/services/AvaliacoesService.js';
import { VencedoresController } from './src/controllers/VencedoresController.js';
import { VencedoresService } from './src/services/VencedoresService.js'; // Importado o VencedoresService
import { autenticar } from './src/middlewares/auth.js';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
    console.log('Rota de teste acessada');
    res.json({ message: 'Servidor está funcionando' });
});

const startServer = async () => {
    try {
        await connectDB();
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados estabelecida e autenticada com sucesso');

        const Projeto = defineProjeto(sequelize);
        const Avaliacao = defineAvaliacao(sequelize);
        const Cronograma = defineCronograma(sequelize);
        const Premio = definePremio(sequelize);
        const Usuario = defineUsuario(sequelize);
        const Contato = defineContato(sequelize);
        const Endereco = defineEndereco(sequelize);

        await sequelize.sync({ force: false });
        console.log('Modelos sincronizados com o banco de dados');

        defineAssociations({ Projeto, Avaliacao, Cronograma, Premio, Usuario, Contato, Endereco });

        const premiosController = new PremiosController({ Premio, Cronograma, Projeto, Avaliacao, Usuario });
        const usuariosController = new UsuariosController({ Usuario, Contato, Endereco });
        const projetosService = new ProjetosService({ Projeto, Usuario, Premio });
        const avaliacoesService = new AvaliacoesService({ Avaliacao, Projeto, Usuario });
        const avaliacoesController = new AvaliacoesController(avaliacoesService);
        const vencedoresService = new VencedoresService({ Projeto, Avaliacao, Usuario, Premio }); // Instanciado o VencedoresService
        const vencedoresController = new VencedoresController(vencedoresService); // Passado o serviço ao controlador

        app.post('/api/usuarios/login', (req, res) => usuariosController.login(req, res));
        app.post('/api/usuarios', (req, res) => usuariosController.create(req, res));
        app.get('/api/usuarios', autenticar(['admin', 'autor']), (req, res) => usuariosController.getAll(req, res));
        app.get('/api/usuarios/:id', autenticar(['admin', 'autor', 'avaliador']), (req, res) => usuariosController.getById(req, res));
        app.put('/api/usuarios/:id', autenticar(['admin', 'autor', 'avaliador']), (req, res) => usuariosController.update(req, res));
        app.delete('/api/usuarios/:id', autenticar(['admin']), (req, res) => usuariosController.delete(req, res));

        app.get('/api/premios', autenticar(['admin', 'autor', 'avaliador']), (req, res) => {
            console.log('Rota GET /api/premios acessada');
            premiosController.listar(req, res);
        });
        app.post('/api/premios', autenticar(['admin']), (req, res) => {
            console.log('Rota POST /api/premios acessada');
            premiosController.criar(req, res);
        });
        app.put('/api/premios/:id', autenticar(['admin']), (req, res) => {
            console.log(`Rota PUT /api/premios/${req.params.id} acessada`);
            premiosController.atualizar(req, res);
        });
        app.delete('/api/premios/:id', autenticar(['admin']), (req, res) => {
            console.log(`Rota DELETE /api/premios/${req.params.id} acessada`);
            premiosController.excluir(req, res);
        });
        app.get('/api/premios/vencedores', autenticar(['admin', 'autor', 'avaliador']), (req, res) => {
            console.log('Rota GET /api/premios/vencedores acessada');
            premiosController.listarVencedores(req, res);
        });

        app.get('/api/projetos', autenticar(['admin', 'autor', 'avaliador']), async (req, res) => {
            try {
                const projetos = await projetosService.getAll();
                res.json(projetos);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        app.get('/api/projetos/:id', autenticar(['admin', 'autor', 'avaliador']), async (req, res) => {
            try {
                const projeto = await projetosService.getById(req.params.id);
                res.json(projeto);
            } catch (error) {
                res.status(error.message.includes('não encontrado') ? 404 : 500).json({ error: error.message });
            }
        });

        app.post('/api/projetos', autenticar(['autor']), async (req, res) => {
            try {
                const projeto = await projetosService.create(req.body);
                res.status(201).json(projeto);
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        });

        app.put('/api/projetos/:id', autenticar(['autor', 'admin']), async (req, res) => {
            try {
                const projeto = await projetosService.update(req.params.id, req.body);
                res.json(projeto);
            } catch (error) {
                res.status(error.message.includes('não encontrado') ? 404 : 400).json({ error: error.message });
            }
        });

        app.delete('/api/projetos/:id', autenticar(['autor', 'admin']), async (req, res) => {
            try {
                await projetosService.delete(req.params.id);
                res.json({ message: 'Projeto excluído com sucesso' });
            } catch (error) {
                res.status(error.message.includes('não encontrado') ? 404 : 500).json({ error: error.message });
            }
        });

        app.use('/api/avaliacoes', avaliacoesController.router);

        app.get('/api/vencedores', autenticar(['admin', 'autor', 'avaliador']), (req, res) => {
            vencedoresController.getAll(req, res);
        });

        app.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
        });
    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error);
    }
};

startServer();