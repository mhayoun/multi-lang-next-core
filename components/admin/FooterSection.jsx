import React, { useState } from 'react';
import { Clock, MapPin, ChevronDown, ChevronUp, LayoutGrid, Phone, Mail, Bus } from 'lucide-react';

const FooterSection = ({ logic, isHe }) => {
    const { t, menuData, footerData, lang, updateFooter } = logic;
    const [openIndex, setOpenIndex] = useState(0);

    // Deep clone helper to ensure state updates trigger correctly
    const safeUpdate = (newData) => {
        updateFooter(JSON.parse(JSON.stringify(newData)));
    };

    const footer = footerData || {
        hours: { items: [] },
        contact: { address: {}, email: '', phones: [], transport: {} }
    };

    const handleFooterChange = (index, field, value) => {
        const updatedFooter = JSON.parse(JSON.stringify(footer));
        if (field === 'label' || field === 'value') {
            updatedFooter.hours.items[index][field][lang] = value;
        } else {
            updatedFooter.hours.items[index][field] = value;
        }
        updateFooter(updatedFooter);
    };

    const handleContactChange = (field, value, subField = null) => {
        const updatedFooter = JSON.parse(JSON.stringify(footer));

        // Ensure contact exists
        if (!updatedFooter.contact) updatedFooter.contact = {};

        if (field === 'phone' || field === 'fax') {
            // Map to the phones array structure: 0 is Office, 1 is Fax
            if (!updatedFooter.contact.phones) updatedFooter.contact.phones = [];
            const idx = field === 'phone' ? 0 : 1;
            const label = field === 'phone' ? { he: 'משרד', en: 'Office' } : { he: 'פקס', en: 'Fax' };

            updatedFooter.contact.phones[idx] = {
                label: label,
                number: value
            };
        } else if (subField) {
            // Handles address or transport.lines
            if (!updatedFooter.contact[field]) updatedFooter.contact[field] = {};
            updatedFooter.contact[field][subField] = value;
        } else {
            // Handles email
            updatedFooter.contact[field] = value;
        }

        updateFooter(updatedFooter);
    };

    const AccordionItem = ({ index, title, icon: Icon, children }) => (
        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white mb-4 shadow-sm">
            <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg text-white">
                        <Icon size={18} />
                    </div>
                    <span className="font-bold text-slate-800">{title}</span>
                </div>
                {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {openIndex === index && (
                <div className="p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    {children}
                </div>
            )}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-500">

            {/* ITEM 1: Opening Hours */}
            <AccordionItem
                index={0}
                title={isHe ? 'שעות פעילות וקישורים' : 'Opening Hours & Links'}
                icon={Clock}
            >
                <div className="grid grid-cols-1 gap-4">
                    {footer.hours?.items.map((item, idx) => (
                        <div key={idx} className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-3">
                            <div className="flex flex-col md:flex-row gap-3">
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase px-1">
                                        {isHe ? 'כותרת' : 'Label'}
                                    </label>
                                    <input
                                        className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none"
                                        value={item.label[lang] || ''}
                                        onChange={(e) => handleFooterChange(idx, 'label', e.target.value)}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase px-1">
                                        {isHe ? 'פירוט שעות' : 'Hours'}
                                    </label>
                                    <input
                                        className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none"
                                        value={item.value[lang] || ''}
                                        onChange={(e) => handleFooterChange(idx, 'value', e.target.value)}
                                    />
                                </div>
                            </div>
                            {item.isLink && (
                                <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
                                    <LayoutGrid size={14} className="text-blue-500"/>
                                    <select
                                        className="bg-transparent text-xs outline-none w-full"
                                        value={item.linkedSubItemId || ""}
                                        onChange={(e) => handleFooterChange(idx, 'linkedSubItemId', e.target.value)}
                                    >
                                        <option value="">{isHe ? '-- בחר קישור --' : '-- Select Link --'}</option>
                                        {menuData.map(cat => (
                                            <optgroup key={cat.id} label={t(cat.title)}>
                                                {cat.subItems.map(sub => (
                                                    <option key={sub.id} value={sub.id}>{t(sub.title)}</option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </AccordionItem>

            {/* ITEM 2: Contact Details */}
            <AccordionItem
                index={1}
                title={isHe ? 'פרטי יצירת קשר' : 'Contact Details'}
                icon={MapPin}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                            <MapPin size={12}/> {isHe ? 'כתובת' : 'Address'}
                        </label>
                        <input
                            className="w-full p-2 border border-slate-200 rounded-xl text-sm outline-none"
                            value={footer.contact?.address?.[lang] || ''}
                            onChange={(e) => handleContactChange('address', e.target.value, lang)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                            <Mail size={12}/> Email
                        </label>
                        <input
                            className="w-full p-2 border border-slate-200 rounded-xl text-sm outline-none"
                            value={footer.contact?.email || ''}
                            onChange={(e) => handleContactChange('email', e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                            <Phone size={12}/> {isHe ? 'משרד' : 'Office Phone'}
                        </label>
                        <input
                            className="w-full p-2 border border-slate-200 rounded-xl text-sm outline-none"
                            value={footer.contact?.phones?.[0]?.number || ''}
                            onChange={(e) => handleContactChange('phone', e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                            {isHe ? 'פקס' : 'Fax'}
                        </label>
                        <input
                            className="w-full p-2 border border-slate-200 rounded-xl text-sm outline-none"
                            value={footer.contact?.phones?.[1]?.number || ''}
                            onChange={(e) => handleContactChange('fax', e.target.value)}
                        />
                    </div>

                    <div className="md:col-span-2 space-y-1">
                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                            <Bus size={12}/> {isHe ? 'תחבורה ציבורית' : 'Public Transport'}
                        </label>
                        <input
                            className="w-full p-2 border border-slate-200 rounded-xl text-sm outline-none"
                            value={footer.contact?.transport?.lines || ''}
                            onChange={(e) => handleContactChange('transport', e.target.value, 'lines')}
                        />
                    </div>
                </div>
            </AccordionItem>
        </div>
    );
};

export default FooterSection;