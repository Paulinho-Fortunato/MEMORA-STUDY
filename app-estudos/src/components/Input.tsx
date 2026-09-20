import React from 'react';
import { spacing, borderRadius } from '../design-system/tokens';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = true,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: `${spacing.xs}px`,
    width: fullWidth ? '100%' : 'auto',
  };

  const inputStyle: React.CSSProperties = {
    padding: `${spacing.md}px ${spacing.lg}px`,
    fontSize: '17px',
    fontFamily: 'inherit',
    border: `1px solid ${error ? 'var(--error, #FF3B30)' : 'var(--border, #E5E5EA)'}`,
    borderRadius: borderRadius.md,
    backgroundColor: 'var(--surface, #FFFFFF)',
    color: 'var(--text-primary, #1D1D1F)',
    outline: 'none',
    transition: 'border-color 200ms ease',
    width: '100%',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '15px',
    fontWeight: 500,
    color: 'var(--text-secondary, #86868B)',
  };

  const errorStyle: React.CSSProperties = {
    fontSize: '13px',
    color: 'var(--error, #FF3B30)',
  };

  return (
    <div className={className} style={containerStyle}>
      {label && (
        <label htmlFor={inputId} style={labelStyle}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        style={inputStyle}
        {...props}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--accent-color, #007AFF)';
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? 'var(--error, #FF3B30)' : 'var(--border, #E5E5EA)';
          props.onBlur?.(e);
        }}
      />
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
};
