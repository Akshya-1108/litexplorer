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
    'relative inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9542C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E2021] disabled:cursor-not-allowed disabled:opacity-50 select-none';

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
  };

  const variants = {
    primary: [
      'bg-[#D9542C] text-[#EFE7DF]',
      'shadow-md shadow-[#D9542C]/20',
      'hover:bg-[#C04A27] hover:shadow-lg hover:shadow-[#D9542C]/30',
      'active:bg-[#A83D1E]',
    ].join(' '),
    secondary: [
      'bg-transparent text-[#EFE7DF] border border-[#32302F]',
      'hover:bg-[#282828] hover:border-[#6A6156]',
    ].join(' '),
    ghost: [
      'bg-transparent text-[#777068]',
      'hover:text-[#D9542C] hover:bg-[#D9542C]/10',
    ].join(' '),
    danger: [
      'bg-transparent text-red-400 border border-red-900/50',
      'hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50',
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
          <span>Processing&hellip;</span>
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
