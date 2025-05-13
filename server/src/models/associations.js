export const defineAssociations = ({ Projeto, Avaliacao, Cronograma, Premio }) => {
    Projeto.hasMany(Avaliacao, { foreignKey: 'projetoId', as: 'Avaliacoes' });
    Avaliacao.belongsTo(Projeto, { foreignKey: 'projetoId' });

    Cronograma.belongsTo(Premio, { foreignKey: 'premioId' });
    Premio.hasMany(Cronograma, { foreignKey: 'premioId' });
};