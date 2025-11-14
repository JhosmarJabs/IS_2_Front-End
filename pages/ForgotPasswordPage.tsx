import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import * as api from '../services/apiService';

import AuthLayout from '../components/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

const ForgotPasswordPage: React.FC = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await api.requestPasswordReset(email);
      localStorage.setItem('passwordResetEmail', email);
      navigate('/check-email', { state: { message: "Si existe una cuenta con ese correo, hemos enviado instrucciones para restablecer tu contraseña." } });
    } catch (err: any) {
      // Show generic message for security reasons
      navigate('/check-email', { state: { message: "Si existe una cuenta con ese correo, hemos enviado instrucciones para restablecer tu contraseña." } });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Recuperar Contraseña">
        <p className="text-center text-sm text-slate-300 mb-6">
            Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
        </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <Alert message={error} type="error" />}
        <Input placeholder="Correo Electrónico" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
        <Button type="submit" isLoading={isLoading} fullWidth>Enviar Enlace</Button>
      </form>
       <div className="mt-6 text-center text-sm text-slate-300">
        ¿Recuerdas tu contraseña?{' '}
        <Link to="/login" className="font-medium text-sky-400 hover:text-sky-300">
          Inicia sesión
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;