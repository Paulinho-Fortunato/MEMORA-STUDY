import React from 'react';
import { X } from 'lucide-react';
import { spacing, borderRadius, shadows, zIndex } from '../design-system/tokens';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'full';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
}) => {
  if (!isOpen) return null;

  const sizeStyles = {
    small: { maxWidth: '400px' },
    medium: { maxWidth: '520px' },
    large: { maxWidth: '720px' },
    full: { maxWidth: 'calc(100% - 32px)', maxHeight: 'calc(100% - 32px)' },
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${spacing.lg}px`,
    zIndex: zIndex.modal,
    animation: 'fadeIn 200ms ease',
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: 'var(--surface, #FFFFFF)',
    borderRadius: borderRadius.xl,
    boxShadow: shadows.lg,
    maxHeight: '90vh',
    overflow: 'auto',
    ...sizeStyles[size],
    animation: 'slideUp 250ms ease',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${spacing.lg}px ${spacing.xl}px`,
    borderBottom: '1px solid var(--border, #E5E5EA)',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 600,
    color: 'var(--text-primary, #1D1D1F)',
    margin: 0,
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: `${spacing.sm}px`,
    borderRadius: borderRadius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary, #86868B)',
    transition: 'all 150ms ease',
  };

  const contentStyle: React.CSSProperties = {
    padding: `${spacing.xl}px`,
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div style={headerStyle}>
            <h2 style={titleStyle}>{title}</h2>
            <button
              style={closeButtonStyle}
              onClick={onClose}
              aria-label="Fechar"
            >
              <X size={24} />
            </button>
          </div>
        )}
        <div style={contentStyle}>{children}</div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
