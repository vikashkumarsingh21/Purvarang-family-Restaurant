import React from 'react';

interface StampBadgeProps {
  className?: string;
  size?: number;
}

export const StampBadge: React.FC<StampBadgeProps> = ({
  className = '',
  size = 130
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none rotate-[-6deg] hover:rotate-0 transition-transform duration-300 drop-shadow-md ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 140 140"
        className="w-full h-full animate-spin-slow"
        style={{ animationDuration: '30s' }}
      >
        <defs>
          <path
            id="stampCirclePath"
            d="M 70, 70 m -50, 0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
          />
        </defs>

        {/* Outer and inner stamped dashed borders */}
        <circle
          cx="70"
          cy="70"
          r="66"
          fill="none"
          stroke="#C62B1F"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <circle
          cx="70"
          cy="70"
          r="60"
          fill="#FFF7EA"
          stroke="#C62B1F"
          strokeWidth="1.2"
        />
        <circle
          cx="70"
          cy="70"
          r="38"
          fill="none"
          stroke="#C62B1F"
          strokeWidth="1.2"
          strokeDasharray="2 2"
        />

        {/* Curving text */}
        <text
          fontSize="9"
          fontWeight="bold"
          letterSpacing="2.2"
          fill="#C62B1F"
          fontFamily="DM Sans, sans-serif"
        >
          <textPath href="#stampCirclePath" startOffset="0%">
            • SWAD KA EK NYA RANG • LALGANJ •
          </textPath>
        </text>

        {/* Center emblem */}
        <text
          x="70"
          y="68"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fill="#2B1A12"
          fontFamily="Tiro Devanagari Hindi, serif"
        >
          पूर्वरांग
        </text>
        <text
          x="70"
          y="81"
          textAnchor="middle"
          fontSize="7.5"
          fontWeight="600"
          letterSpacing="1"
          fill="#6B4F3F"
          fontFamily="DM Sans, sans-serif"
        >
          VAISHALI • BIHAR
        </text>
      </svg>
    </div>
  );
};
