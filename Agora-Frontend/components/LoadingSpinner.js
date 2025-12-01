// import React, { useRef, useEffect } from 'react';
// import { View, Animated, StyleSheet, Easing } from 'react-native';
// import { COLORS } from '../utils/colors';

// const LoadingSpinner = ({ size = 'medium', color = COLORS.primary }) => {
//     const spinValue = useRef(new Animated.Value(0)).current;
//     const scaleValue1 = useRef(new Animated.Value(1)).current;
//     const scaleValue2 = useRef(new Animated.Value(1)).current;
//     const scaleValue3 = useRef(new Animated.Value(1)).current;
//     const opacityValue = useRef(new Animated.Value(1)).current;

//     const sizes = {
//         small: 12,
//         medium: 16,
//         large: 20,
//     };

//     const dotSize = sizes[size] || sizes.medium;
//     const containerSize = dotSize * 8;

//     useEffect(() => {
//         // Rotation animation
//         Animated.loop(
//             Animated.timing(spinValue, {
//                 toValue: 1,
//                 duration: 1200,
//                 easing: Easing.linear,
//                 useNativeDriver: true,
//             })
//         ).start();

//         // Pulsing animations for dots
//         const createPulseAnimation = (scaleValue, delay) => {
//             return Animated.loop(
//                 Animated.sequence([
//                     Animated.delay(delay),
//                     Animated.parallel([
//                         Animated.timing(scaleValue, {
//                             toValue: 1.5,
//                             duration: 600,
//                             easing: Easing.bezier(0.34, 1.56, 0.64, 1),
//                             useNativeDriver: true,
//                         }),
//                         Animated.timing(opacityValue, {
//                             toValue: 0.3,
//                             duration: 600,
//                             useNativeDriver: true,
//                         }),
//                     ]),
//                     Animated.parallel([
//                         Animated.timing(scaleValue, {
//                             toValue: 1,
//                             duration: 600,
//                             easing: Easing.bezier(0.34, 1.56, 0.64, 1),
//                             useNativeDriver: true,
//                         }),
//                         Animated.timing(opacityValue, {
//                             toValue: 1,
//                             duration: 600,
//                             useNativeDriver: true,
//                         }),
//                     ]),
//                 ])
//             );
//         };

//         createPulseAnimation(scaleValue1, 0).start();
//         createPulseAnimation(scaleValue2, 200).start();
//         createPulseAnimation(scaleValue3, 400).start();
//     }, [spinValue, scaleValue1, scaleValue2, scaleValue3, opacityValue]);

//     const spin = spinValue.interpolate({
//         inputRange: [0, 1],
//         outputRange: ['0deg', '360deg'],
//     });

//     return (
//         <View style={styles.container}>
//             <Animated.View
//                 style={[
//                     styles.spinnerContainer,
//                     {
//                         width: containerSize,
//                         height: containerSize,
//                         transform: [{ rotate: spin }],
//                     },
//                 ]}
//             >
//                 {/* Top Dot */}
//                 <Animated.View
//                     style={[
//                         styles.dot,
//                         {
//                             width: dotSize,
//                             height: dotSize,
//                             borderRadius: dotSize / 2,
//                             backgroundColor: color,
//                             top: 0,
//                             left: '50%',
//                             marginLeft: -dotSize / 2,
//                             transform: [{ scale: scaleValue1 }],
//                             opacity: opacityValue,
//                         },
//                     ]}
//                 />

//                 {/* Right Dot */}
//                 <Animated.View
//                     style={[
//                         styles.dot,
//                         {
//                             width: dotSize,
//                             height: dotSize,
//                             borderRadius: dotSize / 2,
//                             backgroundColor: color,
//                             right: 0,
//                             top: '50%',
//                             marginTop: -dotSize / 2,
//                             transform: [{ scale: scaleValue2 }],
//                             opacity: opacityValue,
//                         },
//                     ]}
//                 />

//                 {/* Bottom Dot */}
//                 <Animated.View
//                     style={[
//                         styles.dot,
//                         {
//                             width: dotSize,
//                             height: dotSize,
//                             borderRadius: dotSize / 2,
//                             backgroundColor: color,
//                             bottom: 0,
//                             left: '50%',
//                             marginLeft: -dotSize / 2,
//                             transform: [{ scale: scaleValue3 }],
//                             opacity: opacityValue,
//                         },
//                     ]}
//                 />

