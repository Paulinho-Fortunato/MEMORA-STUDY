import React from 'react';
import { colors, spacing, borderRadius, shadows, typography, transitions } from '../design-system/tokens';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    border: 'none',
    borderRadius: borderRadius.md,
    fontFamily: typography.fontFamily,
    fontWeight: 600,
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    transition: `all ${transitions.fast}`,
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled || isLoading ? 0.6 : 1,
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--accent-color, #007AFF)',
      color: '#FFFFFF',
    },
    secondary: {
      backgroundColor: 'var(--surface-secondary, #F5F5F7)',
      color: 'var(--text-primary, #1D1D1F)',
    },
    tertiary: {
      backgroundColor: 'transparent',
      color: 'var(--accent-color, #007AFF)',
    },
    danger: {
      backgroundColor: 'var(--error, #FF3B30)',
      color: '#FFFFFF',
    },
  };

  const sizeStyles = {
    small: {
      padding: `${spacing.xs}px ${spacing.md}px`,
      fontSize: '15px',
      minHeight: '36px',
    },
    medium: {
      padding: `${spacing.sm}px ${spacing.lg}px`,
      fontSize: '17px',
      minHeight: '44px',
    },
    large: {
      padding: `${spacing.md}px ${spacing.xl}px`,
      fontSize: '18px',
      minHeight: '52px',
    },
  };

  const hoverStyles = `
    &:hover:not(:disabled) {
      transform: scale(${variant === 'tertiary' ? '1.02' : '1.03'});
      opacity: ${variant === 'tertiary' ? '0.8' : '0.9'};
    }
    &:active:not(:disabled) {
      transform: scale(0.98);
    }
  `;

  return (
    <button
      className={className}
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...sizeStyles[size],
      }}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div
          style={{
            width: '20px',
            height: '20px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      ) : (
        <>
          {icon && <span style={{ display: 'flex' }}>{icon}</span>}
          {children}
        </>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        button:hover {
          ${hoverStyles}
        }
      `}</style>
    </button>
  );
};
