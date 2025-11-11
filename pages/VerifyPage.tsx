import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import * as api from '../services/apiService';
import { VerificationPurpose } from '../types';

import AuthLayout from '../components/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

const VerifyPage: React.FC = () => {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.verifyToken(email, token, VerificationPurpose.EMAIL_VERIFICATION);
      setSuccess('¡Cuenta verificada con éxito! Redirigiendo al inicio de sesión...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Token inválido. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.resendVerification(email);
      setSuccess('Se ha enviado un nuevo código de verificación a tu correo.');
    } catch (err: any) {
      setError(err.message || 'No se pudo reenviar el código.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Verifica tu Cuenta">
        <div className="text-center text-slate-300 mb-6">
            <p>Hemos enviado un código de 6 dígitos a <strong>{email}</strong>.</p>
            <p>Ingrésalo para activar tu cuenta.</p>
        </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <Alert message={error} type="error" />}
        {success && <Alert message={success} type="success" />}
        <Input 
          placeholder="Código de Verificación"
          id="token" 
          value={token} 
          onChange={e => setToken(e.target.value)} 
          required 
          inputMode="numeric"
          maxLength={6}
          />
        <Button type="submit" isLoading={isLoading} fullWidth>Verificar Cuenta</Button>
      </form>
       <div className="mt-4 text-center text-sm">
        <p className="text-slate-300">¿No recibiste el código?</p>
        <button onClick={handleResend} disabled={isLoading} className="mt-2 font-medium text-sky-400 hover:text-sky-300 disabled:opacity-50">
            Reenviar Código
        </button>
      </div>
    </AuthLayout>
  );
};

export default VerifyPage;
