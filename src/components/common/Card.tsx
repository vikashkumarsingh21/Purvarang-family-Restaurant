import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'paper' | 'palak' | 'default';
  isHoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'white',
  isHoverable = false,
  className = '',
  ...props
}) => {
  // Cards must be white (#FFFFFF) on cream (#FFF7EA), 1px wheat (#E6D5B8) border, soft shadow, radius 12px
  const base = "rounded-[12px] border border-wheat transition-all duration-200";

  const variantStyles = {
    white: "bg-white text-espresso shadow-soft",
    default: "bg-white text-espresso shadow-soft",
    paper: "bg-paper text-espresso border-wheat shadow-soft-sm",
    palak: "bg-palak text-cream border-palak shadow-soft",
  };

  const hoverStyle = isHoverable
    ? "hover:-translate-y-1 hover:shadow-soft-lg cursor-pointer"
    : "";

  return (
    <div className={`${base} ${variantStyles[variant]} ${hoverStyle} ${className}`} {...props}>
      {children}
    </div>
  );
};
