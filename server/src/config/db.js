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
        await sequelize.sync({ force: true });
        console.log('Tabelas sincronizadas');

        // Criar administrador fixo
        console.log('Verificando administrador existente...');
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
            } catch (createError) {
                console.error('Erro ao criar administrador:', createError);
                throw createError; // Lançar erro para interrupção
            }
        } else {
            console.log('Administrador já existe no banco de dados:', adminExistente.toJSON());
        }
    } catch (error) {
        console.error('Erro ao conectar ao MySQL ou criar administrador:', error.stack || error);
        throw error;
    }
};