//                 {/* Left Dot */}
//                 <Animated.View
//                     style={[
//                         styles.dot,
//                         {
//                             width: dotSize,
//                             height: dotSize,
//                             borderRadius: dotSize / 2,
//                             backgroundColor: color,
//                             left: 0,
//                             top: '50%',
//                             marginTop: -dotSize / 2,
//                             transform: [{ scale: scaleValue1 }],
//                             opacity: opacityValue,
//                         },
//                     ]}
//                 />

//                 {/* Center Circle */}
//                 <View
//                     style={[
//                         styles.centerCircle,
//                         {
//                             width: dotSize * 1.5,
//                             height: dotSize * 1.5,
//                             borderRadius: (dotSize * 1.5) / 2,
//                             backgroundColor: `${color}20`,
//                         },
//                     ]}
//                 />
//             </Animated.View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         flex: 1,
//         backgroundColor: 'transparent',
//     },
//     spinnerContainer: {
//         position: 'relative',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     dot: {
//         position: 'absolute',
//         shadowColor: COLORS.primary,
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.3,
//         shadowRadius: 4,
//         elevation: 3,
//     },
//     centerCircle: {
//         position: 'absolute',
//     },
// });

// export default LoadingSpinner;



// import React, { useRef, useEffect } from 'react';
// import { View, Animated, StyleSheet, Easing } from 'react-native';
// import { COLORS } from '../utils/colors';

// const LoadingSpinner = ({ size = 'medium', color = COLORS.primary }) => {
//     const rotateValue = useRef(new Animated.Value(0)).current;
//     const scaleValue = useRef(new Animated.Value(1)).current;
//     const borderRadiusAnim = useRef(new Animated.Value(0)).current;
//     const skewValue = useRef(new Animated.Value(0)).current;

//     const sizes = {
//         small: 30,
//         medium: 50,
//         large: 70,
//     };

//     const squareSize = sizes[size] || sizes.medium;

//     useEffect(() => {
//         const createAnimation = () => {
//             return Animated.loop(
//                 Animated.sequence([
//                     // Phase 1: Rotate and morph to circle
//                     Animated.parallel([
//                         Animated.timing(rotateValue, {
//                             toValue: 1,
//                             duration: 800,
//                             easing: Easing.bezier(0.65, 0, 0.35, 1),
//                             useNativeDriver: true,
//                         }),
//                         Animated.timing(borderRadiusAnim, {
//                             toValue: 1,
//                             duration: 800,
//                             easing: Easing.bezier(0.65, 0, 0.35, 1),
//                             useNativeDriver: false,
//                         }),
//                         Animated.timing(scaleValue, {
//                             toValue: 0.8,
//                             duration: 400,
//                             easing: Easing.bezier(0.65, 0, 0.35, 1),
//                             useNativeDriver: true,
//                         }),
//                     ]),

//                     // Phase 2: Scale back
//                     Animated.timing(scaleValue, {
//                         toValue: 1,
//                         duration: 400,
//                         easing: Easing.bezier(0.65, 0, 0.35, 1),
//                         useNativeDriver: true,
//                     }),

//                     // Phase 3: Morph to rectangle
//                     Animated.parallel([
//                         Animated.timing(skewValue, {
//                             toValue: 1,
//                             duration: 600,
//                             easing: Easing.bezier(0.65, 0, 0.35, 1),
//                             useNativeDriver: false,
//                         }),
//                         Animated.timing(borderRadiusAnim, {
//                             toValue: 0.3,
//                             duration: 600,
//                             easing: Easing.bezier(0.65, 0, 0.35, 1),
//                             useNativeDriver: false,
//                         }),
//                     ]),

//                     // Phase 4: Continue rotating
//                     Animated.timing(rotateValue, {
//                         toValue: 2,
//                         duration: 800,
//                         easing: Easing.bezier(0.65, 0, 0.35, 1),
//                         useNativeDriver: true,
//                     }),

