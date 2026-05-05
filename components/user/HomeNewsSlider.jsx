import React, {useState, useEffect} from 'react';
import {ChevronRight, ChevronLeft} from 'lucide-react';

const HomeNewsSlider = ({
                            newsData,
                            menuData,
                            handleSubItemClick,
                            setActiveSubItem,
                            t,
                            isHe
                        }) => {
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // 1. Détecter la taille de l'écran pour choisir la bonne image
    useEffect(() => {
        const checkSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkSize(); // Vérification initiale
        window.addEventListener('resize', checkSize);
        return () => window.removeEventListener('resize', checkSize);
    }, []);

    // 2. Intervalle du slider
    useEffect(() => {
        if (!newsData || newsData.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentNewsIndex((prev) => (prev + 1) % newsData.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [newsData]);

    if (!newsData || newsData.length === 0) return null;

    const currentItem = newsData[currentNewsIndex];

    // 3. Logique de sélection de l'image (Fallback vers images[0] si les spécifiques sont vides)
    // const getBannerImage = () => {
    //     if (isMobile) {
    //         return currentItem.bgImage_mob || currentItem.bgImage_web || currentItem.images?.[0] || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c';
    //     }
    //     return currentItem.bgImage_web || currentItem.bgImage_mob || currentItem.images?.[0] || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c';
    // };

    const getBannerImage = () => {
    const fallback = currentItem.images?.[0] || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c';

    if (isHe) {
        return isMobile
            ? (currentItem.bgImage_mob?.[0] || fallback)
            : (currentItem.bgImage_web?.[0] || fallback);
    } else {
        return isMobile
            ? (currentItem.bgImage_mob_en?.[0] || currentItem.bgImage_mob?.[0] || fallback)
            : (currentItem.bgImage_web_en?.[0] || currentItem.bgImage_web?.[0] ||  fallback);
    }
};

    return (
        <div
            className="relative w-full h-[450px] md:h-[475px] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl group">
            <div className="relative w-full h-full">
                <img
                    key={`${currentItem.id}-${isMobile}`} // La clé change avec isMobile pour forcer la transition
                    src={getBannerImage()}
                    className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-1000"
                    alt="news"
                />

                {/* Ombre très subtile uniquement en bas pour la lisibilité du texte */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"/>

                <div className="absolute bottom-0 p-6 md:p-10 text-white w-full">
                    {/*<span
                        className="bg-blue-600 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold mb-4 inline-block">
                      {isHe ? 'חדשות אחרונות' : 'Latest News'}
                    </span>*/}

                    <h2 className="text-2xl md:text-4xl font-black mb-4 drop-shadow-lg max-w-2xl">
                        {t(currentItem.title)}
                    </h2>

                    <button
                        onClick={() => {
                            // POSSIBILITY 2: If the Admin chose to link to an existing menu item
                            if (currentItem.contentMode === 'linker' && currentItem.linkedItemId) {
                                // Find the specific sub-item in your global menu data
                                const targetSubItem = menuData
                                    ?.flatMap(menu => menu.subItems || [])
                                    .find(sub => String(sub.id) === String(currentItem.linkedItemId));

                                if (targetSubItem) {
                                    // Use your specific navigation logic (top scroll, set view, etc.)
                                    handleSubItemClick(targetSubItem);
                                    return; // Stop here
                                }
                            }

                            // POSSIBILITY 1: Default behavior (Display the news page itself)
                            setActiveSubItem(currentItem);
                        }}
                        className="bg-white text-blue-900 px-6 md:px-8 py-2 md:py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                        {isHe ? 'קרא עוד' : 'Read More'}
                        <ChevronRight size={18} className={isHe ? 'rotate-180' : ''}/>
                    </button>
                </div>
            </div>

            {/* Navigation Controls */}
            {newsData.length > 1 && (
                <>
                    <button
                        onClick={() => setCurrentNewsIndex((prev) => (prev - 1 + newsData.length) % newsData.length)}
                        className="absolute top-1/2 -translate-y-1/2 left-4 md:left-6 p-2 md:p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronLeft size={24}/>
                    </button>
                    <button
                        onClick={() => setCurrentNewsIndex((prev) => (prev + 1) % newsData.length)}
                        className="absolute top-1/2 -translate-y-1/2 right-4 md:right-6 p-2 md:p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronRight size={24}/>
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {newsData.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentNewsIndex(i)}
                                className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                                    currentNewsIndex === i ? 'w-6 md:w-8 bg-blue-500' : 'w-1.5 md:w-2 bg-white/50 hover:bg-white'
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default HomeNewsSlider;