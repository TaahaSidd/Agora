// Enhanced Theme System - Following Industry Standards (8pt Grid System)
export const THEME = {
    // Border Radius - Following iOS/Material Design patterns
    borderRadius: {
        none: 0,
        xs: 4,      // Tiny elements, chips
        sm: 8,      // Small buttons, inputs
        md: 12,     // Standard buttons, cards
        lg: 16,     // Large cards, modals
        xl: 20,     // Extra large cards, sheets
        '2xl': 24,  // Very large containers
        '3xl': 28,  // Huge containers
        full: 999,  // Pills, circular buttons

        // Specific use cases
        button: 12,
        card: 16,
        input: 10,
        modal: 20,
        pill: 999,
        avatar: 999,
    },

    // Spacing - 8pt Grid System (most real-world apps use this)
    spacing: {
        0: 0,
        1: 4,      // 0.25rem - Tiny gaps
        2: 8,      // 0.5rem  - Small gaps, icon margins
        3: 12,     // 0.75rem - Medium-small gaps
        4: 16,     // 1rem    - Standard spacing
        5: 20,     // 1.25rem - Medium gaps
        6: 24,     // 1.5rem  - Large gaps
        7: 28,     // 1.75rem
        8: 32,     // 2rem    - Extra large gaps
        9: 36,     // 2.25rem
        10: 40,    // 2.5rem  - Very large gaps
        11: 44,    // 2.75rem
        12: 48,    // 3rem    - Huge gaps
        14: 56,    // 3.5rem
        16: 64,    // 4rem    - Section spacing
        20: 80,    // 5rem    - Large section spacing
        24: 96,    // 6rem
        32: 128,   // 8rem
        40: 160,   // 10rem
        48: 192,   // 12rem
        56: 224,   // 14rem
        64: 256,   // 16rem

        // Semantic naming (easier to remember)
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        '2xl': 40,
        '3xl': 48,
        '4xl': 64,
        '5xl': 80,

        // Component-specific spacing
        screenPadding: 16,     // Standard screen horizontal padding
        cardPadding: 16,       // Standard card padding
        sectionGap: 24,        // Gap between sections
        itemGap: 12,           // Gap between list items
        buttonPadding: 16,     // Button horizontal padding
        inputPadding: 12,      // Input field padding
    },

    // Typography - Following iOS/Material Design scales
    fontSize: {
        xs: 11,    // Very small text, captions
        sm: 13,    // Small text, labels
        base: 15,  // Body text (iOS standard)
        md: 15,    // Alias for base
        lg: 17,    // Slightly larger body, headings
        xl: 20,    // Large headings
        '2xl': 24, // Extra large headings
        '3xl': 28, // Title text
        '4xl': 32, // Large titles
        '5xl': 36, // Hero text
        '6xl': 48, // Display text
        '7xl': 60, // Large display
        '8xl': 72, // Extra large display
    },

    // Font Weights
    fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
    },

    // Line Heights
    lineHeight: {
        none: 1,
        tight: 1.25,
        snug: 1.375,
        normal: 1.5,
        relaxed: 1.625,
        loose: 2,
    },

    // Letter Spacing
    letterSpacing: {
        tighter: -0.8,
        tight: -0.4,
        normal: 0,
        wide: 0.4,
        wider: 0.8,
        widest: 1.6,
    },

    // Shadows - iOS-style elevation
    shadows: {
        none: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
        },
        xs: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
        },
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            elevation: 8,
        },
        xl: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.15,
            shadowRadius: 24,
            elevation: 12,
        },
        '2xl': {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 16 },
            shadowOpacity: 0.2,
            shadowRadius: 32,
            elevation: 16,
        },

        // Colored shadows
        primary: {
            shadowColor: '#008CFE',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
        },
    },

    // Icon Sizes
    iconSize: {
        xs: 14,
        sm: 16,
        md: 20,
        lg: 24,
        xl: 28,
        '2xl': 32,
        '3xl': 40,
        '4xl': 48,
    },

    // Avatar Sizes
    avatarSize: {
        xs: 24,
        sm: 32,
        md: 40,
        lg: 48,
        xl: 64,
        '2xl': 80,
        '3xl': 96,
        '4xl': 128,
    },

    // Button Heights
    buttonHeight: {
        sm: 32,
        md: 44,  // iOS standard tap target
        lg: 52,
        xl: 60,
    },

    // Input Heights
    inputHeight: {
        sm: 36,
        md: 44,
        lg: 52,
    },

    // Z-Index (Layering)
    zIndex: {
        hide: -1,
        base: 0,
        dropdown: 1000,
        sticky: 1100,
        fixed: 1200,
        modal: 1300,
        popover: 1400,
        toast: 1500,
        tooltip: 1600,
        max: 9999,
    },

    // Opacity
    opacity: {
        0: 0,
        5: 0.05,
        10: 0.1,
        20: 0.2,
        25: 0.25,
        30: 0.3,
        40: 0.4,
        50: 0.5,
        60: 0.6,
        70: 0.7,
        75: 0.75,
        80: 0.8,
        90: 0.9,
        95: 0.95,
        100: 1,

        // Semantic
        disabled: 0.5,
        hover: 0.8,
        pressed: 0.6,
    },

    // Border Widths
    borderWidth: {
        none: 0,
        hairline: 0.5,
        thin: 1,
        medium: 1.5,
        thick: 2,
        heavy: 3,
        extraHeavy: 4,
    },

    // Animation Durations (in milliseconds)
    animation: {
        fastest: 100,
        faster: 150,
        fast: 200,
        normal: 300,
        slow: 400,
        slower: 500,
        slowest: 600,
    },

    // Screen Breakpoints (for responsive design)
    breakpoints: {
        xs: 320,   // Small phones
        sm: 375,   // Standard phones
        md: 414,   // Large phones
        lg: 768,   // Tablets
        xl: 1024,  // Large tablets
        '2xl': 1280, // Small desktops
    },

    // Common Layout Dimensions
    layout: {
        headerHeight: 56,
        tabBarHeight: 80,
        bottomSheetHandle: 20,
        minTouchTarget: 44,  // iOS minimum tap target
        maxContentWidth: 640, // Max width for content on tablets
        listItemHeight: 60,
        cardMinHeight: 200,
    },
};

// Helper function to get responsive spacing
export const getResponsiveSpacing = (screenWidth) => {
    if (screenWidth < THEME.breakpoints.sm) {
        return THEME.spacing.screenPadding;
    } else if (screenWidth < THEME.breakpoints.lg) {
        return THEME.spacing.lg;
    } else {
        return THEME.spacing['2xl'];
    }
};

// Helper function to scale fonts based on screen size
export const getScaledFontSize = (size, screenWidth) => {
    const baseWidth = 375; // iPhone standard width
    const scale = screenWidth / baseWidth;
    const scaledSize = size * scale;

    // Limit scaling to reasonable bounds
    return Math.min(Math.max(scaledSize, size * 0.85), size * 1.15);
};

// Usage examples:
// 
// 1. Direct usage:
//    borderRadius: THEME.borderRadius.card
//    padding: THEME.spacing.md
//    fontSize: THEME.fontSize.base
//
// 2. With shadow:
//    style={[styles.card, THEME.shadows.md]}
//
// 3. With responsive spacing:
//    const { width } = useWindowDimensions();
//    padding: getResponsiveSpacing(width)
//
// 4. Combined:
//    style={{
//      padding: THEME.spacing.md,
//      borderRadius: THEME.borderRadius.card,
//      ...THEME.shadows.md
//    }}