//                     // Phase 5: Reset to square
//                     Animated.parallel([
//                         Animated.timing(skewValue, {
//                             toValue: 0,
//                             duration: 600,
//                             easing: Easing.bezier(0.65, 0, 0.35, 1),
//                             useNativeDriver: false,
//                         }),
//                         Animated.timing(borderRadiusAnim, {
//                             toValue: 0,
//                             duration: 600,
//                             easing: Easing.bezier(0.65, 0, 0.35, 1),
//                             useNativeDriver: false,
//                         }),
//                         Animated.timing(rotateValue, {
//                             toValue: 0,
//                             duration: 600,
//                             easing: Easing.bezier(0.65, 0, 0.35, 1),
//                             useNativeDriver: true,
//                         }),
//                     ]),
//                 ])
//             );
//         };

//         const animation = createAnimation();
//         animation.start();

//         return () => animation.stop();
//     }, [rotateValue, scaleValue, borderRadiusAnim, skewValue]);

//     const rotate = rotateValue.interpolate({
//         inputRange: [0, 1, 2],
//         outputRange: ['0deg', '90deg', '180deg'],
//     });

//     const borderRadius = borderRadiusAnim.interpolate({
//         inputRange: [0, 0.3, 1],
//         outputRange: [8, 12, squareSize / 2],
//     });

//     const height = skewValue.interpolate({
//         inputRange: [0, 1],
//         outputRange: [squareSize, squareSize * 0.6],
//     });

//     return (
//         <View style={styles.container}>
//             <Animated.View
//                 style={[
//                     styles.square,
//                     {
//                         width: squareSize,
//                         height: height,
//                         borderRadius: borderRadius,
//                         backgroundColor: color,
//                         transform: [
//                             { rotate },
//                             { scale: scaleValue },
//                         ],
//                         shadowColor: color,
//                         shadowOffset: { width: 0, height: 4 },
//                         shadowOpacity: 0.4,
//                         shadowRadius: 8,
//                         elevation: 5,
//                     },
//                 ]}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         flex: 1,
//         backgroundColor: 'transparent',
//     },
//     square: {
//     },
// });

// export default LoadingSpinner;


// import React, { useRef, useEffect } from 'react';
// import { View, Animated, StyleSheet, Easing } from 'react-native';
// import { COLORS } from '../utils/colors';

// const LoadingSpinner = ({ size = 'medium', color = COLORS.primary }) => {
//     const rotateValue = useRef(new Animated.Value(0)).current;
//     const scaleValue = useRef(new Animated.Value(1)).current;
//     const borderRadiusAnim = useRef(new Animated.Value(0)).current;
//     const skewValue = useRef(new Animated.Value(0)).current;

//     const sizes = {
//         small: 30,
//         medium: 50,
//         large: 70,
//     };

//     const squareSize = sizes[size] || sizes.medium;

//     useEffect(() => {
//         const animation = Animated.loop(
//             Animated.sequence([
//                 // Phase 1: Rotate and morph to circle
//                 Animated.parallel([
//                     // Native driver animations
//                     Animated.timing(rotateValue, {
//                         toValue: 1,
//                         duration: 800,
//                         easing: Easing.bezier(0.65, 0, 0.35, 1),
//                         useNativeDriver: true,
//                     }),
//                     Animated.timing(scaleValue, {
//                         toValue: 0.8,
//                         duration: 400,
//                         easing: Easing.bezier(0.65, 0, 0.35, 1),
//                         useNativeDriver: true,
//                     }),
//                 ]),
//                 // Layout animations separately
//                 Animated.parallel([
//                     Animated.timing(borderRadiusAnim, {
//                         toValue: 1,
//                         duration: 800,
//                         easing: Easing.bezier(0.65, 0, 0.35, 1),
//                         useNativeDriver: false,
//                     }),
//                     Animated.timing(skewValue, {
//                         toValue: 1,
//                         duration: 600,
//                         easing: Easing.bezier(0.65, 0, 0.35, 1),
//                         useNativeDriver: false,
//                     }),
//                 ]),
//                 // Phase 2: Reset scale/rotate
//                 Animated.parallel([
//                     Animated.timing(rotateValue, {
//                         toValue: 0,
//                         duration: 600,
//                         easing: Easing.bezier(0.65, 0, 0.35, 1),
//                         useNativeDriver: true,
//                     }),
//                     Animated.timing(scaleValue, {
//                         toValue: 1,
//                         duration: 600,
//                         easing: Easing.bezier(0.65, 0, 0.35, 1),
//                         useNativeDriver: true,
//                     }),
//                 ]),
//                 // Reset layout properties
//                 Animated.parallel([
//                     Animated.timing(borderRadiusAnim, {
//                         toValue: 0,
//                         duration: 600,
//                         easing: Easing.bezier(0.65, 0, 0.35, 1),
//                         useNativeDriver: false,
//                     }),
//                     Animated.timing(skewValue, {
//                         toValue: 0,
//                         duration: 600,
//                         easing: Easing.bezier(0.65, 0, 0.35, 1),
//                         useNativeDriver: false,
//                     }),
//                 ]),
//             ])
//         );

