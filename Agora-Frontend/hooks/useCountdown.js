import { useState, useEffect } from 'react';

export const useCountdown = (initialSeconds = 0) => {
    const [time, setTime] = useState(initialSeconds);

    useEffect(() => {
        if (time <= 0) return;
        const interval = setInterval(() => setTime(prev => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [time]);

    const reset = (newTime) => setTime(newTime);

    return { time, reset };
};
