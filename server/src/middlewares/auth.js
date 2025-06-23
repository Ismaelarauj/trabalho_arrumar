export const autenticar = (allowedTypes = []) => (req, res, next) => {
    console.log('Middleware autenticar: Verificando sessão...', req.session?.user);
    if (!req.session?.user || typeof req.session.user !== 'object') {
        console.log('Usuário não autenticado ou sessão inválida');
        return res.status(401).json({ error: 'Não autenticado. Faça login.' });
    }

    const userType = req.session.user.tipo;
    const userId = req.session.user.id;
    const userEmail = req.session.user.email;

    if (!userType || !userId || !userEmail) {
        console.log('Dados da sessão incompletos:', req.session.user);
        return res.status(401).json({ error: 'Dados de autenticação inválidos.' });
    }

    console.log(`Tipo do usuário: ${userType}, Tipos permitidos: ${allowedTypes}`);
    if (allowedTypes.length && !allowedTypes.includes(userType)) {
        console.log('Acesso não autorizado para o tipo do usuário');
        return res.status(403).json({ error: 'Acesso não autorizado' });
    }

    req.usuario = {
        id: userId,
        email: userEmail,
        tipo: userType,
    };

    console.log('Usuário autenticado com sucesso:', req.usuario);
    next();
};