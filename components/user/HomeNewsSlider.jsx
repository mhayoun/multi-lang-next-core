import React from 'react';
import { ChevronRight, ChevronLeft, Volume2, VolumeX } from 'lucide-react';
import { useHomeNewsSlider } from './useHomeNewsSlider';

const HomeNewsSlider = ({ newsData, menuData, handleSubItemClick, setActiveSubItem, t, isHe }) => {
    const {
        currentNewsIndex, isMobile, isMounted, progress,
        duration, setDuration, isMuted, toggleMute,
        videoRef, goToNext, goToPrev, setSlide
    } = useHomeNewsSlider(newsData);

    if (!newsData || newsData.length === 0) return null;

    const currentItem = newsData[currentNewsIndex];
    const videoUrl = Array.isArray(currentItem?.bgVideo) ? currentItem.bgVideo[0] : currentItem?.bgVideo;

    const getBannerImage = () => {
        const fallback = currentItem.images?.[0] || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c';
        const mobileFrame = isMounted ? isMobile : false;
        if (isHe) {
            return mobileFrame ? (currentItem.bgImage_mob?.[0] || fallback) : (currentItem.bgImage_web?.[0] || fallback);
        }
        return mobileFrame ? (currentItem.bgImage_mob_en?.[0] || currentItem.bgImage_mob?.[0] || fallback) : (currentItem.bgImage_web_en?.[0] || currentItem.bgImage_web?.[0] || fallback);
    };

    return (
        <div className="relative w-full h-[450px] md:h-[475px] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl group">
            <div className="relative w-full h-full">
                {videoUrl ? (
                    <>
                        <video
                            ref={videoRef}
                            key={`${currentItem.id}-video`}
                            src={videoUrl}
                            autoPlay muted={isMuted} playsInline
                            onLoadedMetadata={(e) => setDuration(e.target.duration * 1000)}
                            className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-1000"
                        />
                        <button onClick={toggleMute} className="absolute top-4 right-4 z-50 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white">
                            {isMuted ? <VolumeX size={20}/> : <Volume2 size={20}/>}
                        </button>
                    </>
                ) : (
                    <img key={currentItem.id} src={getBannerImage()} onLoad={() => setDuration(10000)} className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-1000" alt="news" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"/>

                <div className="absolute bottom-0 p-6 md:p-10 text-white w-full z-10">
                    <h2 className="text-2xl md:text-4xl font-black mb-4 drop-shadow-lg max-w-2xl">{t(currentItem.title)}</h2>
                    <button
                        onClick={() => {
                            if (currentItem.contentMode === 'linker' && currentItem.linkedItemId) {
                                const target = menuData?.flatMap(m => m.subItems || []).find(s => String(s.id) === String(currentItem.linkedItemId));
                                if (target) return handleSubItemClick(target);
                            }
                            setActiveSubItem(currentItem);
                        }}
                        className="bg-white text-blue-900 px-6 md:px-8 py-2 md:py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                        {isHe ? 'קרא עוד' : 'Read More'}
                        <ChevronRight size={18} className={isHe ? 'rotate-180' : ''}/>
                    </button>
                </div>
            </div>

            {/* Navigation & Progress */}
            {newsData.length > 1 && (
                <>
                    <button onClick={goToPrev} className="absolute top-1/2 -translate-y-1/2 left-4 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-20"><ChevronLeft size={24}/></button>
                    <button onClick={goToNext} className="absolute top-1/2 -translate-y-1/2 right-4 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-20"><ChevronRight size={24}/></button>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {newsData.map((_, i) => (
                            <button key={i} onClick={() => setSlide(i)} className={`h-1.5 rounded-full transition-all duration-300 ${currentNewsIndex === i ? 'w-8 bg-blue-500' : 'w-2 bg-white/50'}`} />
                        ))}
                    </div>

                    <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/10 z-50">
                        <div className="h-full bg-blue-500 transition-all duration-100 ease-linear" style={{width: `${progress}%`}} />
                    </div>
                </>
            )}
        </div>
    );
};

export default HomeNewsSlider;