import React from 'react';
import { Loader2, Check } from 'lucide-react';

export const SectionLabel = ({ children }) => (
    <label className="font-bold text-slate-400 block text-[10px] uppercase tracking-wider mb-2">
        {children}
    </label>
);

export const ActionButton = ({ onClick, loading, success, icon: Icon, label, variant = "default" }) => {
    const themes = {
        default: "bg-white text-slate-700 hover:bg-slate-100 border-slate-200",
        success: "bg-green-500 text-white border-transparent",
        ai: "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 border-transparent"
    };

    return (
        <button
            onClick={onClick}
            disabled={loading}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold transition border shadow-sm ${success ? themes.success : themes[variant]}`}
        >
            {loading ? <Loader2 size={12} className="animate-spin" /> : success ? <Check size={12} /> : <Icon size={12} />}
            {label}
        </button>
    );
};