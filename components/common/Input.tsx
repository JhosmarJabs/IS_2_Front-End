import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, id, type = 'text', icon, ...props }) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-slate-300">
            {label}
        </label>
      )}
      <div className="relative">
        {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-4 flex items-center">
                {icon}
            </div>
        )}
        <input
          type={type}
          id={id}
          className={`block w-full rounded-full border-2 border-transparent bg-white/10 text-white placeholder-slate-300 shadow-sm focus:border-white/30 focus:outline-none focus:ring-0 sm:text-sm ${icon ? 'pl-10' : 'px-5'} py-3 transition duration-300`}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;
