import React from 'react';
import { LayoutGrid, Newspaper, Mail, Settings, PanelBottom } from 'lucide-react';

const AdminTabs = ({ activeTab, setActiveTab, isHe }) => {
    const tabs = [
        { id: 'menu', label: isHe ? 'תפריטים' : 'Menus', icon: LayoutGrid },
        { id: 'news', label: isHe ? 'חדשות' : 'News', icon: Newspaper },
        { id: 'messages', label: isHe ? 'הודעות' : 'Messages', icon: Mail },
        { id: 'footer', label: isHe ? 'פוטר' : 'Footer', icon: PanelBottom },
        { id: 'settings', label: isHe ? 'הגדרות' : 'Settings', icon: Settings }
    ];

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-100 p-2 rounded-[2.5rem] shadow-inner border border-slate-200">
            <nav className="flex gap-1 flex-wrap justify-center">
                {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`
                            flex items-center gap-2 px-6 py-3 rounded-[2rem] font-bold transition-all duration-200
                            ${activeTab === id
                                ? 'bg-white shadow-md text-blue-600 scale-105'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}
                        `}
                    >
                        <Icon size={18} />
                        {label}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default AdminTabs;