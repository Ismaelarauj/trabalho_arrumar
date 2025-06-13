import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
    const { auth } = useContext(AuthContext);

    if (auth.isAuthenticated === null) {
        console.log('ProtectedRoute: Carregando autenticação...');
        return <div>Carregando...</div>;
    }

    if (!auth.isAuthenticated) {
        console.log('ProtectedRoute: Não autenticado, redirecionando para /login');
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(auth.user?.tipo)) {
        console.log('ProtectedRoute: Tipo', auth.user?.tipo, 'não permitido para', allowedRoles, 'redirecionando para /login');
        return <Navigate to="/login" replace state={{ error: `Você precisa estar autenticado como ${allowedRoles.join(' ou ')} para acessar essa página` }} />;
    }

    console.log('ProtectedRoute: Acesso permitido para', auth.user?.tipo, 'na rota', window.location.pathname);
    return children;
};
export default ProtectedRoute;