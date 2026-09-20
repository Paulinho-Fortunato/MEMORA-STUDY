// Design System - Tokens e variáveis de estilo

export const colors = {
  // Light Mode
  light: {
    background: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceSecondary: '#F5F5F7',
    textPrimary: '#1D1D1F',
    textSecondary: '#86868B',
    border: '#E5E5EA',
    accent: '#007AFF',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
  },
  // Dark Mode
  dark: {
    background: '#000000',
    surface: '#1C1C1E',
    surfaceSecondary: '#2C2C2E',
    textPrimary: '#F5F5F7',
    textSecondary: '#86868B',
    border: '#38383A',
    accent: '#0A84FF',
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.07)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  none: 'none',
};

export const typography = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  
  h1: {
    fontSize: '32px',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.5px',
  },
  h2: {
    fontSize: '24px',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.3px',
  },
  h3: {
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  body: {
    fontSize: '17px',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  bodySmall: {
    fontSize: '15px',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  caption: {
    fontSize: '13px',
    fontWeight: 400,
    lineHeight: 1.4,
  },
  button: {
    fontSize: '17px',
    fontWeight: 600,
    lineHeight: 1.3,
  },
};

export const transitions = {
  fast: '150ms ease',
  normal: '250ms ease',
  slow: '350ms ease',
};

export const zIndex = {
  base: 1,
  dropdown: 1000,
  modal: 1000,
  toast: 1100,
};

// Cores de disciplinas pré-definidas
export const subjectColors = [
  '#007AFF', // Blue
  '#5856D6', // Purple
  '#AF52DE', // Violet
  '#FF2D55', // Pink
  '#FF9500', // Orange
  '#FFCC00', // Yellow
  '#34C759', // Green
  '#5AC8FA', // Mint
  '#00C7BE', // Teal
  '#FF3B30', // Red
];

// Ícones disponíveis para disciplinas
export const availableIcons = [
  'Book',
  'Calculator',
  'Globe',
  'Atom',
  'FlaskConical',
  'PenTool',
  'Music',
  'Palette',
  'Code',
  'Brain',
  'Target',
  'Trophy',
  'Clock',
  'Calendar',
  'ChartBar',
  'Lightbulb',
];
