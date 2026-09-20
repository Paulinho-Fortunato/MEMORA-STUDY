import React from 'react';
import { Home, BookOpen, Calendar, BarChart3, Settings } from 'lucide-react';
import { spacing, borderRadius } from '../design-system/tokens';

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'study', icon: BookOpen, label: 'Estudar' },
    { id: 'reviews', icon: Calendar, label: 'Revisões' },
    { id: 'profile', icon: Settings, label: 'Perfil' },
  ];

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'var(--surface, #FFFFFF)',
    borderTop: '1px solid var(--border, #E5E5EA)',
    display: 'flex',
    justifyContent: 'space-around',
    padding: `${spacing.sm}px ${spacing.md}px`,
    paddingBottom: `calc(${spacing.sm}px + env(safe-area-inset-bottom))`,
    zIndex: 100,
  };

  const tabButtonStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: `${spacing.xs}px ${spacing.sm}px`,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: isActive ? 'var(--accent-color, #007AFF)' : 'var(--text-secondary, #86868B)',
    transition: 'color 200ms ease',
  });

  const labelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 500,
  };

  return (
    <nav style={containerStyle}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            style={tabButtonStyle(isActive)}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span style={labelStyle}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
