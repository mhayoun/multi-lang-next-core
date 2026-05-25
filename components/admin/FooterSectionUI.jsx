import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const AccordionItem = ({ index, title, icon: Icon, children, actions, isOpen, setOpenIndex, lang }) => (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white mb-4 shadow-sm">
        <div className="flex items-center justify-between bg-slate-50 pr-4">
            <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex-1 flex items-center justify-between p-4 hover:bg-slate-100 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg text-white shadow-sm">
                        <Icon size={18} />
                    </div>
                    <span className="font-bold text-slate-800">
                        {typeof title === 'object' ? title[lang] : title}
                    </span>
                </div>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {actions && <div className="px-4">{actions}</div>}
        </div>
        {isOpen && (
            <div className="p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                {children}
            </div>
        )}
    </div>
);