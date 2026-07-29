import React from 'react';

interface AdinkraProps {
  className?: string;
  size?: number;
}

// Nyansapo - Symbol of Wisdom, Ingenuity & Intelligence
export const NyansapoSymbol: React.FC<AdinkraProps> = ({ className = 'text-amber-500', size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M50 10 C30 10, 15 25, 15 45 C15 60, 25 70, 40 70 C30 75, 25 85, 25 90 H75 C75 85, 70 75, 60 70 C75 70, 85 60, 85 45 C85 25, 70 10, 50 10 Z"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="50" cy="40" r="14" stroke="currentColor" strokeWidth="5" />
    <path d="M35 40 H65" stroke="currentColor" strokeWidth="4" />
    <path d="M50 25 V55" stroke="currentColor" strokeWidth="4" />
    <circle cx="30" cy="80" r="4" fill="currentColor" />
    <circle cx="50" cy="80" r="4" fill="currentColor" />
    <circle cx="70" cy="80" r="4" fill="currentColor" />
  </svg>
);

// Gye Nyame - Symbol of Perseverance and Faith
export const GyeNyameSymbol: React.FC<AdinkraProps> = ({ className = 'text-teal-500', size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M20 15 H80 M20 85 H80 M50 15 V85 M30 35 C40 30 60 30 70 35 M30 65 C40 70 60 70 70 65"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <circle cx="35" cy="50" r="8" stroke="currentColor" strokeWidth="4" />
    <circle cx="65" cy="50" r="8" stroke="currentColor" strokeWidth="4" />
  </svg>
);

// Sankofa - Symbol of Wisdom in Learning from the Past
export const SankofaSymbol: React.FC<AdinkraProps> = ({ className = 'text-amber-500', size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M30 65 C20 60, 20 40, 35 30 C50 20, 65 30, 70 45 C75 60, 65 75, 45 80 C30 83, 20 75, 30 65 Z"
      stroke="currentColor"
      strokeWidth="5"
    />
    <path d="M65 40 C60 35, 50 35, 45 42" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <circle cx="38" cy="38" r="4" fill="currentColor" />
  </svg>
);

// Kente Geometric Ribbon / Accent Divider
export const KenteDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`w-full overflow-hidden flex justify-center items-center py-2 ${className}`}>
    <div className="flex items-center gap-1.5 opacity-90">
      <div className="h-1.5 w-6 bg-amber-500 rounded-full transform -skew-x-12" />
      <div className="h-1.5 w-3 bg-teal-500 rounded-full transform -skew-x-12" />
      <div className="h-1.5 w-8 bg-amber-600 rounded-full transform -skew-x-12" />
      <div className="h-1.5 w-2 bg-orange-500 rounded-full transform -skew-x-12" />
      <div className="h-1.5 w-6 bg-teal-400 rounded-full transform -skew-x-12" />
      <div className="h-1.5 w-3 bg-amber-400 rounded-full transform -skew-x-12" />
      <div className="h-1.5 w-8 bg-amber-500 rounded-full transform -skew-x-12" />
    </div>
  </div>
);
