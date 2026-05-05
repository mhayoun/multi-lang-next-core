import React from 'react';
import { ArrowUp, ArrowDown, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

const EditorAccordionItem = ({
    children,
    id,
    index,
    totalItems,
    isOpen,
    onToggle,
    onRemove,
    onMove,
    icon: Icon,
    titleInputs,
}) => (
    <div className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:border-slate-300 transition-colors">
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b flex items-center gap-3">
            <div className="flex flex-col gap-1">
                <button
                    disabled={index === 0}
                    onClick={() => onMove(index, index - 1)}
                    className="p-1 hover:bg-white rounded border disabled:opacity-30 text-slate-500"
                >
                    <ArrowUp size={14} />
                </button>
                <button
                    disabled={index === totalItems - 1}
                    onClick={() => onMove(index, index + 1)}
                    className="p-1 hover:bg-white rounded border disabled:opacity-30 text-slate-500"
                >
                    <ArrowDown size={14} />
                </button>
            </div>

            {Icon && <Icon className="text-blue-500 shrink-0" size={20} />}

            <div className="flex-1 grid grid-cols-2 gap-2">
                {titleInputs}
            </div>

            <div className="flex items-center gap-2">
                <button onClick={() => onRemove(id)} className="text-red-400 hover:text-red-600 p-2">
                    <Trash2 size={18} />
                </button>
                <button onClick={() => onToggle(id)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>
        </div>

        {/* Content */}
        {isOpen && (
            <div className="p-6 space-y-6 animate-in slide-in-from-top-2 duration-200">
                {children}
            </div>
        )}
    </div>
);

export default EditorAccordionItem;