//         animation.start();
//         return () => animation.stop();
//     }, []);

//     const rotate = rotateValue.interpolate({
//         inputRange: [0, 1, 2],
//         outputRange: ['0deg', '90deg', '180deg'],
//     });

//     const borderRadius = borderRadiusAnim.interpolate({
//         inputRange: [0, 0.3, 1],
//         outputRange: [8, 12, squareSize / 2],
//     });

//     const height = skewValue.interpolate({
//         inputRange: [0, 1],
//         outputRange: [squareSize, squareSize * 0.6],
//     });

//     return (
//         <View style={styles.container}>
//             <Animated.View
//                 style={[
//                     {
//                         width: squareSize,
//                         height: height,
//                         borderRadius: borderRadius,
//                         backgroundColor: color,
//                         transform: [{ rotate }, { scale: scaleValue }],
//                         shadowColor: color,
//                         shadowOffset: { width: 0, height: 4 },
//                         shadowOpacity: 0.4,
//                         shadowRadius: 8,
//                         elevation: 5,
//                     },
//                 ]}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         flex: 1,
//         backgroundColor: 'transparent',
//     },
// });

// export default LoadingSpinner;




// import React, { useRef, useEffect } from 'react';
// import { View, Animated, StyleSheet, Easing } from 'react-native';
// import { COLORS } from '../utils/colors';

// const LoadingSpinner = ({ size = 'medium', color = COLORS.primary }) => {
//     const rotateValue = useRef(new Animated.Value(0)).current;
//     const scaleValue = useRef(new Animated.Value(1)).current;

//     // layout-only anims
//     const borderRadiusAnim = useRef(new Animated.Value(0)).current;
//     const skewValue = useRef(new Animated.Value(0)).current;

//     const sizes = { small: 30, medium: 50, large: 70 };
//     const squareSize = sizes[size] || sizes.medium;

//     useEffect(() => {
//         const animation = Animated.loop(
//             Animated.sequence([
//                 // === Phase 1 === native animations
//                 Animated.parallel([
//                     Animated.timing(rotateValue, {
//                         toValue: 1,
//                         duration: 800,
//                         easing: Easing.bezier(0.65, 0, 0.35, 1),
//                         useNativeDriver: true,
//                     }),
//                     Animated.timing(scaleValue, {
//                         toValue: 0.8,
//                         duration: 400,
//                         easing: Easing.bezier(0.65, 0, 0.35, 1),
//                         useNativeDriver: true,
//                     }),
//                 ]),

//                 // === Phase 1 layout ===
//                 Animated.parallel([
//                     Animated.timing(borderRadiusAnim, {
//                         toValue: 1,
//                         duration: 800,
//                         easing: Easing.bezier(0.65, 0, 0.35, 1),
//                         useNativeDriver: false,
//                     }),
//                     Animated.timing(skewValue, {
//                         toValue: 1,
//                         duration: 600,
//                         easing: Easing.bezier(0.65, 0, 0.35, 1),
//                         useNativeDriver: false,
//                     }),
//                 ]),

//                 // === Reset native ===
//                 Animated.parallel([
//                     Animated.timing(rotateValue, {
//                         toValue: 0,
//                         duration: 600,
//                         easing: Easing.bezier(0.65, 0, 0.35, 1),
//                         useNativeDriver: true,
//                     }),
//                     Animated.timing(scaleValue, {
//                         toValue: 1,
//                         duration: 600,
//                         easing: Easing.bezier(0.65, 0, 0.35, 1),
//                         useNativeDriver: true,
//                     }),
//                 ]),

//                 // === Reset layout ===
//                 Animated.parallel([
//                     Animated.timing(borderRadiusAnim, {
//                         toValue: 0,
//                         duration: 600,
//                         easing: Easing.bezier(0.65, 0, 0.35, 1),
//                         useNativeDriver: false,
//                     }),
//                     Animated.timing(skewValue, {
//                         toValue: 0,
//                         duration: 600,
//                         easing: Easing.bezier(0.65, 0, 0.35, 1),
//                         useNativeDriver: false,
//                     }),
//                 ]),
//             ])
//         );

//         animation.start();
//         return () => animation.stop();
//     }, []);

//     const rotate = rotateValue.interpolate({
//         inputRange: [0, 1],
//         outputRange: ['0deg', '180deg'],
//     });

//     const borderRadius = borderRadiusAnim.interpolate({
//         inputRange: [0, 1],
//         outputRange: [8, squareSize / 2],
//     });

//     const height = skewValue.interpolate({
//         inputRange: [0, 1],
//         outputRange: [squareSize, squareSize * 0.6],
//     });

//     return (
//         <View style={styles.container}>
//             {/* outer for native driver transforms */}
//             <Animated.View
//                 style={{
//                     transform: [{ rotate }, { scale: scaleValue }],
//                 }}
//             >
//                 {/* inner for JS-layout animations */}
//                 <Animated.View
//                     style={{
//                         width: squareSize,
//                         height: height,
//                         borderRadius: borderRadius,
//                         backgroundColor: color,
//                     }}
//                 />
//             </Animated.View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         flex: 1,
//         backgroundColor: 'transparent',
//     },
// });

// export default LoadingSpinner;




// import React, { useRef, useEffect } from 'react';
// import { View, Animated, StyleSheet, Easing } from 'react-native';
// import { COLORS } from '../utils/colors';

// const LoadingSpinner = ({ size = 'medium', color = COLORS.primary }) => {
//     const rotateValue = useRef(new Animated.Value(0)).current;
//     const scaleValue = useRef(new Animated.Value(1)).current;

//     const sizes = {
//         small: 30,
//         medium: 50,
//         large: 70,
//     };

//     const squareSize = sizes[size] || sizes.medium;

//     useEffect(() => {
//         const animation = Animated.loop(
//             Animated.parallel([
//                 Animated.timing(rotateValue, {
//                     toValue: 1,
//                     duration: 900,
//                     easing: Easing.linear,
//                     useNativeDriver: true,
//                 }),
//                 Animated.sequence([
//                     Animated.timing(scaleValue, {
//                         toValue: 0.85,
//                         duration: 450,
//                         easing: Easing.ease,
//                         useNativeDriver: true,
//                     }),
//                     Animated.timing(scaleValue, {
//                         toValue: 1,
//                         duration: 450,
//                         easing: Easing.ease,
//                         useNativeDriver: true,
//                     }),
//                 ]),
//             ])
//         );

//         animation.start();
//         return () => animation.stop();
//     }, []);

//     const rotate = rotateValue.interpolate({
//         inputRange: [0, 1],
//         outputRange: ['0deg', '360deg'],
//     });

//     return (
//         <View style={styles.container}>
//             <Animated.View
//                 style={{
//                     width: squareSize,
//                     height: squareSize,
//                     borderRadius: 12,
//                     backgroundColor: color,
//                     transform: [{ rotate }, { scale: scaleValue }],
//                     shadowColor: color,
//                     shadowOffset: { width: 0, height: 4 },
//                     shadowOpacity: 0.4,
//                     shadowRadius: 8,
//                     elevation: 5,
//                 }}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         // flex: 1,
//         marginBottom: 30,
//         backgroundColor: 'transparent',
//     },
// });

// export default LoadingSpinner;



// import React, { useRef, useEffect } from 'react';
// import { View, Animated, StyleSheet, Easing } from 'react-native';
// import { COLORS } from '../utils/colors';

// const LoadingSpinner = ({ size = 'medium', color = COLORS.primary }) => {
//     const rotateValue = useRef(new Animated.Value(0)).current;
//     const scaleValue = useRef(new Animated.Value(1)).current;

//     // JS-driven animation values
//     const borderRadiusAnim = useRef(new Animated.Value(0)).current;
//     const heightAnim = useRef(new Animated.Value(0)).current;

//     const sizes = {
//         small: 30,
//         medium: 50,
//         large: 70,
//     };

//     const squareSize = sizes[size] || sizes.medium;

//     useEffect(() => {
//         heightAnim.setValue(squareSize);

//         const loopAnim = Animated.loop(
//             Animated.sequence([
//                 // Phase 1: transform (native)
//                 Animated.parallel([
//                     Animated.timing(rotateValue, {
//                         toValue: 1,
//                         duration: 800,
//                         easing: Easing.ease,
//                         useNativeDriver: true,
//                     }),
//                     Animated.timing(scaleValue, {
//                         toValue: 0.8,
//                         duration: 800,
//                         easing: Easing.ease,
//                         useNativeDriver: true,
//                     }),
//                 ]),

//                 // Phase 2: shape morph (JS)
//                 Animated.parallel([
//                     Animated.timing(borderRadiusAnim, {
//                         toValue: 1,
//                         duration: 600,
//                         easing: Easing.ease,
//                         useNativeDriver: false,
//                     }),
//                     Animated.timing(heightAnim, {
//                         toValue: squareSize * 0.6,
//                         duration: 600,
//                         easing: Easing.ease,
//                         useNativeDriver: false,
//                     }),
//                 ]),

//                 // Reset
//                 Animated.parallel([
//                     Animated.timing(rotateValue, {
//                         toValue: 0,
//                         duration: 600,
//                         easing: Easing.ease,
//                         useNativeDriver: true,
//                     }),
//                     Animated.timing(scaleValue, {
//                         toValue: 1,
//                         duration: 600,
//                         easing: Easing.ease,
//                         useNativeDriver: true,
//                     }),
//                     Animated.timing(borderRadiusAnim, {
//                         toValue: 0,
//                         duration: 600,
//                         easing: Easing.ease,
//                         useNativeDriver: false,
//                     }),
//                     Animated.timing(heightAnim, {
//                         toValue: squareSize,
//                         duration: 600,
//                         easing: Easing.ease,
//                         useNativeDriver: false,
//                     }),
//                 ]),
//             ])
//         );

//         loopAnim.start();
//         return () => loopAnim.stop();
//     }, []);

//     const rotate = rotateValue.interpolate({
//         inputRange: [0, 1],
//         outputRange: ['0deg', '180deg'],
//     });

//     const borderRadius = borderRadiusAnim.interpolate({
//         inputRange: [0, 1],
//         outputRange: [8, squareSize / 2],
//     });

//     return (
//         <View style={styles.container}>
//             {/* Native transforms only */}
//             <Animated.View
//                 style={{
//                     transform: [{ rotate }, { scale: scaleValue }],
//                 }}
//             >
//                 {/* JS-driven layout morphing */}
//                 <Animated.View
//                     style={{
//                         width: squareSize,
//                         height: heightAnim,
//                         backgroundColor: color,
//                         borderRadius: borderRadius,
//                     }}
//                 />
//             </Animated.View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         // flex: 1,
//         marginBottom: 30,
//         backgroundColor: 'transparent',
//     },
// });

// export default LoadingSpinner;



import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import { COLORS } from '../utils/colors';

const LoadingSpinner = ({
    size = 'medium',
    color = COLORS.primary,
    variant = 'circular' // 'circular', 'dots', 'bars'
}) => {
    const sizes = {
        small: 30,
        medium: 50,
        large: 70,
    };

    const spinnerSize = sizes[size] || sizes.medium;

    switch (variant) {
        case 'bars':
            return <BarsSpinner size={spinnerSize} color={color} />;
        case 'dots':
            return <DotsSpinner size={spinnerSize} color={color} />;
        case 'circular':
        default:
            return <CircularSpinner size={spinnerSize} color={color} />;
    }
};

// Circular Spinner (Lottie-style smooth)
const CircularSpinner = ({ size, color }) => {
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.circularSpinner,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderWidth: size / 8,
                        borderTopColor: color,
                        borderRightColor: `${color}40`,
                        borderBottomColor: `${color}20`,
                        borderLeftColor: `${color}60`,
                        transform: [{ rotate: spin }],
                    },
                ]}
            />
        </View>
    );
};

