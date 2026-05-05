import React, {useState} from 'react';
import {FileText, ChevronRight, ChevronLeft, Download, Eye, Loader2} from 'lucide-react';
import GalleryBanderole from './GalleryBanderole.jsx';

// 1. EXTRACTED COMPONENT: Handles its own state for downloads
const PDFRow = ({pdf, i, isHe}) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const pdfUrl = typeof pdf === 'string' ? pdf : pdf.url;
    const pdfName = typeof pdf === 'string' ? `Document ${i + 1}` : (pdf.name || `Document ${i + 1}`);

    const handleDownload = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            setIsDownloading(true);
            const response = await fetch(pdfUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = pdfName.endsWith('.pdf') ? pdfName : `${pdfName}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed", error);
            window.open(pdfUrl, '_blank');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div
            className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all group/doc">
            <div className="flex items-center gap-3 overflow-hidden flex-1 mr-4">
                <div className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-1 rounded shrink-0">PDF</div>
                <span className="font-bold text-slate-700 truncate">{pdfName}</span>
            </div>

            <div className="flex items-center gap-2">
                <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Open in new tab"
                >
                    <Eye size={20}/>
                </a>

                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${isDownloading ? 'text-slate-300 bg-slate-50' : 'text-slate-400 hover:text-green-600 hover:bg-green-50'}`}
                >
                    {isDownloading ? <Loader2 size={20} className="animate-spin"/> : <Download size={20}/>}
                </button>
            </div>
        </div>
    );
};

