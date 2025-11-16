// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, Animated, StyleSheet } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';

// const DynamicHeader = ({ userName = 'there' }) => {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const fadeAnim = useRef(new Animated.Value(1)).current;
//     const slideAnim = useRef(new Animated.Value(0)).current;
//     const scaleAnim = useRef(new Animated.Value(1)).current;
//     const shimmerAnim = useRef(new Animated.Value(0)).current;
//     const pulseAnim = useRef(new Animated.Value(1)).current;

//     const getTimeBasedGreeting = () => {
//         const hour = new Date().getHours();

//         if (hour < 12) {
//             return [
//                 {
//                     main: 'Good Morning',
//                     sub: 'Start your day with great deals',
//                     gradient: ['#FEF3C7', '#FDE68A'],
//                     textColor: '#92400E'
//                 },
//                 {
//                     main: 'Morning, ' + userName,
//                     sub: 'What are you looking for today?',
//                     gradient: ['#DBEAFE', '#BFDBFE'],
//                     textColor: '#1E40AF'
//                 },
//                 {
//                     main: 'Rise & Shop',
//                     sub: 'Fresh listings added overnight',
//                     gradient: ['#FCE7F3', '#FBCFE8'],
//                     textColor: '#9F1239'
//                 },
//             ];
//         } else if (hour < 17) {
//             return [
//                 {
//                     main: 'Good Afternoon',
//                     sub: 'Find your perfect deal today',
//                     gradient: ['#E0E7FF', '#C7D2FE'],
//                     textColor: '#3730A3'
//                 },
//                 {
//                     main: 'Hey ' + userName,
//                     sub: 'New items just listed',
//                     gradient: ['#D1FAE5', '#A7F3D0'],
//                     textColor: '#065F46'
//                 },
//                 {
//                     main: 'Afternoon Deals',
//                     sub: 'Discover amazing finds',
//                     gradient: ['#FED7AA', '#FDBA74'],
//                     textColor: '#9A3412'
//                 },
//             ];
//         } else {
//             return [
//                 {
//                     main: 'Good Evening',
//                     sub: 'Browse tonight\'s best offers',
//                     gradient: ['#DDD6FE', '#C4B5FD'],
//                     textColor: '#5B21B6'
//                 },
//                 {
//                     main: 'Evening, ' + userName,
//                     sub: 'Check out what\'s trending',
//                     gradient: ['#BFDBFE', '#93C5FD'],
//                     textColor: '#1E40AF'
//                 },
//                 {
//                     main: 'Night Shopping',
//                     sub: 'Great deals don\'t sleep',
//                     gradient: ['#E9D5FF', '#D8B4FE'],
//                     textColor: '#6B21A8'
//                 },
//             ];
//         }
//     };

//     const messages = getTimeBasedGreeting();

//     useEffect(() => {
//         Animated.loop(
//             Animated.timing(shimmerAnim, {
//                 toValue: 1,
//                 duration: 4000,
//                 useNativeDriver: true,
//             })
//         ).start();
//     }, []);

//     useEffect(() => {
//         Animated.loop(
//             Animated.sequence([
//                 Animated.timing(pulseAnim, {
//                     toValue: 1.02,
//                     duration: 2000,
//                     useNativeDriver: true,
//                 }),
//                 Animated.timing(pulseAnim, {
//                     toValue: 1,
//                     duration: 2000,
//                     useNativeDriver: true,
//                 }),
//             ])
//         ).start();
//     }, []);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             Animated.parallel([
//                 Animated.timing(fadeAnim, {
//                     toValue: 0,
//                     duration: 600,
//                     useNativeDriver: true,
//                 }),
//                 Animated.timing(slideAnim, {
//                     toValue: -30,
//                     duration: 600,
//                     useNativeDriver: true,
//                 }),
//                 Animated.timing(scaleAnim, {
//                     toValue: 0.9,
//                     duration: 600,
//                     useNativeDriver: true,
//                 }),
//             ]).start(() => {
//                 setCurrentIndex((prev) => (prev + 1) % messages.length);

//                 slideAnim.setValue(30);
//                 scaleAnim.setValue(1.1);

//                 Animated.parallel([
//                     Animated.timing(fadeAnim, {
//                         toValue: 1,
//                         duration: 600,
//                         useNativeDriver: true,
//                     }),
//                     Animated.timing(slideAnim, {
//                         toValue: 0,
//                         duration: 600,
//                         useNativeDriver: true,
//                     }),
//                     Animated.spring(scaleAnim, {
//                         toValue: 1,
//                         friction: 8,
//                         tension: 40,
//                         useNativeDriver: true,
//                     }),
//                 ]).start();
//             });
//         }, 15000);

//         return () => clearInterval(interval);
//     }, [messages.length]);

//     const shimmerTranslate = shimmerAnim.interpolate({
//         inputRange: [0, 1],
//         outputRange: [-100, 100],
//     });

//     const currentMessage = messages[currentIndex];

//     return (
//         <View style={styles.container}>
//             {/* Gradient Background with Pulse */}
//             <Animated.View
//                 style={[
//                     styles.gradientWrapper,
//                     { transform: [{ scale: pulseAnim }] }
//                 ]}
//             >
//                 <LinearGradient
//                     colors={currentMessage.gradient}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 1 }}
//                     style={styles.gradient}
//                 >
//                     <Animated.View
//                         style={[
//                             styles.shimmer,
//                             {
//                                 transform: [{ translateX: shimmerTranslate }],
//                             },
//                         ]}
//                     />
//                 </LinearGradient>
//             </Animated.View>

//             <Animated.View
//                 style={[
//                     styles.textContainer,
//                     {
//                         opacity: fadeAnim,
//                         transform: [
//                             { translateY: slideAnim },
//                             { scale: scaleAnim }
//                         ],
//                     },
//                 ]}
//             >
//                 <Text style={[styles.greeting, { color: currentMessage.textColor }]}>
//                     {currentMessage.main}
//                 </Text>
//                 <Text style={[styles.subGreeting, { color: currentMessage.textColor }]}>
//                     {currentMessage.sub}
//                 </Text>
//             </Animated.View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         position: 'relative',
//         paddingVertical: 8,
//         paddingHorizontal: 16,
//         borderRadius: 14,
//         overflow: 'hidden',
//         marginBottom: 4,
//     },
//     gradientWrapper: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         borderRadius: 14,
//         overflow: 'hidden',
//     },
//     gradient: {
//         flex: 1,
//         borderRadius: 14,
//         overflow: 'hidden',
//     },
//     shimmer: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: 'rgba(255, 255, 255, 0.3)',
//         width: 100,
//     },
//     textContainer: {
//         zIndex: 1,
//     },
//     greeting: {
//         fontSize: 20,
//         fontWeight: '800',
//         letterSpacing: -0.3,
//         marginBottom: 2,
//     },
//     subGreeting: {
//         fontSize: 12,
//         fontWeight: '600',
//         opacity: 0.8,
//     },
// });

// export default DynamicHeader;


import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const DynamicHeader = ({ userName = 'there' }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const shimmerAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const getTimeBasedGreeting = () => {
        const hour = new Date().getHours();

        if (hour < 12) {
            return [
                {
                    main: 'Aaiye Aaiye!',
                    sub: 'Subah subah ki taaza deals!',
                    gradient: ['#FEF3C7', '#FDE68A'],
                    textColor: '#92400E'
                },
                {
                    main: 'Suprabhat, ' + userName,
                    sub: 'Aaj kya dhoondh rahe ho?',
                    gradient: ['#DBEAFE', '#BFDBFE'],
                    textColor: '#1E40AF'
                },
                {
                    main: 'Good Morning Dosto!',
                    sub: 'Raat bhar ke naye listings dekho',
                    gradient: ['#FCE7F3', '#FBCFE8'],
                    textColor: '#9F1239'
                },
                {
                    main: 'Jaldi Aao!',
                    sub: 'Best deals disappear fast',
                    gradient: ['#FEF3C7', '#FDE68A'],
                    textColor: '#92400E'
                },
            ];
        } else if (hour < 17) {
            return [
                {
                    main: 'Namaste Ji!',
                    sub: 'Dopahar ka special awaits',
                    gradient: ['#E0E7FF', '#C7D2FE'],
                    textColor: '#3730A3'
                },
                {
                    main: 'Kya Haal Chaal?',
                    sub: userName + ', aaj kuch naya try karo',
                    gradient: ['#D1FAE5', '#A7F3D0'],
                    textColor: '#065F46'
                },
                {
                    main: 'Arrey Bhai!',
                    sub: 'Hot deals are waiting for you',
                    gradient: ['#FED7AA', '#FDBA74'],
                    textColor: '#9A3412'
                },
                {
                    main: 'Lunch Break Ho Gaya?',
                    sub: 'Ab thoda shopping bhi kar lo',
                    gradient: ['#E0E7FF', '#C7D2FE'],
                    textColor: '#3730A3'
                },
            ];
        } else {
            return [
                {
                    main: 'Shaam Ho Gayi!',
                    sub: 'Trending items dekh lo',
                    gradient: ['#DDD6FE', '#C4B5FD'],
                    textColor: '#5B21B6'
                },
                {
                    main: 'Good Evening!',
                    sub: 'raat ko bhi chalti hai dukaan',
                    gradient: ['#BFDBFE', '#93C5FD'],
                    textColor: '#1E40AF'
                },
                {
                    main: 'Sone Se Pehle',
                    sub: 'Ek baar scroll toh kar lo!',
                    gradient: ['#E9D5FF', '#D8B4FE'],
                    textColor: '#6B21A8'
                },
                {
                    main: 'Late Night Deals',
                    sub: 'Kya pata kya mil jaaye!',
                    gradient: ['#DDD6FE', '#C4B5FD'],
                    textColor: '#5B21B6'
                },
            ];
        }
    };

    const messages = getTimeBasedGreeting();

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 4000,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.02,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: -30,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.9,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setCurrentIndex((prev) => (prev + 1) % messages.length);

                slideAnim.setValue(30);
                scaleAnim.setValue(1.1);

                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: 0,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.spring(scaleAnim, {
                        toValue: 1,
                        friction: 8,
                        tension: 40,
                        useNativeDriver: true,
                    }),
                ]).start();
            });
        }, 15000);

        return () => clearInterval(interval);
    }, [messages.length]);

    const shimmerTranslate = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, 100],
    });

    const currentMessage = messages[currentIndex];

    return (
        <View style={styles.container}>
            {/* Gradient Background with Pulse */}
            <Animated.View
                style={[
                    styles.gradientWrapper,
                    { transform: [{ scale: pulseAnim }] }
                ]}
            >
                <LinearGradient
                    colors={currentMessage.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    <Animated.View
                        style={[
                            styles.shimmer,
                            {
                                transform: [{ translateX: shimmerTranslate }],
                            },
                        ]}
                    />
                </LinearGradient>
            </Animated.View>

            <Animated.View
                style={[
                    styles.textContainer,
                    {
                        opacity: fadeAnim,
                        transform: [
                            { translateY: slideAnim },
                            { scale: scaleAnim }
                        ],
                    },
                ]}
            >
                <Text style={[styles.greeting, { color: currentMessage.textColor }]}>
                    {currentMessage.main}
                </Text>
                <Text style={[styles.subGreeting, { color: currentMessage.textColor }]}>
                    {currentMessage.sub}
                </Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: 4,
    },
    gradientWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 14,
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
        borderRadius: 14,
        overflow: 'hidden',
    },
    shimmer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        width: 100,
    },
    textContainer: {
        zIndex: 1,
    },
    greeting: {
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: -0.3,
        marginBottom: 2,
    },
    subGreeting: {
        fontSize: 12,
        fontWeight: '600',
        opacity: 0.8,
    },
});

export default DynamicHeader;