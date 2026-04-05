import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const base =
    'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden select-none';

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
  };

  const variants = {
    primary: [
      'bg-gradient-to-r from-indigo-600 to-purple-600 text-white',
      'shadow-lg shadow-indigo-700/30',
      'hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-600/50 hover:shadow-xl',
      'hover:scale-[1.02] active:scale-[0.98]',
      // Glare overlay
      'before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-b before:from-white/15 before:to-transparent before:pointer-events-none',
    ].join(' '),
    secondary: [
      'bg-gray-900 text-gray-200 border border-gray-700',
      'hover:bg-gray-800 hover:border-indigo-500/50 hover:text-white',
      'active:scale-[0.98]',
    ].join(' '),
    ghost: [
      'bg-transparent text-gray-400',
      'hover:text-indigo-400 hover:bg-indigo-500/10',
      'active:scale-[0.98]',
    ].join(' '),
    danger: [
      'bg-transparent text-red-400 border border-red-900/50',
      'hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50',
      'active:scale-[0.98]',
    ].join(' '),
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
          <span>Processing…</span>
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};
