import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Spinner from '../components/common/Spinner';

const WelcomePage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const name = location.state?.name || 'Usuario';

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/dashboard', { replace: true });
        }, 2500); // 2.5 segundos de espera

        return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
            <div className="text-center p-8">
                <div className="mb-4">
                    <svg className="mx-auto h-16 w-16 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                    ¡Bienvenido de nuevo, {name}!
                </h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                    Has iniciado sesión correctamente.
                </p>
                <div className="mt-8 flex items-center justify-center gap-x-3">
                    <Spinner />
                    <p className="text-slate-500 dark:text-slate-400">Redirigiendo a tu panel...</p>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;
