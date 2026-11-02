import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'palak' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  // Enforced Button Scale: min-height 48px (sm min 44px for touch targets), 16px text, weight 600, radius 10px, no offset shadows
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-[10px] transition-all duration-150 select-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "min-h-[44px] px-4 py-2 text-[15px] gap-2",
    md: "min-h-[48px] px-6 py-2.5 text-[16px] gap-2",
    lg: "min-h-[52px] px-8 py-3 text-[17px] gap-2.5",
  };

  const variantStyles = {
    // Primary button: mirchi background, white text, hover darker (#A82217)
    primary: "bg-mirchi text-white border border-mirchi hover:bg-mirchi-hover shadow-soft-sm",
    // Secondary: palak outline
    secondary: "bg-transparent text-palak border border-palak hover:bg-palak/10",
    outline: "bg-transparent text-palak border border-palak hover:bg-palak/10",
    palak: "bg-palak text-white border border-palak hover:bg-palak/90 shadow-soft-sm",
    ghost: "bg-transparent text-espresso border border-transparent hover:bg-paper",
    danger: "bg-nonveg text-white border border-nonveg hover:bg-red-700 shadow-soft-sm",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current stroke-[1.75]" />
      ) : (
        leftIcon
      )}
      <span className="leading-tight">{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