// Dots Spinner (3 bouncing dots)
const DotsSpinner = ({ size, color }) => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const createAnimation = (dotValue, delay) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(dotValue, {
                        toValue: 1,
                        duration: 400,
                        easing: Easing.ease,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dotValue, {
                        toValue: 0,
                        duration: 400,
                        easing: Easing.ease,
                        useNativeDriver: true,
                    }),
                ])
            );
        };

        const anim1 = createAnimation(dot1, 0);
        const anim2 = createAnimation(dot2, 150);
        const anim3 = createAnimation(dot3, 300);

        anim1.start();
        anim2.start();
        anim3.start();

        return () => {
            anim1.stop();
            anim2.stop();
            anim3.stop();
        };
    }, []);

    const dotSize = size / 4;
    const gap = size / 8;

    const animateScale = (value) => ({
        transform: [{
            scale: value.interpolate({
                inputRange: [0, 1],
                outputRange: [0.6, 1.2],
            })
        }],
        opacity: value.interpolate({
            inputRange: [0, 1],
            outputRange: [0.4, 1],
        })
    });

    return (
        <View style={[styles.container, { flexDirection: 'row', gap }]}>
            <Animated.View
                style={[
                    styles.dot,
                    {
                        width: dotSize,
                        height: dotSize,
                        borderRadius: dotSize / 2,
                        backgroundColor: color,
                    },
                    animateScale(dot1),
                ]}
            />
            <Animated.View
                style={[
                    styles.dot,
                    {
                        width: dotSize,
                        height: dotSize,
                        borderRadius: dotSize / 2,
                        backgroundColor: color,
                    },
                    animateScale(dot2),
                ]}
            />
            <Animated.View
                style={[
                    styles.dot,
                    {
                        width: dotSize,
                        height: dotSize,
                        borderRadius: dotSize / 2,
                        backgroundColor: color,
                    },
                    animateScale(dot3),
                ]}
            />
        </View>
    );
};

// Bars Spinner (Equalizer style)
const BarsSpinner = ({ size, color }) => {
    const bar1 = useRef(new Animated.Value(0.3)).current;
    const bar2 = useRef(new Animated.Value(0.3)).current;
    const bar3 = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const createAnimation = (barValue, delay) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(barValue, {
                        toValue: 1,
                        duration: 400,
                        easing: Easing.ease,
                        useNativeDriver: true,
                    }),
                    Animated.timing(barValue, {
                        toValue: 0.3,
                        duration: 400,
                        easing: Easing.ease,
                        useNativeDriver: true,
                    }),
                ])
            );
        };

        const anim1 = createAnimation(bar1, 0);
        const anim2 = createAnimation(bar2, 150);
        const anim3 = createAnimation(bar3, 300);

        anim1.start();
        anim2.start();
        anim3.start();

        return () => {
            anim1.stop();
            anim2.stop();
            anim3.stop();
        };
    }, []);

    const barWidth = size / 6;
    const gap = size / 10;

    const animateHeight = (value) => ({
        transform: [{ scaleY: value }],
    });

    return (
        <View style={[styles.container, { flexDirection: 'row', alignItems: 'flex-end', gap }]}>
            <Animated.View
                style={[
                    styles.bar,
                    {
                        width: barWidth,
                        height: size,
                        borderRadius: barWidth / 2,
                        backgroundColor: color,
                    },
                    animateHeight(bar1),
                ]}
            />
            <Animated.View
                style={[
                    styles.bar,
                    {
                        width: barWidth,
                        height: size,
                        borderRadius: barWidth / 2,
                        backgroundColor: color,
                    },
                    animateHeight(bar2),
                ]}
            />
            <Animated.View
                style={[
                    styles.bar,
                    {
                        width: barWidth,
                        height: size,
                        borderRadius: barWidth / 2,
                        backgroundColor: color,
                    },
                    animateHeight(bar3),
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    circularSpinner: {
        borderStyle: 'solid',
    },
    dot: {
        // Styles applied inline
    },
    bar: {
        // Styles applied inline
    },
});

export default LoadingSpinner;



