import React from 'react';
import { spacing, borderRadius, shadows } from '../design-system/tokens';

interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  padding?: 'none' | 'small' | 'medium' | 'large';
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  onClick,
  padding = 'medium',
  className = '',
  style,
}) => {
  const paddingValues = {
    none: '0px',
    small: `${spacing.md}px`,
    medium: `${spacing.lg}px`,
    large: `${spacing.xl}px`,
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--surface, #FFFFFF)',
    borderRadius: borderRadius.lg,
    boxShadow: shadows.sm,
    padding: paddingValues[padding],
    transition: 'all 250ms ease',
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  };

  return (
    <div
      className={className}
      style={cardStyle}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </div>
  );
};
