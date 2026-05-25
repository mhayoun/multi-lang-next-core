import React, { useState } from 'react';
import { Clock, MapPin, ChevronDown, ChevronUp, LayoutGrid, Phone, Mail, Bus, Plus, Trash2, Link } from 'lucide-react';

const FooterSection = ({ logic, isHe }) => {
    const { t, menuData, footerData, lang, updateFooter } = logic;
    const [openIndex, setOpenIndex] = useState(0);

    // Initialisation avec la structure exacte demandée si vide
    const footer = footerData || {
        hours: { title: { he: 'שעות פעילות', en: 'Opening Hours' }, items: [] },
        contact: {
            title: { he: 'פרטי יצירת קשר', en: 'Contact Details' },
            address: { he: '', en: '' },
            email: '',
            phones: [],
            transport: { title: { he: 'תחבורה ציבורית', en: 'Public Transport' }, lines: '', he: '' },
            cie_name: { he: '', en: '' },
            cie_desc: { he: '', en: '' }
        }
    };

    const handleFooterChange = (index, field, value) => {
        const updatedFooter = JSON.parse(JSON.stringify(footer));
        if (field === 'label' || field === 'value') {
            if (!updatedFooter.hours.items[index][field]) updatedFooter.hours.items[index][field] = { he: '', en: '' };
            updatedFooter.hours.items[index][field][lang] = value;
        } else {
            updatedFooter.hours.items[index][field] = value;
        }
        updateFooter(updatedFooter);
    };

    const addItem = () => {
        const updatedFooter = JSON.parse(JSON.stringify(footer));
        if (!updatedFooter.hours.items) updatedFooter.hours.items = [];
        updatedFooter.hours.items.push({
            label: { he: '', en: '' },
            value: { he: '', en: '' },
            isLink: false,
            linkedSubItemId: ''
        });
        updateFooter(updatedFooter);
    };

    const removeItem = (index) => {
        const updatedFooter = JSON.parse(JSON.stringify(footer));
        updatedFooter.hours.items.splice(index, 1);
        updateFooter(updatedFooter);
    };

    const handleContactChange = (field, value, isMultilang = false) => {
        const updatedFooter = JSON.parse(JSON.stringify(footer));
        if (isMultilang) {
            if (!updatedFooter.contact[field]) updatedFooter.contact[field] = { he: '', en: '' };
            updatedFooter.contact[field][lang] = value;
        } else if (field === 'phone' || field === 'fax') {
            // Gestion des téléphones indexés (0: Office, 1: Fax)
            if (!updatedFooter.contact.phones) updatedFooter.contact.phones = [];
            const idx = field === 'phone' ? 0 : 1;
            const label = field === 'phone' ? { he: 'משרד', en: 'Office' } : { he: 'פקס', en: 'Fax' };
            updatedFooter.contact.phones[idx] = { label, number: value };
            // On garde aussi les champs à la racine pour la compatibilité avec votre JSON
            updatedFooter.contact[field] = value;
        } else if (field === 'transport') {
            updatedFooter.contact.transport.he = value; // Champ "he" spécifique dans votre transport
        } else {
            updatedFooter.contact[field] = value;
        }
        updateFooter(updatedFooter);
    };

    const AccordionItem = ({ index, title, icon: Icon, children, actions }) => (
        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white mb-4 shadow-sm">
            <div className="flex items-center justify-between bg-slate-50 pr-4">
                <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="flex-1 flex items-center justify-between p-4 hover:bg-slate-100 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg text-white shadow-sm">
                            <Icon size={18} />
                        </div>
                        <span className="font-bold text-slate-800">{title[lang] || title}</span>
                    </div>
                    {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {actions && <div className="px-4">{actions}</div>}
            </div>
            {openIndex === index && (
                <div className="p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    {children}
                </div>
            )}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-4 pb-10">

            {/* SECTION: HOURS & LINKS */}
            <AccordionItem
                index={0}
                title={footer.hours.title}
                icon={Clock}
                actions={
                    <button onClick={addItem} className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700">
                        <Plus size={14} /> {isHe ? 'הוסף' : 'Add'}
                    </button>
                }
            >
                <div className="grid grid-cols-1 gap-4">
                    {footer.hours.items?.map((item, idx) => (
                        <div key={idx} className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-3 relative group">
                            <button onClick={() => removeItem(idx)} className="absolute -top-2 -left-2 bg-red-100 text-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-red-200">
                                <Trash2 size={14} />
                            </button>

                            <div className="flex flex-col md:flex-row gap-3">
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase px-1">{isHe ? 'כותרת' : 'Label'}</label>
                                    <input
                                        className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-400"
                                        value={item.label?.[lang] || ''}
                                        onChange={(e) => handleFooterChange(idx, 'label', e.target.value)}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase px-1">{isHe ? 'תיאור' : 'Description'}</label>
                                    <input
                                        className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-400"
                                        value={item.value?.[lang] || ''}
                                        onChange={(e) => handleFooterChange(idx, 'value', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 px-1">
                                    <input
                                        type="checkbox"
                                        id={`link-${idx}`}
                                        checked={item.isLink || false}
                                        onChange={(e) => handleFooterChange(idx, 'isLink', e.target.checked)}
                                        className="rounded text-blue-600"
                                    />
                                    <label htmlFor={`link-${idx}`} className="text-[10px] font-bold text-slate-500 uppercase cursor-pointer flex items-center gap-1">
                                        <Link size={12} /> {isHe ? 'קשר לפריט בתפריט' : 'Link to Menu'}
                                    </label>
                                </div>

                                {item.isLink && (
                                    <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg border border-blue-100">
                                        <LayoutGrid size={14} className="text-blue-500" />
                                        <select
                                            className="bg-transparent text-xs outline-none w-full font-medium"
                                            value={item.linkedSubItemId || ""}
                                            onChange={(e) => handleFooterChange(idx, 'linkedSubItemId', e.target.value)}
                                        >
                                            <option value="">{isHe ? '-- בחר פריט --' : '-- Select Item --'}</option>
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
                        </div>
                    ))}
                </div>
            </AccordionItem>

            {/* SECTION: CONTACT DETAILS */}
            <AccordionItem index={1} title={footer.contact.title} icon={MapPin}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* CIE Name & Desc */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">{isHe ? 'שם הארגון' : 'Company Name'}</label>
                        <input className="w-full p-2 border border-slate-200 rounded-xl text-sm" value={footer.contact.cie_name?.[lang] || ''} onChange={(e) => handleContactChange('cie_name', e.target.value, true)} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">{isHe ? 'תיאור הארגון' : 'Company Description'}</label>
                        <input className="w-full p-2 border border-slate-200 rounded-xl text-sm" value={footer.contact.cie_desc?.[lang] || ''} onChange={(e) => handleContactChange('cie_desc', e.target.value, true)} />
                    </div>

                    {/* Address & Email */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><MapPin size={10} /> {isHe ? 'כתובת' : 'Address'}</label>
                        <input className="w-full p-2 border border-slate-200 rounded-xl text-sm" value={footer.contact.address?.[lang] || ''} onChange={(e) => handleContactChange('address', e.target.value, true)} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Mail size={10} /> Email</label>
                        <input className="w-full p-2 border border-slate-200 rounded-xl text-sm" value={footer.contact.email || ''} onChange={(e) => handleContactChange('email', e.target.value)} />
                    </div>

                    {/* Phones */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Phone size={10} /> {isHe ? 'טלפון משרד' : 'Office Phone'}</label>
                        <input className="w-full p-2 border border-slate-200 rounded-xl text-sm" value={footer.contact.phone || ''} onChange={(e) => handleContactChange('phone', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">{isHe ? 'פקס' : 'Fax'}</label>
                        <input className="w-full p-2 border border-slate-200 rounded-xl text-sm" value={footer.contact.fax || ''} onChange={(e) => handleContactChange('fax', e.target.value)} />
                    </div>

                    {/* Transport */}
                    <div className="md:col-span-2 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Bus size={12} /> {footer.contact.transport.title[lang]}</label>
                        <input
                            className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white"
                            placeholder={isHe ? 'קווי אוטובוס (למשל: 6, 17, 19)' : 'Bus lines (e.g. 6, 17, 19)'}
                            value={footer.contact.transport.he || ''}
                            onChange={(e) => handleContactChange('transport', e.target.value)}
                        />
                    </div>
                </div>
            </AccordionItem>
        </div>
    );
};

export default FooterSection;