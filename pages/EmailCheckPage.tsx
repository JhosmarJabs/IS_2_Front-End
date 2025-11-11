import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

const EmailCheckPage: React.FC = () => {
  const location = useLocation();
  const message = location.state?.message || 'Por favor, revisa tu bandeja de entrada y sigue las instrucciones.';

  return (
    <AuthLayout title="Revisa tu Correo">
      <div className="text-center text-slate-300">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 mb-6 border border-white/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-sky-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p>{message}</p>
        <div className="mt-8">
          <Link
            to="/login"
            className="font-medium text-sky-400 hover:text-sky-300"
          >
            &larr; Volver a Iniciar Sesión
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default EmailCheckPage;
