import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../services/apiService';

import AuthLayout from '../components/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    nombre: '',
    apellido: '',
    sexo: 'M',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await api.register(formData);
      navigate('/verify', { state: { email: formData.email } });
    } catch (err: any) {
      setError(err.message || 'El registro falló. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Crear Cuenta">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert message={error} type="error" />}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            placeholder="Nombre" 
            id="nombre" 
            name="nombre" 
            value={formData.nombre} 
            onChange={handleChange} 
            required 
          />
          <Input 
            placeholder="Apellido" 
            id="apellido" 
            name="apellido" 
            value={formData.apellido} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <Input 
          placeholder="Correo Electrónico" 
          id="email" 
          name="email" 
          type="email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
          autoComplete="email" 
        />
        
        <Input 
          placeholder="Número de Teléfono (+52 xxx xxx xxxx)" 
          id="phone" 
          name="phone" 
          type="tel" 
          value={formData.phone} 
          onChange={handleChange} 
          required 
        />
        
        <Input 
          placeholder="Contraseña (mínimo 8 caracteres)" 
          id="password" 
          name="password" 
          type="password" 
          value={formData.password} 
          onChange={handleChange} 
          required 
          autoComplete="new-password" 
        />
        
        <div className="text-xs text-slate-400 space-y-1">
          <p>La contraseña debe contener:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-2">
            <li>Mínimo 8 caracteres</li>
            <li>Al menos una letra mayúscula</li>
            <li>Al menos una letra minúscula</li>
            <li>Al menos un número</li>
            <li>Al menos un carácter especial (!@#$%...)</li>
          </ul>
        </div>
        
        <div>
          <select 
            id="sexo" 
            name="sexo" 
            value={formData.sexo} 
            onChange={handleChange} 
            className="block w-full rounded-full border-2 border-transparent bg-white/10 text-white shadow-sm focus:border-white/30 focus:outline-none focus:ring-0 sm:text-sm px-5 py-3 transition duration-300"
          >
            <option className="bg-slate-900" value="M">Masculino</option>
            <option className="bg-slate-900" value="F">Femenino</option>
            <option className="bg-slate-900" value="O">Otro</option>
          </select>
        </div>
        
        <Button type="submit" isLoading={isLoading} fullWidth>
          Crear Cuenta
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm text-slate-300">
        ¿Ya tienes una cuenta?{' '}
        <Link to="/login" className="font-medium text-sky-400 hover:text-sky-300">
          Inicia sesión
        </Link>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;