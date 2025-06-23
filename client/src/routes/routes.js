import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Controllers
import LoginController from '../controllers/LoginController';
import AvaliacaoProjetoController from '../controllers/AvaliacaoProjetoController';
import CrudPremioController from '../controllers/CrudPremioController';
import CrudUsuarioController from '../controllers/CrudUsuarioController';
import EnvioProjetoController from '../controllers/EnvioProjetoController';
import ListaProjetosController from '../controllers/ListaProjetosController';
import ListaVencedoresController from '../controllers/ListaVencedoresController';

// Views
import LoginView from '../views/LoginView';
import AvaliacaoProjetoView from '../views/AvaliacaoProjetoView';
import CrudPremioView from '../views/CrudPremioView';
import CrudUsuarioView from '../views/CrudUsuarioView';
import EnvioProjetoView from '../views/EnvioProjetoView';
import ListaProjetosView from '../views/ListaProjetosView';
import ListaVencedoresView from '../views/ListaVencedoresView';
import RecuperarSenhaView from '../views/RecuperarSenhaView';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginView {...LoginController()} />} />
            <Route
                path="/premios"
                element={<CrudPremioView {...CrudPremioController()} />}
            />
            <Route
                path="/premios/cadastrar"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <CrudPremioView {...CrudPremioController()} />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/usuarios"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <CrudUsuarioView {...CrudUsuarioController()} />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/cadastro"
                element={<CrudUsuarioView {...CrudUsuarioController()} />}
            />

            <Route
                path="/recuperar-senha"
                   element={<RecuperarSenhaView />}
            />


            <Route
                path="/projetos/enviar"
                element={
                    <ProtectedRoute allowedRoles={['autor']}>
                        <EnvioProjetoView {...EnvioProjetoController()} />
                    </ProtectedRoute>
                }
            />
           {/* <Route
                path="/projetos/avaliar"
                element={
                    <ProtectedRoute allowedRoles={['avaliador']}>
                        <AvaliacaoProjetoView {...AvaliacaoProjetoController()} />
                    </ProtectedRoute>
                }
            />*/}
            <Route
                path="/projetos/avaliar"
                element={
                        <AvaliacaoProjetoView {...AvaliacaoProjetoController()} />
                }
            />
           {/* <Route
                path="/projetos/avaliados"
                element={
                    <ProtectedRoute allowedRoles={['avaliador']}>
                        <ListaProjetosView {...ListaProjetosController()} />
                    </ProtectedRoute>
                }
            />*/}
             <Route
                path="/projetos/avaliados"
                element={
                        <ListaProjetosView {...ListaProjetosController()} />
                }
            />
            <Route
                path="/projetos"
                element={<ListaProjetosView {...ListaProjetosController()} />}
            />
            <Route
                path="/vencedores"
                element={<ListaVencedoresView {...ListaVencedoresController()} />}
            />
            <Route
                path="/my-projects"
                element={
                    <ProtectedRoute allowedRoles={['autor']}>
                        <ListaProjetosView {...ListaProjetosController()} />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/edit-profile"
                element={
                    <ProtectedRoute allowedRoles={['admin', 'autor', 'avaliador']}>
                        <CrudUsuarioView {...CrudUsuarioController()} />
                    </ProtectedRoute>
                }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};
export default AppRoutes;