const DetailView = ({activeSubItem, setActiveSubItem, menuData, t, isHe, uiText}) => {

    const parentCategory = menuData.find(category =>
        category.subItems.some(s => s.id === activeSubItem.id)
    );

    const getProcessedContent = (htmlContent, title) => {
        if (!htmlContent) return '';
        const mobileRegex = /05\d[- ]?\d{7}/g;

        return htmlContent.replace(mobileRegex, (match, offset, fullString) => {
            const context = fullString.substring(Math.max(0, offset - 10), offset);
            if (context.includes('tel:') || context.includes('wa.me') || context.includes('href=')) {
                return match;
            }

            const rawNumber = match.replace(/\D/g, '');
            const formattedNumber = `972${rawNumber.substring(1)}`;
            const defaultMsg = isHe
                ? `שלום, אני מעוניין בפרטים אודות "${title}". אשמח שתחזרו אלי.`
                : `Hi, I am interested in "${title}". Please contact me.`;

            const waUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(defaultMsg)}`;

            return `${match} <a href="${waUrl}" target="_blank" rel="noopener noreferrer" 
            style="
                background-color: #25D366; 
                color: white !important; 
                text-decoration: none !important; 
                padding: 2px 10px; 
                border-radius: 50px; 
                font-size: 12px; 
                font-weight: bold; 
                display: inline-flex; 
                align-items: center; 
                margin: 0 4px;
                line-height: 1.2;
                vertical-align: middle;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            ">
            <span style="margin-left: 4px;">WhatsApp</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white" style="display:inline-block"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.438-9.89 9.886-.001 2.15.613 3.734 1.658 5.439l-1.11 4.057 4.232-1.11z"/></svg>
            </a>`;
        });
    };

    const getLinkedItemsData = (ids) => {
        if (!ids || !Array.isArray(ids)) return [];
        const foundItems = [];
        ids.forEach(id => {
            menuData.forEach(category => {
                const item = category.subItems.find(s => s.id === id);
                if (item) foundItems.push(item);
            });
        });
        return foundItems;
    };

    const linkedItems = getLinkedItemsData(activeSubItem.linkedItemIds);
    const allMedia = [
        ...(activeSubItem.videos || []).map(url => ({url, type: 'video'})),
        ...(activeSubItem.youtubes || []).map(url => ({url, type: 'youtube'})),
        ...(activeSubItem.images || []).map(url => ({url, type: 'image'}))
    ];

    const processedHtml = getProcessedContent(t(activeSubItem.content), t(activeSubItem.title));

    return (
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 px-4" dir={isHe ? 'rtl' : 'ltr'}>

            <style dangerouslySetInnerHTML={{ __html: `
                .dynamic-content table {
                    width: 100% !important;
                    border-collapse: collapse;
                    margin: 1.5rem 0;
                    background: white;
                }
                .dynamic-content th, .dynamic-content td {
                    border: 1px solid #e2e8f0;
                    padding: 12px;
                    text-align: ${isHe ? 'right' : 'left'};
                }
                .dynamic-content th {
                    background-color: #f8fafc;
                    font-weight: bold;
                }
                @media (max-width: 768px) {
                    .dynamic-content-wrapper { overflow-x: auto; }
                }
            `}} />

            {/* Back Button - Now absolute/sticky on desktop so it doesn't break centering */}
            <div className="relative">
                <div className={`md:absolute ${isHe ? 'md:-right-32' : 'md:-left-32'} top-0 mb-8 md:mb-0`}>
                    <button
                        onClick={() => {
                            setActiveSubItem(null);
                            window.scrollTo({top: 0, behavior: 'smooth'});
                        }}
                        className="text-blue-600 flex items-center gap-2 font-bold hover:opacity-70 transition-opacity sticky top-8"
                    >
                        {isHe ? <ChevronRight size={20}/> : <ChevronLeft size={20}/>}
                        {uiText.back}
                    </button>
                </div>

                {/* Centered Content Container */}
                <div className="max-w-3xl mx-auto w-full min-w-0">

                    {/* Breadcrumbs */}
                    <div className={`flex items-center gap-2 text-sm text-slate-400 mb-6 font-medium opacity-80 ${isHe ? 'justify-start' : 'justify-start'}`}>
                        <span className="truncate">{parentCategory ? t(parentCategory.title) : ''}</span>
                        {isHe ? <ChevronLeft size={14} className="shrink-0"/> : <ChevronRight size={14} className="shrink-0"/>}
                        <span className="text-blue-600 font-bold truncate">{t(activeSubItem.title)}</span>
                    </div>

                    {/* Main Content */}
                    <div className="dynamic-content-wrapper w-full">
                        <div
                            className={`dynamic-content text-lg leading-relaxed text-slate-600 mb-12 w-full ${isHe ? 'text-right' : 'text-left'}`}
                            dangerouslySetInnerHTML={{__html: processedHtml}}
                        />
                    </div>

                    {/* Assets Section - Centered inside the container */}
                    {activeSubItem.pdfs?.length > 0 && (
                        <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-[2.5rem] mb-12">
                            <h3 className="font-black text-xl mb-6 flex items-center gap-3 text-slate-800">
                                <FileText className="text-blue-600" size={24}/>
                                {uiText.docsTitle}
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                {activeSubItem.pdfs.map((pdf, i) => (
                                    <PDFRow key={i} pdf={pdf} i={i} isHe={isHe}/>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Media Gallery (Stays wide for impact) */}
            {allMedia.length > 0 && (
                <div className="my-12">
                    <GalleryBanderole media={allMedia} isHe={isHe}/>
                </div>
            )}

            {/* Related Items (Centered Title, Scrolling list below) */}
            {linkedItems.length > 0 && (
                <div className="mt-16 mb-20">
                    <div className="max-w-3xl mx-auto px-2">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">
                            {isHe ? 'קישורים רלוונטיים' : 'Related Links'}
                        </h3>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-6 snap-x">
                        {linkedItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveSubItem(item);
                                    window.scrollTo({top: 0, behavior: 'smooth'});
                                }}
                                className="relative flex-shrink-0 w-72 h-44 rounded-[2rem] overflow-hidden shadow-lg snap-start transition-transform hover:scale-[1.02]"
                            >
                                <img src={item.image || (item.images && item.images[0])}
                                     className="absolute inset-0 w-full h-full object-cover" alt=""/>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"/>
                                <div className={`absolute inset-0 p-6 flex flex-col justify-end text-white ${isHe ? 'text-right' : 'text-left'}`}>
                                    <h4 className="font-black text-lg">{t(item.title)}</h4>
                                    <div className="mt-2 flex items-center gap-1 text-xs font-bold">
                                        {isHe ? 'צפה עכשיו' : 'View Now'}
                                        {isHe ? <ChevronLeft size={14}/> : <ChevronRight size={14}/>}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailView;