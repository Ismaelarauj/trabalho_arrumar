import express from 'express';
import cors from 'cors';
import session from 'express-session';
import SequelizeStore from 'connect-session-sequelize';
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
import { ProjetosController } from './src/controllers/ProjetosController.js';
import { AvaliacoesController } from './src/controllers/AvaliacoesController.js';
import { AvaliacoesService } from './src/services/AvaliacoesService.js';
import { VencedoresController } from './src/controllers/VencedoresController.js';
import { VencedoresService } from './src/services/VencedoresService.js';
import { autenticar } from './src/middlewares/auth.js';
import ProjetoDTO from './src/dtos/ProjetoDTO.js';
import { ProjetosService } from './src/services/ProjetosService.js';

const app = express();
const port = 5000;

// Configuração do CORS para permitir cookies
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Configuração do express-session com connect-session-sequelize
const SequelizeStoreConstructor = SequelizeStore(session.Store);
const sessionStore = new SequelizeStoreConstructor({
    db: sequelize,
    tableName: 'Sessions',
    checkExpirationInterval: 15 * 60 * 1000,
    expiration: 24 * 60 * 60 * 1000,
    extendDefaultFields: (defaults, session) => {
        try {
            const now = new Date();
            const expiresAt = new Date(now.getTime() + (24 * 60 * 60 * 1000));
            return {
                ...defaults,
                createdAt: now.toISOString(),
                expiresAt: expiresAt.toISOString(),
                data: session ? JSON.stringify(session) : '{}', // Garante valor padrão seguro
            };
        } catch (error) {
            console.error('Erro ao estender campos da sessão:', error.message);
            return {
                ...defaults,
                createdAt: new Date().toISOString(),
                expiresAt: new Date().toISOString(),
                data: '{}', // Valor padrão seguro
            };
        }
    },
});

app.use(
    session({
        secret: 'chave_secreta_muito_segura',
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
        },
    })
);

// Middleware simplificado para log
app.use((req, res, next) => {
    console.log(`Requisição recebida: ${req.method} ${req.url}, SessionID: ${req.sessionID}`);
    console.log('Cookies recebidos:', req.headers.cookie);
    if (req.session.user) {
        console.log(`Usuário autenticado na sessão: ${req.session.user.email}`);
    } else {
        console.log('Nenhum usuário autenticado na sessão');
    }
    next();
});

// Limpar a tabela de sessões antes de iniciar o servidor
const clearSessionsTable = async () => {
    try {
        await sequelize.query('TRUNCATE TABLE "Sessions" RESTART IDENTITY CASCADE');
        console.log('Tabela de sessões limpa com sucesso.');
    } catch (error) {
        console.error('Erro ao limpar tabela de sessões:', error.message);
    }
};

sessionStore.sync({ force: true }).then(async () => {
    console.log('Tabela de sessões sincronizada com o banco de dados.');
    await clearSessionsTable();
}).catch(err => {
    console.error('Erro ao sincronizar tabela de sessões:', err);
});

app.get('/test', (req, res) => {
    console.log('Rota de teste acessada');
    res.json({ message: 'Servidor está funcionando' });
});

