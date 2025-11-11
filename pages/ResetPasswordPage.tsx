import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as api from '../services/apiService';

import AuthLayout from '../components/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      setError('Enlace de restablecimiento de contraseña inválido. Por favor, solicita uno nuevo.');
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!token || !email) {
      setError('Falta el token o el correo. Por favor, utiliza el enlace de tu correo electrónico.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.resetPassword({ email, token, newPassword });
      setSuccess('¡Contraseña restablecida con éxito! Redirigiendo al inicio de sesión...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'No se pudo restablecer la contraseña. El enlace puede haber expirado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Nueva Contraseña">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <Alert message={error} type="error" />}
        {success && <Alert message={success} type="success" />}
        
        <Input 
          placeholder="Nueva Contraseña"
          id="newPassword" 
          type="password"
          value={newPassword} 
          onChange={e => setNewPassword(e.target.value)} 
          required 
          autoComplete="new-password"
          disabled={!!success || !token || !email}
        />
        <Input 
          placeholder="Confirmar Nueva Contraseña"
          id="confirmPassword" 
          type="password"
          value={confirmPassword} 
          onChange={e => setConfirmPassword(e.target.value)} 
          required 
          autoComplete="new-password"
          disabled={!!success || !token || !email}
        />
        
        <Button type="submit" isLoading={isLoading} fullWidth disabled={!!success || !token || !email}>
            Restablecer Contraseña
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
