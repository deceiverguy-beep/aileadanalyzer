import React, { useEffect, useState } from 'react';

export interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'gradient' | 'indigo' | 'cyan' | 'emerald' | 'white';
  label?: string;
  sublabel?: string;
  steps?: string[];
  inline?: boolean;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'gradient',
  label,
  sublabel,
  steps,
  inline = false,
  className = '',
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Cycle through animated steps if provided
  useEffect(() => {
    if (!steps || steps.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % steps.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [steps]);

  // Dimensions based on size
  const sizeMap = {
    xs: { outer: 'w-3.5 h-3.5', stroke: 2.5, text: 'text-[11px]' },
    sm: { outer: 'w-4 h-4', stroke: 2.5, text: 'text-xs' },
    md: { outer: 'w-7 h-7', stroke: 3, text: 'text-sm' },
    lg: { outer: 'w-10 h-10', stroke: 3.5, text: 'text-base' },
    xl: { outer: 'w-14 h-14', stroke: 4, text: 'text-lg' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Colors based on variant
  const getGradientIds = () => `spinner-grad-${variant}-${size}`;
  const gradientId = getGradientIds();

  const getGradientStops = () => {
    switch (variant) {
      case 'cyan':
        return (
          <>
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="1" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
          </>
        );
      case 'emerald':
        return (
          <>
            <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.1" />
          </>
        );
      case 'white':
        return (
          <>
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
          </>
        );
      case 'indigo':
        return (
          <>
            <stop offset="0%" stopColor="#6366f1" stopOpacity="1" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.1" />
          </>
        );
      case 'gradient':
      default:
        return (
          <>
            <stop offset="0%" stopColor="#6366f1" stopOpacity="1" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
          </>
        );
    }
  };

  const spinnerSvg = (
    <div className={`relative ${currentSize.outer} flex items-center justify-center shrink-0`}>
      <svg
        className="w-full h-full animate-spin"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            {getGradientStops()}
          </linearGradient>
        </defs>

        {/* Ambient track */}
        <circle
          cx="24"
          cy="24"
          r="19"
          stroke="currentColor"
          strokeWidth={currentSize.stroke * 1.3}
          className="text-slate-800/60"
        />

        {/* Dynamic spinning gradient arc */}
        <circle
          cx="24"
          cy="24"
          r="19"
          stroke={`url(#${gradientId})`}
          strokeWidth={currentSize.stroke * 1.3}
          strokeLinecap="round"
          strokeDasharray="90 120"
        />
      </svg>

      {/* Center glowing dot for md, lg, xl sizes */}
      {(size === 'md' || size === 'lg' || size === 'xl') && (
        <span 
          className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping opacity-75"
        />
      )}
    </div>
  );

  if (inline) {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`} role="status">
        {spinnerSvg}
        {label && <span className="font-medium text-inherit">{label}</span>}
      </span>
    );
  }

  const activeLabel = steps && steps.length > 0 ? steps[currentStepIndex] : label;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-center ${className}`}
      role="status"
      aria-live="polite"
    >
      {spinnerSvg}

      {(activeLabel || sublabel) && (
        <div className="flex flex-col items-center gap-1">
          {activeLabel && (
            <p className={`font-semibold text-white tracking-wide transition-all duration-300 ${currentSize.text}`}>
              {activeLabel}
            </p>
          )}
          {sublabel && (
            <p className="text-xs text-slate-400 max-w-xs">
              {sublabel}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
