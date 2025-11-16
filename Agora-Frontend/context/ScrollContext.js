import React, { createContext, useRef, useContext } from 'react';
import { Animated } from 'react-native';

const ScrollContext = createContext(null);

export const ScrollProvider = ({ children }) => {
    const scrollY = useRef(new Animated.Value(0)).current;
    return (
        <ScrollContext.Provider value={scrollY}>
            {children}
        </ScrollContext.Provider>
    );
};

export const useScrollY = () => useContext(ScrollContext);
