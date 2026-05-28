import React from 'react';
import LogoSection from '@/components/admin/LogoSection';
import {Download, Upload, Database} from 'lucide-react'; // Added Upload icon

const SettingSection = ({
                            isHe,
                            exportData,
                            exportFullData,
                            importData,
                            importFullData,
                            logo,
                            setLogo,
                            updateLogo
                        }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Logo Management */}
            <div className="bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
                <LogoSection logo={logo} setLogo={setLogo} updateLogo={updateLogo} isHe={isHe}/>
            </div>

            {/* Backup, Export & Import */}
            <div className="flex flex-col bg-blue-50 p-6 rounded-3xl border border-blue-100 gap-6">
                <div>
                    <h2 className="text-blue-800 font-black text-xl">
                        {isHe ? 'ייצוא וייבוא' : 'Export & Import'}
                    </h2>
                    <p className="text-blue-600/80 text-sm font-medium mt-1">
                        {isHe
                            ? 'נהל את קבצי הנתונים של האתר (DEFAULT_MENU, DEFAULT_NEWS, DEFAULT_FOOTER)'
                            : 'Manage site data files (MENU, NEWS, FOOTER)'}
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    {/* Export Button */}
                    <button
                        onClick={exportData}
                        className="bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2 text-sm shadow-sm hover:shadow-md active:scale-95"
                    >
                        <Upload size={18}/>
                        <span>{isHe ? 'ייצוא נתונים' : 'Export Data'}</span>
                    </button>

                    {/* Import Button - Added this */}
                    <button
                        onClick={importData}
                        className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2 text-sm shadow-sm hover:shadow-md active:scale-95"
                    >
                        <Download size={18}/>
                        <span>{isHe ? 'ייבוא נתונים' : 'Import Data'}</span>
                    </button>
                </div>
            </div>

            {/* NEW: Full System Config (cie_config) */}
            <div className="flex flex-col bg-indigo-50 p-6 rounded-3xl border border-indigo-100 gap-6">
                <div>
                    <h2 className="text-indigo-800 font-black text-xl flex items-center gap-2">
                        <Database size={24}/>
                        {isHe ? `ייצוא וייבוא מערכת מלא` : `Full System Config Export & Import`}
                    </h2>
                    <p className="text-indigo-600/80 text-sm font-medium mt-1">
                        {isHe
                            ? 'ייצוא או ייבוא של כל מסד הנתונים בקובץ אחד (תפריט, חדשות, לוגו והגדרות)'
                            : 'Export or Import the entire database in a single file'}
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={exportFullData}
                        className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2 text-sm shadow-sm active:scale-95"
                    >
                        <Upload size={18}/>
                        <span>{isHe ? `ייצוא נתונים מלא` : `Export Full Data`}</span>
                    </button>

                    <button
                        onClick={importFullData}
                        className="bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2 text-sm shadow-sm active:scale-95"
                    >
                        <Download size={18}/>
                        <span>{isHe ? `ייבוא נתונים מלא` : `Import Full Data`}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingSection;
