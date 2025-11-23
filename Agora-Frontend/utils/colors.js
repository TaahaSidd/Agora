// Enhanced Color System with Dark Mode Support
export const COLORS = {
    // Primary Brand Colors
    primary: '#008CFE',
    primaryDark: '#0070CC',
    primaryLight: '#33A3FF',
    primaryLighter: '#66B8FF',
    primaryLightest: '#E6F4FF',

    // Secondary Colors
    secondary: '#6366F1',
    secondaryDark: '#4F46E5',
    secondaryLight: '#818CF8',

    // Accent Colors
    accent: '#10B981',
    accentDark: '#059669',
    accentLight: '#34D399',

    // Semantic Colors - Success
    success: '#10B981',
    successDark: '#059669',
    successLight: '#34D399',
    successBg: '#D1FAE5',
    successBgDark: '#064E3B',

    // Semantic Colors - Error/Danger
    error: '#EF4444',
    errorDark: '#DC2626',
    errorLight: '#F87171',
    errorBg: '#FEE2E2',
    errorBgDark: '#7F1D1D',
    danger: '#FF3B30',
    dangerDark: '#DC2626',
    dangerLight: '#FF6B6B',

    // Semantic Colors - Warning
    warning: '#F59E0B',
    warningDark: '#D97706',
    warningLight: '#FBBF24',
    warningBg: '#FEF3C7',
    warningBgDark: '#78350F',

    // Semantic Colors - Info
    info: '#3B82F6',
    infoDark: '#2563EB',
    infoLight: '#60A5FA',
    infoBg: '#DBEAFE',
    infoBgDark: '#1E3A8A',

    // Neutral Colors - Light Mode
    white: '#FFFFFF',
    black: '#000000',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',

    // Dark Mode Backgrounds
    dark: {
        bg: '#0A0A0A',           // Main background
        bgElevated: '#121212',   // Elevated surfaces
        card: '#1C1C1E',         // Card backgrounds
        cardElevated: '#2C2C2E', // Elevated cards
        border: '#38383A',       // Border color
        divider: '#48484A',      // Divider lines

        // Dark mode text colors
        text: '#FFFFFF',
        textSecondary: '#EBEBF5',
        textTertiary: '#EBEBF599', // 60% opacity
        textQuaternary: '#EBEBF54D', // 30% opacity
        textDisabled: '#EBEBF533', // 20% opacity

        // Dark mode overlays
        overlay: 'rgba(0, 0, 0, 0.5)',
        overlayLight: 'rgba(0, 0, 0, 0.3)',
        overlayHeavy: 'rgba(0, 0, 0, 0.7)',
    },

    // Light Mode Backgrounds
    light: {
        bg: '#F9FAFB',           // Main background
        bgElevated: '#FFFFFF',   // Elevated surfaces
        card: '#FFFFFF',         // Card backgrounds
        cardElevated: '#F9FAFB', // Elevated cards
        border: '#E5E7EB',       // Border color
        divider: '#F3F4F6',      // Divider lines

        // Light mode text colors
        text: '#111827',
        textSecondary: '#6B7280',
        textTertiary: '#9CA3AF',
        textQuaternary: '#D1D5DB',
        textDisabled: '#E5E7EB',

        // Light mode overlays
        overlay: 'rgba(0, 0, 0, 0.5)',
        overlayLight: 'rgba(0, 0, 0, 0.3)',
        overlayHeavy: 'rgba(0, 0, 0, 0.7)',
    },

    // Legacy/Backward Compatibility
    darkBlue: '#001F3F',
    red: '#FF3B30',
    gray: '#808080',
    bg: '#121212',
    cardBg: '#282828',

    // Social Media Colors
    social: {
        facebook: '#1877F2',
        twitter: '#1DA1F2',
        instagram: '#E4405F',
        whatsapp: '#25D366',
        linkedin: '#0A66C2',
        youtube: '#FF0000',
        google: '#EA4335',
        apple: '#000000',
    },

    // Status Colors
    status: {
        online: '#10B981',
        offline: '#6B7280',
        away: '#F59E0B',
        busy: '#EF4444',
        available: '#34D399',
        sold: '#10B981',
        pending: '#F59E0B',
        cancelled: '#EF4444',
    },

    // Category Colors (for different item categories)
    category: {
        electronics: '#3B82F6',
        fashion: '#EC4899',
        books: '#8B5CF6',
        sports: '#10B981',
        furniture: '#F59E0B',
        food: '#EF4444',
        other: '#6B7280',
    },

    // Gradient Colors
    gradients: {
        primary: ['#008CFE', '#0070CC'],
        secondary: ['#6366F1', '#4F46E5'],
        success: ['#10B981', '#059669'],
        sunset: ['#FF6B6B', '#FFE66D'],
        ocean: ['#008CFE', '#00D4FF'],
        purple: ['#8B5CF6', '#EC4899'],
        fire: ['#FF6B35', '#F7931E'],
    },

    // Transparent Colors
    transparent: 'transparent',
    transparentBlack10: 'rgba(0, 0, 0, 0.1)',
    transparentBlack20: 'rgba(0, 0, 0, 0.2)',
    transparentBlack30: 'rgba(0, 0, 0, 0.3)',
    transparentBlack50: 'rgba(0, 0, 0, 0.5)',
    transparentBlack70: 'rgba(0, 0, 0, 0.7)',
    transparentWhite10: 'rgba(255, 255, 255, 0.1)',
    transparentWhite20: 'rgba(255, 255, 255, 0.2)',
    transparentWhite30: 'rgba(255, 255, 255, 0.3)',
    transparentWhite50: 'rgba(255, 255, 255, 0.5)',
    transparentWhite70: 'rgba(255, 255, 255, 0.7)',

    // Shadow Colors
    shadow: {
        light: 'rgba(0, 0, 0, 0.05)',
        medium: 'rgba(0, 0, 0, 0.1)',
        heavy: 'rgba(0, 0, 0, 0.2)',
        primaryLight: 'rgba(0, 140, 254, 0.2)',
        primaryMedium: 'rgba(0, 140, 254, 0.3)',
    },
};

// Helper function to get theme-specific colors
export const getThemedColors = (isDarkMode) => {
    return {
        background: isDarkMode ? COLORS.dark.bg : COLORS.light.bg,
        backgroundElevated: isDarkMode ? COLORS.dark.bgElevated : COLORS.light.bgElevated,
        card: isDarkMode ? COLORS.dark.card : COLORS.light.card,
        cardElevated: isDarkMode ? COLORS.dark.cardElevated : COLORS.light.cardElevated,
        text: isDarkMode ? COLORS.dark.text : COLORS.light.text,
        textSecondary: isDarkMode ? COLORS.dark.textSecondary : COLORS.light.textSecondary,
        textTertiary: isDarkMode ? COLORS.dark.textTertiary : COLORS.light.textTertiary,
        border: isDarkMode ? COLORS.dark.border : COLORS.light.border,
        divider: isDarkMode ? COLORS.dark.divider : COLORS.light.divider,
        overlay: isDarkMode ? COLORS.dark.overlay : COLORS.light.overlay,
        primary: COLORS.primary,
        success: COLORS.success,
        error: COLORS.error,
        warning: COLORS.warning,
        info: COLORS.info,
    };
};

// Usage example:
// import { COLORS, getThemedColors } from './colors';
// 
// In your component:
// const isDarkMode = useColorScheme() === 'dark';
// const theme = getThemedColors(isDarkMode);
// 
// Then use: theme.background, theme.text, etc.
// Or use directly: COLORS.primary, COLORS.success, etc.