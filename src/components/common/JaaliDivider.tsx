import React from 'react';

interface JaaliDividerProps {
  className?: string;
  variant?: 'haldi' | 'clay' | 'espresso' | 'cream' | 'wheat';
}

export const JaaliDivider: React.FC<JaaliDividerProps> = ({
  className = '',
  variant = 'clay'
}) => {
  const strokeColor =
    variant === 'haldi'
      ? '#F5B21B'
      : variant === 'cream'
      ? '#FFF7EA'
      : variant === 'espresso'
      ? '#2B1A12'
      : variant === 'wheat'
      ? '#E6D5B8'
      : '#6B4F3F';

  return (
    <div className={`flex items-center justify-center gap-3 my-6 select-none opacity-80 ${className}`}>
      <span className="h-[1px] flex-1 max-w-[120px]" style={{ backgroundColor: strokeColor }} />
      <svg
        width="64"
        height="18"
        viewBox="0 0 64 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path
          d="M32 2L35 7H29L32 2Z"
          fill={strokeColor}
        />
        <circle cx="32" cy="11" r="2.5" fill={strokeColor} />
        <path
          d="M16 9C20 9 22 5 26 9C22 13 20 9 16 9Z"
          stroke={strokeColor}
          strokeWidth="1.2"
        />
        <path
          d="M48 9C44 9 42 5 38 9C42 13 44 9 48 9Z"
          stroke={strokeColor}
          strokeWidth="1.2"
        />
        <circle cx="8" cy="9" r="1.5" fill={strokeColor} />
        <circle cx="56" cy="9" r="1.5" fill={strokeColor} />
      </svg>
      <span className="h-[1px] flex-1 max-w-[120px]" style={{ backgroundColor: strokeColor }} />
    </div>
  );
};
