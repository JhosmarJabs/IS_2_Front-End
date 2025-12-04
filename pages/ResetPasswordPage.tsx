import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import * as api from '../services/apiService';

import AuthLayout from '../components/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const token = searchParams.get('token');
  const email = localStorage.getItem('passwordResetEmail');

  // Requisitos de contraseña
  const passwordRequirements: PasswordRequirement[] = useMemo(() => [
    { label: 'Mínimo 8 caracteres', test: (pwd) => pwd.length >= 8 },
    { label: 'Al menos una letra mayúscula', test: (pwd) => /[A-Z]/.test(pwd) },
    { label: 'Al menos una letra minúscula', test: (pwd) => /[a-z]/.test(pwd) },
    { label: 'Al menos un número', test: (pwd) => /[0-9]/.test(pwd) },
    { label: 'Al menos un carácter especial (!@#$%...)', test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd) },
  ], []);

  // Validar requisitos en tiempo real
  const passwordValidation = useMemo(() => {
    return passwordRequirements.map(req => ({
      ...req,
      isValid: req.test(newPassword)
    }));
  }, [newPassword, passwordRequirements]);

  const allRequirementsMet = passwordValidation.every(req => req.isValid);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

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
    
    if (!allRequirementsMet) {
      setError('La contraseña no cumple con todos los requisitos.');
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
      localStorage.removeItem('passwordResetEmail');
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
        
        <div className="relative">
          <Input 
            placeholder="Nueva Contraseña"
            id="newPassword" 
            type={showNewPassword ? "text" : "password"}
            value={newPassword} 
            onChange={e => setNewPassword(e.target.value)} 
            required 
            autoComplete="new-password"
            disabled={isFormDisabled}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            disabled={isFormDisabled}
          >
            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        {/* Indicador visual de requisitos */}
        {newPassword && (
          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium text-slate-700">Requisitos de contraseña:</p>
            <ul className="space-y-1.5">
              {passwordValidation.map((req, index) => (
                <li 
                  key={index}
                  className={`flex items-center gap-2 text-sm transition-colors ${
                    req.isValid ? 'text-green-600' : 'text-slate-500'
                  }`}
                >
                  {req.isValid ? (
                    <Check size={16} className="flex-shrink-0" />
                  ) : (
                    <X size={16} className="flex-shrink-0" />
                  )}
                  <span>{req.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="relative">
          <Input 
            placeholder="Confirmar Nueva Contraseña"
            id="confirmPassword" 
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword} 
            onChange={e => setConfirmPassword(e.target.value)} 
            required 
            autoComplete="new-password"
            disabled={isFormDisabled}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            disabled={isFormDisabled}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        {/* Indicador de coincidencia de contraseñas */}
        {confirmPassword && (
          <div className={`flex items-center gap-2 text-sm ${
            passwordsMatch ? 'text-green-600' : 'text-red-600'
          }`}>
            {passwordsMatch ? (
              <>
                <Check size={16} />
                <span>Las contraseñas coinciden</span>
              </>
            ) : (
              <>
                <X size={16} />
                <span>Las contraseñas no coinciden</span>
              </>
            )}
          </div>
        )}
        
        <Button 
          type="submit" 
          isLoading={isLoading} 
          fullWidth 
          disabled={isFormDisabled || !allRequirementsMet || !passwordsMatch}
        >
          Restablecer Contraseña
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;