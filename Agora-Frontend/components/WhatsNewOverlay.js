import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { COLORS } from '../utils/colors';
import { supabase } from '../utils/supabase';
import Button from '../components/Button';

// This pulls the version directly from your app.json
const CURRENT_VERSION = Constants.expoConfig.version;

const WhatsNewOverlay = () => {
    const [visible, setVisible] = useState(false);
    const [update, setUpdate] = useState(null);

    useEffect(() => {
        checkVersion();
    }, []);

    const checkVersion = async () => {
        try {
            const lastSeen = await AsyncStorage.getItem('last_seen_version');
            // Only show if user hasn't seen this version yet
            if (lastSeen !== CURRENT_VERSION) {
                fetchUpdateDetails();
            }
        } catch (e) {
            console.error('Version check failed:', e);
        }
    };

    const fetchUpdateDetails = async () => {
        const { data, error } = await supabase
            .from('whats_new')
            .select('*')
            .eq('status', 'live')
            .eq('is_published', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (data) {
            setUpdate(data);
            setVisible(true);
        }
    };

    const handleClose = async () => {
        await AsyncStorage.setItem('last_seen_version', CURRENT_VERSION);
        setVisible(false);
    };

    if (!update) return null;

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.overlayContainer}>
                <View style={styles.contentCard}>

                    {/* VISUAL HERO SECTION: Using your Play Store asset */}
                    <View style={styles.heroContainer}>
                        <Image
                            source={require('../assets/update-image.png')}
                            style={styles.productImage}
                            resizeMode="cover"
                        />
                    </View>

                    <View style={styles.textSection}>
                        <Text style={styles.title}>Agora v{update.version}</Text>

                        <Text style={styles.description}>
                            {update.description || "We've polished the marketplace and squashed some bugs for a better campus experience."}
                        </Text>
                    </View>

                    <Button
                        title="Got it!"
                        onPress={handleClose}
                        variant="primary"
                        size="medium"
                        //fullWidth={true}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlayContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.75)',
        justifyContent: 'flex-end',
    },
    contentCard: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        // Remove horizontal padding here so the image can touch the edges
        paddingBottom: Platform.OS === 'ios' ? 45 : 30,
        alignItems: 'center',
        overflow: 'hidden', // Ensures the image respects the border radius
    },
    heroContainer: {
        width: '100%',
        height: 280,
        backgroundColor: '#FFF',
        alignItems: 'center',
    },
    productImage: {
        width: '90%',
        height: '90%',
    },
    textSection: {
        alignItems: 'center',
        paddingHorizontal: 24,
        marginTop: 24,
        marginBottom: 32,
    },
    versionTag: {
        fontSize: 11,
        fontWeight: '900',
        color: COLORS.primary,
        letterSpacing: 2,
        marginBottom: 8,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1C1C1E',
        textAlign: 'center',
    },
    description: {
        fontSize: 15,
        color: '#636366',
        textAlign: 'center',
        lineHeight: 22,
        marginTop: 12,
    },
    primaryActionButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 18,
        borderRadius: 20,
        width: '90%', // Keep the button slightly away from edges
        alignItems: 'center',
        // Standard shadow for a premium feel
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: '#FFF',
        fontWeight: '800',
        fontSize: 17,
    },
});

export default WhatsNewOverlay;