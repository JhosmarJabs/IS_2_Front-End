import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { PrevalidateResponse } from '../types';

import AuthLayout from '../components/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

type View = 'email' | 'password' | 'otp';

const LoginPage: React.FC = () => {
  const [view, setView] = useState<View>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [prevalidateData, setPrevalidateData] = useState<PrevalidateResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const data = await api.prevalidate(email);
      setPrevalidateData(data);
      if (data.emailExists && data.canLogin && data.availableLoginMethods.includes('password')) {
        setView('password');
      } else if (!data.emailExists) {
        setError('No se encontró una cuenta con este correo. Por favor, regístrate.');
      } else {
        setError('El inicio de sesión con contraseña no está disponible para esta cuenta.');
      }
    } catch (err: any) {
      setError(err.message || 'No se pudo verificar el correo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (prevalidateData?.availableLoginMethods.includes('otp')) {
        await api.requestOtpFor2FA({ email, password });
        setView('otp');
      } else {
        const { tokens, user } = await api.loginWithPassword({ email, password });
        login(tokens, user);
        navigate('/welcome', { state: { name: user.nombre } });
      }
    } catch (err: any) {
      setError(err.message || 'Credenciales inválidas.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const { tokens, user } = await api.loginWithOtp({ email, otpCode });
      login(tokens, user);
      navigate('/welcome', { state: { name: user.nombre } });
    } catch (err: any) {
      setError(err.message || 'Código OTP inválido.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMagicLink = async () => {
    setIsLoading(true);
    setError('');
    try {
      await api.requestMagicLink(email);
      navigate('/check-email', { state: { message: "Hemos enviado un enlace mágico a tu correo." } });
    } catch (err: any) {
      setError(err.message || 'No se pudo enviar el enlace mágico.');
    } finally {
        setIsLoading(false);
    }
  };

  const renderEmailForm = () => (
    <form onSubmit={handleEmailSubmit} className="space-y-6">
      <Input placeholder="Correo Electrónico" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
      <Button type="submit" isLoading={isLoading} fullWidth>Continuar</Button>
    </form>
  );

  const renderPasswordForm = () => (
    <form onSubmit={handlePasswordSubmit} className="space-y-6">
       <div className="text-sm text-center text-slate-300">
          Iniciando sesión como <strong>{email}</strong>. <button type="button" onClick={() => { setView('email'); setError('')}} className="font-medium text-sky-400 hover:text-sky-300">¿No eres tú?</button>
        </div>
      <Input placeholder="Contraseña" id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
       <div className="text-center">
            <Link to="/forgot-password" state={{email}} className="text-sm font-medium text-sky-400 hover:text-sky-300">
                ¿Olvidaste tu contraseña?
            </Link>
        </div>
      <Button type="submit" isLoading={isLoading} fullWidth>Iniciar Sesión</Button>
      {prevalidateData?.availableLoginMethods.includes('magic_link') && (
        <Button variant="secondary" onClick={handleMagicLink} isLoading={isLoading} fullWidth>
          Envíame un enlace mágico
        </Button>
      )}
    </form>
  );
  
  const renderOtpForm = () => (
    <form onSubmit={handleOtpSubmit} className="space-y-6">
      <div className="text-center text-slate-300">
          <p>Hemos enviado un código de seguridad a <strong>{email}</strong>.</p>
      </div>
      <Input 
        placeholder="Código de 6 dígitos"
        id="otpCode" 
        value={otpCode} 
        onChange={e => setOtpCode(e.target.value)} 
        required 
        inputMode="numeric"
        maxLength={6}
      />
      <Button type="submit" isLoading={isLoading} fullWidth>Verificar e Iniciar Sesión</Button>
      <div className="text-center">
          <button type="button" onClick={() => { setView('password'); setError('')}} className="text-sm font-medium text-sky-400 hover:text-sky-300">
              Volver
          </button>
      </div>
    </form>
  );


  return (
    <AuthLayout title="Iniciar Sesión">
      {error && <Alert message={error} type="error" />}
      
      {view === 'email' && renderEmailForm()}
      {view === 'password' && renderPasswordForm()}
      {view === 'otp' && renderOtpForm()}

      <div className="mt-6 text-center text-sm text-slate-300">
        ¿Todavía no tienes una cuenta?{' '}
        <Link to="/register" className="font-medium text-sky-400 hover:text-sky-300">
          Regístrate
        </Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
