import { Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';
import { defineProjeto } from '../models/Projeto.js';
import { defineAvaliacao } from '../models/Avaliacao.js';
import { defineCronograma } from '../models/Cronograma.js';
import { definePremio } from '../models/Premio.js';
import { defineUsuario } from '../models/Usuario.js';
import { defineContato } from '../models/Contato.js';
import { defineEndereco } from '../models/Endereco.js';
import { defineAssociations } from '../models/associations.js';

export const sequelize = new Sequelize('premios', 'root', 'Francandrade@6810', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    logging: console.log // Ativar logging para depuração
});

export const connectDB = async () => {
    try {
        console.log('Tentando conectar ao MySQL...');
        await sequelize.authenticate();
        console.log('MySQL conectado');

        // Definir os modelos
        const Projeto = defineProjeto(sequelize);
        const Avaliacao = defineAvaliacao(sequelize);
        const Cronograma = defineCronograma(sequelize);
        const Premio = definePremio(sequelize);
        const Usuario = defineUsuario(sequelize);
        console.log('Modelos definidos:', { Usuario });
        const Contato = defineContato(sequelize);
        const Endereco = defineEndereco(sequelize);

        // Definir as associações
        defineAssociations({ Projeto, Avaliacao, Cronograma, Premio, Usuario, Contato, Endereco });

        // Sincronizar o banco de dados
        console.log('Sincronizando tabelas...');
        await sequelize.sync({ force: true }); // Evita sobrescrever o banco
        console.log('Tabelas sincronizadas');

        // Criar administrador fixo
        console.log('Verificando administrador existente...');
        let adminId = null;
        const adminExistente = await Usuario.findOne({ where: { email: 'admin@example.com' } });
        console.log('Resultado da busca por admin:', adminExistente ? 'Encontrado' : 'Não encontrado');
        if (!adminExistente) {
            console.log('Nenhum administrador encontrado. Criando administrador...');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            console.log('Senha hasheada:', hashedPassword);
            try {
                console.log('Tentando criar administrador com dados:', {
                    nome: 'Administrador',
                    cpf: '00000000000',
                    dataNascimento: '1970-01-01',
                    tipo: 'admin',
                    email: 'admin@example.com',
                    senha: hashedPassword
                });
                const novoAdmin = await Usuario.create({
                    nome: 'Administrador',
                    cpf: '00000000000',
                    dataNascimento: '1970-01-01',
                    tipo: 'admin',
                    email: 'admin@example.com',
                    senha: hashedPassword
                });
                console.log('Administrador criado:', novoAdmin.toJSON());
                adminId = novoAdmin.id;
            } catch (createError) {
                console.error('Erro ao criar administrador:', createError);
                throw createError; // Lançar erro para interrupção
            }
        } else {
            console.log('Administrador já existe no banco de dados:', adminExistente.toJSON());
            adminId = adminExistente.id;
        }

        // Criar prêmios usando o adminId como criadorId
        console.log('Verificando prêmios existentes...');
        const premiosExistentes = await Premio.count();
        if (premiosExistentes === 0) {
            console.log('Nenhum prêmio encontrado. Criando prêmios...');
            const premios = [
                {
                    nome: 'Prêmio Inovação 2025',
                    descricao: 'Reconhecimento para projetos inovadores em tecnologia.',
                    ano: 2025,
                    criadorId: adminId, // Associar ao administrador
                    Cronogramas: [
                        { etapa: 'Inscrições', dataInicio: '2025-01-01', dataFim: '2025-02-01' },
                        { etapa: 'Avaliação', dataInicio: '2025-02-02', dataFim: '2025-03-01' },
                        { etapa: 'Premiação', dataInicio: '2025-03-02', dataFim: '2025-03-02' }
                    ]
                },
                {
                    nome: 'Prêmio Ciência 2025',
                    descricao: 'Reconhecimento para avanços científicos.',
                    ano: 2025,
                    criadorId: adminId, // Associar ao administrador
                    Cronogramas: [
                        { etapa: 'Inscrições', dataInicio: '2025-03-01', dataFim: '2025-04-01' },
                        { etapa: 'Avaliação', dataInicio: '2025-04-02', dataFim: '2025-05-01' },
                        { etapa: 'Premiação', dataInicio: '2025-05-02', dataFim: '2025-05-02' }
                    ]
                },
                {
                    nome: 'Prêmio Sustentabilidade 2025',
                    descricao: 'Reconhecimento para projetos sustentáveis.',
                    ano: 2025,
                    criadorId: adminId, // Associar ao administrador
                    Cronogramas: [
                        { etapa: 'Inscrições', dataInicio: '2025-05-01', dataFim: '2025-06-01' },
                        { etapa: 'Avaliação', dataInicio: '2025-06-02', dataFim: '2025-07-01' },
                        { etapa: 'Premiação', dataInicio: '2025-07-02', dataFim: '2025-07-02' }
                    ]
                }
            ];

            await Promise.all(premios.map(async (premio) => {
                const novoPremio = await Premio.create(premio, {
                    include: [{ model: Cronograma, as: 'cronogramas' }]
                });
                console.log('Prêmio criado:', novoPremio.toJSON());
            }));
        } else {
            console.log('Prêmios já existem no banco de dados. Quantidade:', premiosExistentes);
        }

    } catch (error) {
        console.error('Erro ao conectar ao MySQL ou criar dados:', error.stack || error);
        throw error;
    }
};