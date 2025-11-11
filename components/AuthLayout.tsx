import React from 'react';

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-black/30 backdrop-blur-xl shadow-2xl p-8 sm:p-10">
        <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white">
            {title}
            </h2>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
