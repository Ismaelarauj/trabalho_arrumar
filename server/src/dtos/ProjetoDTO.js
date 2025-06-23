// server/dtos/ProjetoDTO.js
class ProjetoDTO {
    constructor(projeto) {
        this.id = projeto.id;
        this.premioId = projeto.premioId;
        this.autorId = projeto.autorId;
        this.titulo = projeto.titulo;
        this.resumo = projeto.resumo;
        this.areaTematica = projeto.areaTematica;
        this.dataEnvio = projeto.dataEnvio;
        this.arquivoPath = projeto.arquivoPath;
        this.status = projeto.status;
        this.Premio = projeto.Premio ? {
            id: projeto.Premio.id,
            nome: projeto.Premio.nome,
            ano: projeto.Premio.ano
        } : null;
        this.Autor = projeto.Autor ? {
            id: projeto.Autor.id,
            nome: projeto.Autor.nome
        } : null;
        this.Coautores = projeto.Coautores ? projeto.Coautores.map(c => ({
            id: c.id,
            nome: c.nome
        })) : [];
        this.avaliacoes = projeto.avaliacoes ? projeto.avaliacoes.map(a => ({
            id: a.id,
            nota: a.nota,
            comentario: a.comentario,
            avaliadorId: a.avaliadorId,
            Avaliador: a.Avaliador ? { id: a.Avaliador.id, nome: a.Avaliador.nome } : null
        })) : [];
    }
}

export default ProjetoDTO;