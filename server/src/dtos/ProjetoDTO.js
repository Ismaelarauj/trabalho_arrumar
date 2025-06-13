class ProjetoDTO {
    constructor(projeto) {
        this.id = projeto.id;
        this.titulo = projeto.titulo;
        this.resumo = projeto.resumo;
        this.areaTematica = projeto.areaTematica;
        this.dataEnvio = projeto.dataEnvio;
        this.status = projeto.status;
        this.arquivoPath = projeto.arquivoPath;
        this.autor = projeto.Autor ? {
            id: projeto.Autor.id,
            nome: projeto.Autor.nome,
            email: projeto.Autor.email
        } : null;
        this.coautores = projeto.Coautores ? projeto.Coautores.map(co => ({
            id: co.id,
            nome: co.nome,
            email: co.email
        })) : [];
        this.premio = projeto.Premio ? {
            id: projeto.Premio.id,
            nome: projeto.Premio.nome,
            ano: projeto.Premio.ano
        } : null;
        this.avaliacoes = projeto.avaliacoes && Array.isArray(projeto.avaliacoes) ? projeto.avaliacoes.map(a => ({
            id: a.id,
            parecer: a.parecer,
            nota: a.nota,
            dataAvaliacao: a.dataAvaliacao,
            avaliador: a.Avaliador ? {
                id: a.Avaliador.id,
                nome: a.Avaliador.nome
            } : null
        })) : [];
    }
}

export default ProjetoDTO;