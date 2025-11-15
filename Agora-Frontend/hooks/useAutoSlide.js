import { useEffect, useState } from 'react';

export const useAutoSlide = (length, interval = 6000) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!length || length === 0) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % length);
        }, interval);

        return () => clearInterval(timer);
    }, [length, interval]);

    return currentIndex;
};
