import React from 'react';
import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  icon,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-full border border-transparent px-6 py-3 text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300';
  
  const variantClasses = {
    primary: 'bg-white/10 text-white hover:bg-white/20',
    secondary: 'bg-transparent text-white hover:bg-white/10 border-white/20',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Spinner size="sm" />
      ) : (
        <>
            {icon && <span className="mr-2 -ml-1 h-5 w-5">{icon}</span>}
            {children}
        </>
      )}
    </button>
  );
};

export default Button;
