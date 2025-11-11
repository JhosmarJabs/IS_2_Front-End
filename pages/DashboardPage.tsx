import React from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        <header className="bg-white dark:bg-slate-800 shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
                <Button onClick={logout} variant="secondary">Cerrar Sesión</Button>
            </div>
        </header>
        <main>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white dark:bg-slate-800 overflow-hidden shadow rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4">
                            ¡Bienvenido de nuevo, {user?.nombre || 'Usuario'}!
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">Has iniciado sesión correctamente en tu cuenta.</p>
                        {user && (
                            <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6">
                                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Nombre Completo</dt>
                                        <dd className="mt-1 text-sm">{user.nombre} {user.apellido}</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Correo Electrónico</dt>
                                        <dd className="mt-1 text-sm">{user.email}</dd>
                                    </div>
                                </dl>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    </div>
  );
};

export default DashboardPage;