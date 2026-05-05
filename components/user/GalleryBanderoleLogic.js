import { useState, useEffect } from 'react';

export const useGallery = (media, isHe) => {
    const [selectedIndex, setSelectedIndex] = useState(null);

    const items = media || [];

    // Helper: Identify YouTube content
    const checkIsYoutube = (item) => {
        if (!item || !item.url) return false;
        return item.type === 'youtube' ||
               item.url.includes('youtube.com') ||
               item.url.includes('youtu.be');
    };

    // Filtered Lists
    const videoItems = items.filter(item => item.type === 'video' || checkIsYoutube(item));
    const imageItems = items.filter(item => item.type !== 'video' && !checkIsYoutube(item));

    // Combined list for Lightbox navigation (Videos first, then Images)
    const allItems = [...videoItems, ...imageItems];

    const getYoutubeInfo = (url) => {
        if (!url) return { id: null, thumbnail: null, embed: null };
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        const id = (match && match[7].length === 11) ? match[7] : null;

        return {
            id,
            thumbnail: id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null,
            embed: id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null
        };
    };

    const nextItem = (e) => {
        e?.stopPropagation();
        setSelectedIndex((prev) =>
            (isHe ? (prev - 1 + allItems.length) % allItems.length : (prev + 1) % allItems.length)
        );
    };

    const prevItem = (e) => {
        e?.stopPropagation();
        setSelectedIndex((prev) =>
            (isHe ? (prev + 1) % allItems.length : (prev - 1 + allItems.length) % allItems.length)
        );
    };

    const scroll = (direction, containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        // In RTL (isHe), positive scroll moves 'left' visually
        const distance = isHe ? 400 : -400;
        const scrollAmount = direction === 'left' ? distance : -distance;
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    const closeLightbox = () => setSelectedIndex(null);

    return {
        allItems,
        videoItems,
        imageItems,
        selectedIndex,
        setSelectedIndex,
        getYoutubeInfo,
        checkIsYoutube,
        nextItem,
        prevItem,
        scroll,
        closeLightbox
    };
};