class UsuarioDTO {
    constructor(usuario) {
        this.id = usuario.id;
        this.nome = usuario.nome;
        this.cpf = usuario.cpf;
        this.email = usuario.email;
        this.tipo = usuario.tipo;
        this.projetos = usuario.ProjetosAutor ? usuario.ProjetosAutor.map(p => ({
            id: p.id,
            titulo: p.titulo,
            status: p.status
        })) : [];
    }
}

export default UsuarioDTO;