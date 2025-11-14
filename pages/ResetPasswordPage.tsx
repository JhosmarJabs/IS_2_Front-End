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
  const email = localStorage.getItem('passwordResetEmail');

  useEffect(() => {
    if (!token) {
      setError('Enlace de restablecimiento de contraseña inválido. Por favor, solicita uno nuevo.');
    } else if (!email) {
      setError('No se ha encontrado el correo electrónico asociado. Por favor, vuelve a solicitar el restablecimiento de contraseña.');
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!token || !email) {
      setError('Información incompleta. Por favor, inicia el proceso de nuevo desde la página de olvido de contraseña.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.resetPassword({ email, token, newPassword });
      setSuccess('¡Contraseña restablecida con éxito! Redirigiendo al inicio de sesión...');
      localStorage.removeItem('passwordResetEmail'); // Clean up
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'No se pudo restablecer la contraseña. El enlace puede haber expirado.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormDisabled = !!success || !token || !email;

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
          disabled={isFormDisabled}
        />
        <Input 
          placeholder="Confirmar Nueva Contraseña"
          id="confirmPassword" 
          type="password"
          value={confirmPassword} 
          onChange={e => setConfirmPassword(e.target.value)} 
          required 
          autoComplete="new-password"
          disabled={isFormDisabled}
        />
        
        <Button type="submit" isLoading={isLoading} fullWidth disabled={isFormDisabled}>
            Restablecer Contraseña
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;