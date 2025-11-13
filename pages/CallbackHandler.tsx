import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import * as api from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';
import { AuthTokens } from '../types';

const CallbackHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleLogin = async () => {
      const magicToken = searchParams.get('token');
      const accessToken = searchParams.get('accessToken');
      const refreshToken = searchParams.get('refreshToken');
      const expiresAt = searchParams.get('expiresAt') || '';

      if (accessToken && refreshToken) {
        // Nuevo flujo: los tokens están directamente en la URL
        try {
          const tokens: AuthTokens = { accessToken, refreshToken, expiresAt };
          const { user } = api.createSessionFromTokens(tokens);
          login(tokens, user);
          navigate('/welcome', { state: { name: user.nombre } });
        } catch (err: any) {
          setError('Sesión inválida o token expirado. Por favor, inténtalo de nuevo.');
        }
      } else if (magicToken) {
        // Flujo existente: intercambiar magic token por JWTs
        try {
          const { tokens, user } = await api.loginWithMagicLink(magicToken);
          login(tokens, user);
          navigate('/welcome', { state: { name: user.nombre } });
        } catch (err: any) {
          setError('Enlace mágico inválido o expirado. Por favor, inténtalo de nuevo.');
        }
      } else {
        setError('No se encontró un token de autenticación. Por favor, intenta iniciar sesión de nuevo.');
      }
    };

    handleLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, login, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      {error ? (
        <div className="max-w-md w-full text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <Alert message={error} type="error" />
            <button onClick={() => navigate('/login')} className="mt-4 font-medium text-sky-600 hover:text-sky-500">
                Volver al Inicio de Sesión
            </button>
        </div>
      ) : (
        <>
          <Spinner size="lg" />
          <p className="mt-4 text-lg">Autenticando, por favor espera...</p>
        </>
      )}
    </div>
  );
};

export default CallbackHandler;