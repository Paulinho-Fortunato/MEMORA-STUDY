import React from 'react';
import { spacing, borderRadius } from '../design-system/tokens';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${spacing.xxl}px ${spacing.xl}px`,
    textAlign: 'center',
  };

  const iconContainerStyle: React.CSSProperties = {
    width: '80px',
    height: '80px',
    borderRadius: borderRadius.full,
    backgroundColor: 'var(--surface-secondary, #F5F5F7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: `${spacing.lg}px`,
    color: 'var(--text-secondary, #86868B)',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 600,
    color: 'var(--text-primary, #1D1D1F)',
    margin: `0 0 ${spacing.sm}px 0`,
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '15px',
    color: 'var(--text-secondary, #86868B)',
    margin: `0 0 ${spacing.lg}px 0`,
    maxWidth: '320px',
    lineHeight: 1.5,
  };

  return (
    <div style={containerStyle}>
      <div style={iconContainerStyle}>{icon}</div>
      <h3 style={titleStyle}>{title}</h3>
      <p style={descriptionStyle}>{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
