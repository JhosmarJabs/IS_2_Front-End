import React from 'react';

interface AlertProps {
  message: string;
  type: 'error' | 'success';
}

const Alert: React.FC<AlertProps> = ({ message, type }) => {
  if (!message) return null;

  const baseClasses = 'p-4 mb-4 text-sm rounded-xl border';
  const typeClasses = {
    error: 'bg-red-500/20 border-red-500/30 text-white',
    success: 'bg-green-500/20 border-green-500/30 text-white',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
      {message}
    </div>
  );
};

export default Alert;
