import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    FlatList,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';
import Button from '../components/Button';

import BuySell from '../assets/svg/BuySellSVG.svg';
import SecureIllustration from '../assets/svg/SecureSVG.svg';
import SavingsIllustration from '../assets/svg/SavingSVG.svg';

const { width, height } = Dimensions.get('window');

const onboardingData = [
    {
        id: '1',
        title: 'Buy & Sell\nWithin Campus',
        description: 'Connect with students from your college. Buy and sell textbooks, electronics, and more.',
        illustration: BuySell,
        color: '#3B82F6',
    },
    {
        id: '2',
        title: 'Safe & Secure\nTransactions',
        description: 'Verified student profiles. Chat directly with sellers. Meet on campus for safe exchanges.',
        illustration: SecureIllustration,
        color: '#10B981',
    },
    {
        id: '3',
        title: 'Save Money,\nHelp Students',
        description: 'Get great deals on quality items. Help fellow students by selling items you no longer need.',
        illustration: SavingsIllustration,
        color: '#F59E0B',
    },
];

export default function OnboardingScreen({ navigation }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    const viewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollToNext = async () => {
        if (currentIndex < onboardingData.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        } else {
            await SecureStore.setItemAsync('hasSeenOnboarding', 'true');
            navigation.replace('Login');
        }
    };

    const skip = async () => {
        await SecureStore.setItemAsync('hasSeenOnboarding', 'true');
        navigation.replace('Login');
    };

    const renderItem = ({ item }) => {
        const IllustrationComponent = item.illustration;

        return (
            <View style={styles.slide}>
                {/* Illustration Container */}
                <View style={styles.illustrationContainer}>
                    <IllustrationComponent
                        width={width * 0.75}
                        height={width * 0.75}
                    />
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.dark.bg} />

            {/* Skip Button */}
            {currentIndex < onboardingData.length - 1 && (
                <TouchableOpacity style={styles.skipButton} onPress={skip}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            )}

            {/* Slides */}
            <FlatList
                ref={flatListRef}
                data={onboardingData}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onViewableItemsChanged={viewableItemsChanged}
                viewabilityConfig={viewConfig}
                bounces={false}
            />

            {/* Footer */}
            <View style={styles.footer}>
                {/* Pagination Dots */}
                <View style={styles.pagination}>
                    {onboardingData.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === currentIndex && styles.dotActive,
                                index === currentIndex && {
                                    backgroundColor: onboardingData[currentIndex].color,
                                },
                            ]}
                        />
                    ))}
                </View>

                {/* Next/Get Started Button */}
                <Button
                    title={currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
                    onPress={scrollToNext}
                    icon={currentIndex === onboardingData.length - 1 ? 'checkmark-circle' : 'arrow-forward'}
                    iconPosition="right"
                    variant="primary"
                    size="large"
                    style={{ backgroundColor: onboardingData[currentIndex].color }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    skipButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: 20,
    },
    skipText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.dark.textSecondary,
    },

    // Slide
    slide: {
        width,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    illustrationContainer: {
        width: width * 0.8,
        height: width * 0.8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    illustrationCircle: {
        width: '100%',
        height: '100%',
        borderRadius: width * 0.4,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    iconCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    // Decorative dots
    decorDot: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    dot1: {
        top: 60,
        left: 40,
    },
    dot2: {
        top: 100,
        right: 50,
    },
    dot3: {
        bottom: 80,
        left: 60,
    },

    // Content
    content: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.dark.text,
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 36,
    },
    description: {
        fontSize: 16,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        fontWeight: '500',
    },

    // Footer
    footer: {
        paddingHorizontal: 40,
        paddingBottom: 50,
        paddingTop: 20,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.dark.border,
    },
    dotActive: {
        width: 24,
        height: 8,
        borderRadius: 4,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
});