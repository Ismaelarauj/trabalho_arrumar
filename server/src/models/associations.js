export const defineAssociations = ({ Projeto, Avaliacao, Cronograma, Premio, Usuario, Contato, Endereco }) => {
    // Associações entre Premio e Cronograma
    Premio.hasMany(Cronograma, { foreignKey: 'premioId', as: 'cronogramas' });
    Cronograma.belongsTo(Premio, { foreignKey: 'premioId', as: 'Premio' });

    // Associações entre Premio e Projeto
    Premio.hasMany(Projeto, { foreignKey: 'premioId', as: 'projetos' });
    Projeto.belongsTo(Premio, { foreignKey: 'premioId', as: 'Premio' }); // Ajustado para 'Premio'

    // Associações entre Projeto e Avaliacao
    Projeto.hasMany(Avaliacao, { foreignKey: 'projetoId', as: 'avaliacoes' });
    Avaliacao.belongsTo(Projeto, { foreignKey: 'projetoId', as: 'Projeto' });

    // Associações entre Usuario e Projeto (autor principal e coautores)
    Projeto.belongsTo(Usuario, { as: 'Autor', foreignKey: 'autorId' }); // Ajustado de 'AutorPrincipal' para 'Autor'
    Projeto.belongsToMany(Usuario, { as: 'Coautores', through: 'ProjetoCoautores', foreignKey: 'projetoId' }); // Ajustado de 'CoautoresProjeto' para 'Coautores'
    Usuario.hasMany(Projeto, { as: 'ProjetosAutor', foreignKey: 'autorId' });
    Usuario.belongsToMany(Projeto, { as: 'ProjetosCoautorados', through: 'ProjetoCoautores', foreignKey: 'usuarioId' }); // Ajustado 'autorId' para 'usuarioId'

    // Associações entre Avaliacao e Usuario (avaliador)
    Avaliacao.belongsTo(Usuario, { as: 'Avaliador', foreignKey: 'avaliadorId' });
    Usuario.hasMany(Avaliacao, { as: 'Avaliacoes', foreignKey: 'avaliadorId' });

    // Associações entre Usuario, Contato e Endereco
    Usuario.hasOne(Contato, { foreignKey: 'usuarioId', as: 'Contato' });
    Contato.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'Usuario' });

    Usuario.hasOne(Endereco, { foreignKey: 'usuarioId', as: 'Endereco' });
    Endereco.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'Usuario' });
};