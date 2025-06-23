import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import AppRoutes from './routes/routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent = () => {
    const location = useLocation();
    const { auth } = useAuth();

    console.log('Auth:', auth); // Debug
    console.log('Pathname:', location.pathname); // Debug

    if (auth.isAuthenticated === null) {
        return <div>Carregando...</div>;
    }

    const showNav = auth.isAuthenticated && !['/login', '/cadastro'].includes(location.pathname);
    console.log('showNav:', showNav); // Debug

    return (
        <>
            {showNav && <Navigation showNav={true} />}
            <AppRoutes />
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;