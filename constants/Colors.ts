/**
 * Sistema de Cores Parametrizável
 * Altere as cores aqui para personalizar todo o app
 */

const tintColorLight = '#007AFF';
const tintColorDark = '#0A84FF';

export const Colors = {
  light: {
    // Cores principais
    primary: '#007AFF',
    secondary: '#5856D6',
    tertiary: '#FF9500',
    
    // Cores de texto
    text: '#000000',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    
    // Backgrounds
    background: '#FFFFFF',
    backgroundSecondary: '#F3F4F6',
    backgroundTertiary: '#E5E7EB',
    
    // Elementos UI
    tint: tintColorLight,
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,
    
    // Borders e separadores
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    
    // Estados
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Card e superfícies
    card: '#FFFFFF',
    cardBorder: '#E5E7EB',
    
    // Overlays
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.2)',
    
    // Specific to marketplace
    price: '#10B981',
    discount: '#EF4444',
    rating: '#F59E0B',
  },
  dark: {
    // Cores principais
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    tertiary: '#FF9F0A',
    
    // Cores de texto
    text: '#FFFFFF',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',
    
    // Backgrounds
    background: '#000000',
    backgroundSecondary: '#1C1C1E',
    backgroundTertiary: '#2C2C2E',
    
    // Elementos UI
    tint: tintColorDark,
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorDark,
    
    // Borders e separadores
    border: '#2C2C2E',
    borderLight: '#3A3A3C',
    
    // Estados
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA',
    
    // Card e superfícies
    card: '#1C1C1E',
    cardBorder: '#2C2C2E',
    
    // Overlays
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
    
    // Specific to marketplace
    price: '#34D399',
    discount: '#F87171',
    rating: '#FBBF24',
  },
};

export type ColorScheme = keyof typeof Colors;
export type ColorName = keyof typeof Colors.light;
