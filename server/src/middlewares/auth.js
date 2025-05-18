import jwt from 'jsonwebtoken';

const JWT_SECRET = '505050';

export const autenticar = (allowedRoles = []) => (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
            return res.status(403).json({ error: 'Acesso não autorizado' });
        }
        req.usuario = decoded;
        next();
    } catch (error) {
        console.error('Erro na autenticação:', error);
        return res.status(401).json({ error: 'Token inválido' });
    }
};