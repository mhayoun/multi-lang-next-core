import React, {useState, useEffect, useRef} from 'react';
import {
    Trash2, FileText, Eye, Code, Maximize2, X, CheckCircle2, Link,
    GripVertical, Copy, Check, Video, ExternalLink, Sparkles, RotateCcw, Upload, Bot
} from 'lucide-react';

import {useSubMenuEditor} from '@/components/admin/SubMenuEditor_Logic';
import {subMenuEditor_NewSrcHtml} from '@/components/admin/SubMenuEditor_NewSrcHtml';
import {subMenuEditor_NewPdfHtml} from '@/components/admin/SubMenuEditor_NewPdfHtml';

// New Refactored imports
import {useSubMenuActions} from './SubMenuEditor_Actions';
import {SectionLabel, ActionButton} from './SubMenuEditor_Components';

const SubMenuEditor = ({sub, menuId, isHe, handleFileUpload, removeFile, setMenuData, menuData}) => {
    const logic = useSubMenuEditor(sub, menuId, setMenuData, menuData);
    const actions = useSubMenuActions(logic, isHe, sub);

    const fileInputRef = useRef(null);
    const pdfInputRef = useRef(null);

    const getAutoInstruction = (lang) => lang === 'he'
        ? "צור קוד HTML נקי עבור תוכן זה (ללא תגיות html, head או body). שמור על רשימות וצבעים."
        : "Generate clean HTML code for this content for web and mobile (excluding html, head, or body tags). Preserve bullet points and colors.";

    const [customRequest, setCustomRequest] = useState(getAutoInstruction(logic.modalLang));

    const [lastClicked, setLastClicked] = useState(null);

    useEffect(() => {
        setCustomRequest(getAutoInstruction(logic.modalLang));
    }, [logic.modalLang]);

    return (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4 shadow-sm relative">

            {/* 1. HEADER & TOGGLE */}
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-slate-400">
                    {isHe ? 'ניהול תוכן' : 'Content Management'}
                </span>
                <button
                    onClick={() => logic.setViewMode(logic.viewMode === 'edit' ? 'preview' : 'edit')}
                    className="text-[10px] bg-slate-200 px-2 py-1 rounded hover:bg-slate-300 transition flex items-center gap-1"
                >
                    {logic.viewMode === 'edit' ? <Eye size={12}/> : <Code size={12}/>}
                    {logic.viewMode === 'edit' ? (isHe ? 'תצוגה' : 'Preview') : (isHe ? 'עריכה' : 'Edit')}
                </button>
            </div>

            {/* 3. CONTENT AREA */}
            <div className="grid grid-cols-2 gap-4">
                {['he', 'en'].map((lang) => (
                    <div key={lang}
                         className={`relative group ${isHe ? (lang === 'he' ? 'order-1' : 'order-2') : (lang === 'en' ? 'order-1' : 'order-2')}`}>
                        <button onClick={() => {
                            logic.setModalLang(lang);
                            logic.setIsModalOpen(true);
                        }}
                                className="absolute top-2 right-2 p-1 bg-white/80 rounded border opacity-0 group-hover:opacity-100 transition z-10">
                            <Maximize2 size={14}/>
                        </button>
                        {logic.viewMode === 'edit' ? (
                            <textarea
                                className="w-full border p-2 rounded h-32 font-mono text-xs bg-slate-900 text-green-400"
                                value={sub.content?.[lang] || ''}
                                onChange={(e) => logic.handleUpdateField('content', lang, e.target.value)}
                            />
                        ) : (
                            <div
                                className={`w-full border p-2 rounded h-32 overflow-y-auto bg-white text-xs ${lang === 'he' ? 'text-right' : 'text-left'}`}
                                dangerouslySetInnerHTML={{__html: sub.content?.[lang] || ''}}
                                dir={lang === 'he' ? 'rtl' : 'ltr'}/>
                        )}
                    </div>
                ))}
            </div>

            {/* 4. MEDIA MANAGEMENT */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
                {/* Images */}
                <div className="space-y-2">
                    <SectionLabel>{isHe ? 'תמונות' : 'Images'}</SectionLabel>
                    <input type="file" multiple accept="image/*"
                           onChange={(e) => handleFileUpload(e, menuId, sub.id, 'images')}
                           className="text-[10px] w-full"/>
                    <div className="flex gap-2 flex-wrap">
                        {sub.images?.map((img, i) => (
                            <div key={i} className="relative w-10 h-10 group">
                                <img src={img} className="w-full h-full object-cover rounded border" alt="p"/>
                                <button onClick={() => removeFile(menuId, sub.id, 'images', i)}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition">
                                    <Trash2 size={10}/></button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PDFs */}
                <div className="space-y-2">
                    <SectionLabel>{isHe ? 'קובצי PDF' : 'PDFs'}</SectionLabel>
                    <input type="file" multiple accept=".pdf"
                           onChange={(e) => handleFileUpload(e, menuId, sub.id, 'pdfs')}
                           className="text-[10px] w-full"/>
                    {sub.pdfs?.map((pdf, i) => (
                        <div key={i}
                             className="flex items-center justify-between bg-white border rounded p-1 text-[10px]">
                            <span className="truncate flex items-center gap-1"><FileText size={10}
                                                                                         className="text-red-500"/>{typeof pdf === 'string' ? pdf.split('/').pop() : pdf.name}</span>
                            <button onClick={() => removeFile(menuId, sub.id, 'pdfs', i)}
                                    className="text-red-500 hover:text-red-700 transition"><Trash2 size={12}/></button>
                        </div>
                    ))}
                </div>

                {/* Videos */}
                <div className="space-y-2">
                    <SectionLabel>{isHe ? 'סרטונים' : 'Videos'}</SectionLabel>
                    <input type="file" multiple accept="video/*"
                           onChange={(e) => handleFileUpload(e, menuId, sub.id, 'videos')}
                           className="text-[10px] w-full"/>
                    <div className="flex gap-2 flex-wrap">
                        {sub.videos?.map((vid, i) => (
                            <div key={i} className="relative w-10 h-10 group bg-black rounded border overflow-hidden">
                                <video src={vid} className="w-full h-full object-cover" muted
                                       onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()}/>
                                <button onClick={() => removeFile(menuId, sub.id, 'videos', i)}
                                        className="absolute top-0 right-0 bg-red-500 text-white p-0.5 opacity-0 group-hover:opacity-100 transition">
                                    <Trash2 size={10}/></button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* YouTube */}
                <div className="space-y-2">
                    <SectionLabel>{isHe ? 'יוטיוב' : 'YouTube'}</SectionLabel>
                    <div className="relative">
                        <input type="text" placeholder={isHe ? "הדבק לינק..." : "Paste link..."}
                               className="text-[10px] w-full border rounded p-2 pl-7 outline-none"
                               onKeyDown={(e) => {
                                   if (e.key === 'Enter' && e.target.value) {
                                       logic.updateSubMenu(menuId, sub.id, {youtubes: [...(sub.youtubes || []), e.target.value]});
                                       e.target.value = '';
                                   }
                               }}/>
                        <Link size={12} className="absolute left-2 top-2.5 text-slate-400"/>
                    </div>
                    {sub.youtubes?.map((link, i) => (
                        <div key={i}
                             className="flex items-center justify-between bg-red-50 border border-red-100 rounded p-1 text-[10px]">
                            <span className="truncate flex items-center gap-1 text-red-700"><Video
                                size={10}/>{link}</span>
                            <button
                                onClick={() => logic.updateSubMenu(menuId, sub.id, {youtubes: sub.youtubes.filter((_, idx) => idx !== i)})}
                                className="text-red-400"><Trash2 size={12}/></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 5. FULLSCREEN MODAL */}
            {logic.isModalOpen && (
                <div
                    className="fixed inset-0 z-[9999] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white w-full h-full rounded-2xl shadow-2xl flex flex-col overflow-hidden">

                        {/* MODAL HEADER */}
                        <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                            <div className="flex-1 flex items-center gap-3 min-w-0">
                                <div className="flex shrink-0 bg-slate-200 p-1 rounded-lg">
                                    {['he', 'en'].map(l => (
                                        <button key={l} onClick={() => logic.setModalLang(l)}
                                                className={`px-3 py-1 rounded-md text-xs font-bold transition ${logic.modalLang === l ? 'bg-white text-blue-600 shadow' : 'text-slate-500'}`}>{l.toUpperCase()}</button>
                                    ))}
                                </div>

                                <ActionButton onClick={logic.handleCopy} icon={logic.copied ? Check : Copy}
                                              label={isHe ? (logic.copied ? 'הועתק!' : 'העתק תוכן') : (logic.copied ? 'Copied!' : 'Copy Content')}/>

                                <a href="https://bestonlinehtmleditor.com/" target="_blank" rel="noopener noreferrer"
                                   className="shrink-0 flex items-center gap-2 text-[10px] px-3 py-1.5 rounded-md font-bold transition border bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100">
                                    <ExternalLink size={12}/> {isHe ? 'עורך HTML' : 'HTML Editor'}
                                </a>

                                {/* Gemini Button */}
                                <a href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer"
                                   className="shrink-0 flex items-center gap-2 text-[10px] px-3 py-1.5 rounded-md font-bold transition border bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100">
                                    <ExternalLink size={12}/> {isHe ? 'ג׳ימיני' : 'Gemini'}
                                </a>

                                {/* AI TOOLBOX */}
                                <div
                                    className="flex-1 flex items-center gap-2 bg-white p-1 rounded-md border border-slate-200 shadow-sm min-w-0">

                                    {/* Standard AI Action Button */}
                                    <ActionButton
                                        variant="ai"
                                        onClick={() => actions.handleAIGenerate(customRequest)}
                                        loading={actions.isGenerating}
                                        icon={Sparkles}
                                        label={isHe ? (actions.isGenerating ? '...' : 'ייצר AI') : (actions.isGenerating ? '...' : 'Generate AI')}
                                    />

                                    {/* NEW: Gemini AI Button */}
                                    <ActionButton
                                        variant="gemini" // Ensure your ActionButton component handles this variant or use custom className
                                        onClick={() => actions.handleGeminiGenerate(customRequest)}
                                        loading={actions.isGeminiGenerating}
                                        icon={Bot} // Import 'Bot' from lucide-react or use a custom SVG for the Gemini logo
                                        className="bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-700 hover:to-violet-700 border-none shadow-md"
                                        label={isHe ? (actions.isGeminiGenerating ? '...' : 'Gemini AI') : (actions.isGeminiGenerating ? '...' : 'Gemini AI')}
                                    />

                                    {actions.backupContent && (
                                        <button
                                            onClick={actions.handleRestore}
                                            className="flex items-center gap-1 text-[10px] px-2 py-1.5 rounded-md font-bold border border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100"
                                        >
                                            <RotateCcw size={12}/> {isHe ? 'ביטול' : 'Undo'}
                                        </button>
                                    )}

                                    <textarea
                                        value={customRequest}
                                        onChange={(e) => setCustomRequest(e.target.value)}
                                        dir={logic.modalLang === 'he' ? 'rtl' : 'ltr'}
                                        placeholder={isHe ? 'בקשה מותאמת אישית...' : 'Custom request...'}
                                        className="h-10 flex-1 text-sm p-2 bg-slate-50 border-none resize-none outline-none overflow-hidden"
                                        rows={1}
                                    />
                                </div>
                            </div>
                            <button onClick={() => logic.setIsModalOpen(false)}
                                    className="ml-4 p-2 text-slate-400 hover:text-red-500 transition"><X size={24}/>
                            </button>
                        </div>

                        {/* SPLIT SCREEN EDITOR */}
                        <div className="flex-1 flex overflow-hidden relative">
                            <div style={{width: `${logic.leftWidth}%`}}
                                 className="flex flex-col bg-slate-900 border-r border-slate-700">
                                <textarea
                                    className="flex-1 w-full p-6 font-mono text-base bg-slate-900 text-green-400 outline-none resize-none"
                                    value={sub.content?.[logic.modalLang] || ''}
                                    onChange={(e) => logic.handleUpdateField('content', logic.modalLang, e.target.value)}
                                    dir="ltr"/>
                            </div>
                            <div onMouseDown={logic.startResizing}
                                 className="w-1.5 h-full bg-slate-300 hover:bg-blue-500 cursor-col-resize flex items-center justify-center transition-colors">
                                <div className="bg-white border rounded-full p-1 shadow-sm"><GripVertical size={12}
                                                                                                          className="text-slate-400"/>
                                </div>
                            </div>
                            <div style={{width: `${100 - logic.leftWidth}%`}} className="flex flex-col bg-slate-50">
                                <div
                                    className={`flex-1 overflow-y-auto p-10 bg-white m-4 rounded-xl shadow-inner ${logic.modalLang === 'he' ? 'text-right' : 'text-left'}`}
                                    dir={logic.modalLang === 'he' ? 'rtl' : 'ltr'}
                                    dangerouslySetInnerHTML={{__html: sub.content?.[logic.modalLang] || ''}}/>
                            </div>
                        </div>

                        {/* MODAL FOOTER ACTIONS */}
                        <div className="p-4 border-t bg-slate-50 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*"
                                       onChange={(e) => actions.processFileToHtml(e.target.files[0], subMenuEditor_NewSrcHtml, sub.title?.[logic.modalLang] || 'image')}/>
                                <ActionButton
                                    onClick={() => {
                                        setLastClicked('image');
                                        fileInputRef.current?.click()
                                    }}
                                    loading={actions.isProcessingFile && lastClicked === 'image'}
                                    success={actions.statusMsg === 'success' && lastClicked === 'image'}
                                    icon={Upload}
                                    label={isHe ? 'תמונה ל-HTML' : 'Image to HTML'}
                                />

                                <input type="file" ref={pdfInputRef} className="hidden" accept=".pdf" onChange={(e) => {
                                    const text = prompt(isHe ? "טקסט לכפתור:" : "Button text:", "Download PDF");
                                    if (text) actions.processFileToHtml(e.target.files[0], subMenuEditor_NewPdfHtml, text);
                                }}/>
                                <ActionButton
                                    onClick={() => {
                                        setLastClicked('pdf');
                                        pdfInputRef.current?.click();
                                    }}
                                    loading={actions.isProcessingFile && lastClicked === 'pdf'}
                                    success={actions.statusMsg === 'success' && lastClicked === 'pdf'}
                                    icon={FileText}
                                    label={isHe ? 'PDF לכפתור' : 'PDF to Button'}
                                />

                                {/* JSON Viewer Button */}
                                <a href="https://json.onlineviewer.net/" target="_blank" rel="noopener noreferrer"
                                   className="shrink-0 flex items-center gap-2 text-[10px] px-3 py-1.5 rounded-md font-bold transition border bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100">
                                    <ExternalLink size={12}/> {isHe ? 'צופה JSON' : 'JSON Viewer'}
                                </a>

                            </div>
                            <button onClick={() => logic.setIsModalOpen(false)}
                                    className="bg-blue-600 text-white px-8 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-sm">
                                <CheckCircle2 size={18}/> {isHe ? 'סיום' : 'Close'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubMenuEditor;