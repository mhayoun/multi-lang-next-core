import React from 'react';
import { ChevronRight, ChevronLeft, X, Maximize2, PlayCircle, Video as VideoIcon } from 'lucide-react';
import { useGallery } from './GalleryBanderoleLogic';

const GalleryBanderole = ({ media, isHe }) => {
    const {
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
    } = useGallery(media, isHe);

    // Combine all media into one master list
    // Videos usually look better first in a mixed gallery, but you can swap these
    const allItems = [...videoItems, ...imageItems];

    const renderMedia = (item, index, isSingle = false) => {
        const isYoutube = checkIsYoutube(item);
        const yt = isYoutube ? getYoutubeInfo(item.url) : null;

        if (isSingle) {
            if (isYoutube) {
                return (
                    <div className="w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100">
                        <iframe
                            src={yt.embed.replace('autoplay=1', 'autoplay=0')}
                            className="w-full h-full"
                            allowFullScreen
                            title="Youtube Video"
                        />
                    </div>
                );
            }
            if (item.type === 'video') {
                return (
                    <video
                        src={item.url}
                        controls
                        className="w-full max-h-96 rounded-[2.5rem] shadow-2xl bg-black border border-slate-100"
                    />
                );
            }
            return (
                <img
                    src={item.url}
                    alt={item.alt || "gallery item"}
                    className="max-w-full h-auto rounded-xl shadow-lg cursor-pointer"
                    onClick={() => setSelectedIndex(index)}
                />
            );
        }

        return (
            <div
                onClick={() => setSelectedIndex(index)}
                className="relative w-80 h-52 rounded-[2rem] flex-shrink-0 snap-start overflow-hidden shadow-lg cursor-pointer group border border-slate-100 bg-slate-900"
            >
                {isYoutube ? (
                    <div className="w-full h-full relative">
                        <img src={yt.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-80" alt="" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="bg-red-600 p-3 rounded-2xl shadow-xl group-hover:scale-110 transition-transform">
                                <VideoIcon size={32} className="text-white" fill="currentColor" />
                            </div>
                        </div>
                    </div>
                ) : item.type === 'video' ? (
                    <div className="w-full h-full relative">
                        <video src={item.url} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <PlayCircle size={48} className="text-white/80 group-hover:scale-110 transition-transform" />
                        </div>
                    </div>
                ) : (
                    <img src={item.url} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
                    <Maximize2 className="text-white opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all" size={24} />
                </div>
            </div>
        );
    };

    return (
        <div className="mb-12" dir={isHe ? 'rtl' : 'ltr'}>
            {/* Unified Banderole Section */}
            <div className="mb-10">
                <div className="relative group/gallery">
                    <div className="relative">
                        {/* Navigation Buttons */}
                        <button
                            type="button"
                            onClick={() => scroll('left', 'main-gallery')}
                            className={`absolute top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-xl opacity-0 group-hover/gallery:opacity-100 transition-all hover:bg-blue-600 hover:text-white ${isHe ? 'right-2' : 'left-2'}`}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={() => scroll('right', 'main-gallery')}
                            className={`absolute top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-xl opacity-0 group-hover/gallery:opacity-100 transition-all hover:bg-blue-600 hover:text-white ${isHe ? 'left-2' : 'right-2'}`}
                        >
                            <ChevronRight size={20} />
                        </button>

                        {/* Combined Scroll Container */}
                        <div id="main-gallery" className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar snap-x scroll-smooth px-2">
                            {allItems.map((item, idx) => (
                                <React.Fragment key={`${item.url}-${idx}`}>
                                    {renderMedia(item, idx, false)}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* LIGHTBOX OVERLAY */}
            {selectedIndex !== null && (
                <div className="fixed inset-0 z-[9999] bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center animate-in fade-in duration-300" onClick={closeLightbox}>
                    <div className="absolute top-0 left-0 w-full p-6 flex justify-end z-[10000]">
                        <button type="button" className="bg-black/40 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-xl border border-white/20 shadow-2xl" onClick={closeLightbox}>
                            <X size={32} strokeWidth={3} />
                        </button>
                    </div>

                    <button type="button" className="absolute left-4 md:left-8 text-white/50 hover:text-white p-4 transition-all z-[1000]" onClick={isHe ? nextItem : prevItem}>
                        <ChevronLeft size={48} />
                    </button>
                    <button type="button" className="absolute right-4 md:right-8 text-white/50 hover:text-white p-4 transition-all z-[1000]" onClick={isHe ? prevItem : nextItem}>
                        <ChevronRight size={48} />
                    </button>

                    <div className="w-full max-w-5xl px-4 flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                        <div className="relative w-full flex justify-center items-center h-[70vh]">
                            {(() => {
                                const currentItem = allItems[selectedIndex];
                                if (!currentItem) return null;

                                if (checkIsYoutube(currentItem)) {
                                    return <iframe src={getYoutubeInfo(currentItem.url).embed} className="w-full h-full rounded-xl shadow-2xl aspect-video" allow="autoplay; encrypted-media" allowFullScreen title="Youtube" />;
                                } else if (currentItem.type === 'video') {
                                    return <video src={currentItem.url} controls autoPlay className="max-w-full max-h-full rounded-xl shadow-2xl" />;
                                } else {
                                    return <img src={currentItem.url} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-in zoom-in-95" alt="Preview" />;
                                }
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryBanderole;