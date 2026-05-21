import { useState, useEffect, useRef } from 'react';

export const useHomeNewsSlider = (newsData, durationInput = 10000) => {
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [progress, setProgress] = useState(100);
    const [duration, setDuration] = useState(durationInput);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef(null);

    // Mount & Resize Logic
    useEffect(() => {
        setIsMounted(true);
        const checkSize = () => setIsMobile(window.innerWidth < 768);
        checkSize();
        window.addEventListener('resize', checkSize);
        return () => window.removeEventListener('resize', checkSize);
    }, []);

    // Slider Timer Logic
    useEffect(() => {
        if (!newsData || newsData.length <= 1) return;

        setProgress(100);
        const startTime = Date.now();

        const timer = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsedTime / duration) * 100);
            setProgress(remaining);

            if (remaining <= 0) {
                setCurrentNewsIndex((prev) => (prev + 1) % newsData.length);
            }
        }, 100);

        return () => clearInterval(timer);
    }, [currentNewsIndex, newsData?.length, duration]);

    const goToNext = () => setCurrentNewsIndex((prev) => (prev + 1) % newsData.length);
    const goToPrev = () => setCurrentNewsIndex((prev) => (prev - 1 + newsData.length) % newsData.length);
    const setSlide = (i) => setCurrentNewsIndex(i);
    const toggleMute = (e) => {
        e.stopPropagation();
        setIsMuted(!isMuted);
    };

    return {
        currentNewsIndex, isMobile, isMounted, progress,
        duration, setDuration, isMuted, toggleMute,
        videoRef, goToNext, goToPrev, setSlide
    };
};