const startServer = async () => {
    try {
        console.log('Iniciando conexão com o banco de dados...');
        await connectDB();
        console.log('Conexão com o banco de dados estabelecida com sucesso:', sequelize);

        sequelize.models.Projeto = defineProjeto(sequelize);
        sequelize.models.Avaliacao = defineAvaliacao(sequelize);
        sequelize.models.Cronograma = defineCronograma(sequelize);
        sequelize.models.Premio = definePremio(sequelize);
        sequelize.models.Usuario = defineUsuario(sequelize);
        sequelize.models.Contato = defineContato(sequelize);
        sequelize.models.Endereco = defineEndereco(sequelize);

        await sequelize.sync({ alter: true });
        console.log('Modelos sincronizados com o banco de dados');

        defineAssociations(sequelize.models);

        const allModels = sequelize.models;
        const projetosService = new ProjetosService(allModels);
        const premiosController = new PremiosController(allModels);
        const usuariosController = new UsuariosController(allModels);
        const projetosController = new ProjetosController(allModels);
        const avaliacoesService = new AvaliacoesService(allModels);
        const avaliacoesController = new AvaliacoesController(avaliacoesService);
        const vencedoresService = new VencedoresService(allModels);
        const vencedoresController = new VencedoresController(vencedoresService);

        app.post('/api/usuarios/login', (req, res) => {
            console.log('Requisição de login recebida:', req.body.email);
            usuariosController.login(req, res);
        });

        app.get('/api/usuarios/check-auth', (req, res) => {
            console.log('Verificando autenticação...');
            usuariosController.checkAuth(req, res);
        });

        app.post('/api/usuarios/logout', (req, res) => {
            console.log('Requisição de logout recebida');
            req.session.destroy((err) => {
                if (err) {
                    console.error('Erro ao destruir sessão:', err);
                    return res.status(500).json({ error: 'Erro ao fazer logout' });
                }
                console.log('Sessão destruída com sucesso');
                res.json({ message: 'Logout realizado com sucesso' });
            });
        });

        app.post('/api/usuarios', (req, res) => usuariosController.create(req, res));
        app.post('/api/usuarios/recuperar-senha', (req, res) => {
            console.log('Requisição de recuperação de senha:', req.body.email);
            // Implementar lógica de recuperação (ex.: enviar email)
            res.json({ message: 'Instruções enviadas para o email' });
        });


        app.get('/api/usuarios', autenticar(['admin', 'autor', 'avaliador']), (req, res) => {
            console.log('Requisição GET /api/usuarios por:', req.session.user?.email);
            usuariosController.getAll(req, res);
        });
        app.get('/api/usuarios/:id', autenticar(['admin', 'autor', 'avaliador']), (req, res) => usuariosController.getById(req, res));
        app.put('/api/usuarios/:id', autenticar(['admin', 'autor', 'avaliador']), (req, res) => usuariosController.update(req, res));
        app.delete('/api/usuarios/:id', autenticar(['admin']), (req, res) => usuariosController.delete(req, res));

        app.get('/api/premios', autenticar(['admin', 'autor', 'avaliador']), (req, res) => premiosController.listar(req, res));
        app.post('/api/premios', autenticar(['admin']), (req, res) => premiosController.criar(req, res));
        app.put('/api/premios/:id', autenticar(['admin']), (req, res) => premiosController.atualizar(req, res));
        app.delete('/api/premios/:id', autenticar(['admin']), (req, res) => premiosController.excluir(req, res));
        app.get('/api/premios/vencedores', autenticar(['admin', 'autor', 'avaliador']), (req, res) => premiosController.listarVencedores(req, res));

        app.use('/api/projetos', projetosController.router);

        app.get('/api/projetos/avaliados', autenticar(['avaliador']), async (req, res) => {
            try {
                const userId = req.session.user.id;
                const projetos = await sequelize.models.Projeto.findAll({
                    include: [
                        { model: sequelize.models.Avaliacao, where: { avaliadorId: userId }, required: true },
                        { model: sequelize.models.Usuario, as: 'Autor' },
                        { model: sequelize.models.Premio, as: 'Premio' },
                        { model: sequelize.models.Usuario, as: 'Coautores', through: { attributes: [] } },
                    ],
                });
                console.log('Projetos avaliados encontrados:', projetos.map(p => ({ id: p.id, autorId: p.autorId, status: p.status })));
                const projetosDTO = projetos.map(projeto => new ProjetoDTO(projeto));
                res.json(projetosDTO);
            } catch (error) {
                console.error('Erro ao buscar projetos avaliados:', error.message);
                res.status(500).json({ error: 'Erro ao buscar projetos avaliados: ' + error.message });
            }
        });

        app.get('/api/projetos/pendentes', autenticar(['admin', 'autor', 'avaliador']), async (req, res) => {
            try {
                const userId = req.session.user.id;
                const userRole = req.session.user.tipo;
                let whereClause = { status: 'pendente' };
                if (userRole === 'autor') {
                    whereClause.autorId = userId;
                } else if (userRole === 'avaliador') {
                    whereClause.avaliadorId = null;
                }
                console.log('Cláusula WHERE usada:', whereClause);
                const projetos = await projetosService.getAll(whereClause);
                console.log('Projetos pendentes retornados pelo serviço:', projetos);
                res.json(projetos);
            } catch (error) {
                console.error('Erro ao buscar projetos pendentes:', error.message);
                res.status(500).json({ error: 'Erro ao buscar projetos pendentes: ' + error.message });
            }
        });

        app.use('/api/avaliacoes', avaliacoesController.router);

        app.get('/api/vencedores', async (req, res) => {
            try {
                const vencedores = await vencedoresService.getAll();
                res.json(vencedores);
            } catch (error) {
                res.status(500).json({ error: 'Erro ao buscar vencedores: ' + error.message });
            }
        });

        app.use((err, req, res, next) => {
            console.error('Erro no servidor:', err.stack);
            res.status(500).json({ error: 'Erro interno do servidor' });
        });

        app.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
        });
    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error.stack || error);
        process.exit(1);
    }
};

startServer();