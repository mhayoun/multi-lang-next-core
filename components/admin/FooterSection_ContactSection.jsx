import React from 'react';
import { MapPin, Mail, Phone, Bus, Printer } from 'lucide-react';

const ContactSection = ({ footer, lang, isHe, onChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                <label className="text-[10px] font-bold text-blue-600 uppercase px-1">{isHe ? 'כותרת המדור' : 'Section Title'}</label>
                <input className="w-full p-2 border border-blue-200 rounded-lg text-sm bg-white" value={footer.contact.title?.[lang] || ''} onChange={(e) => onChange('title', e.target.value, true)} />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">{isHe ? 'שם הארגון' : 'Company Name'}</label>
                <input className="w-full p-2 border border-slate-200 rounded-xl text-sm" value={footer.contact.cie_name?.[lang] || ''} onChange={(e) => onChange('cie_name', e.target.value, true)} />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">{isHe ? 'תיאור הארגון' : 'Company Description'}</label>
                <input className="w-full p-2 border border-slate-200 rounded-xl text-sm" value={footer.contact.cie_desc?.[lang] || ''} onChange={(e) => onChange('cie_desc', e.target.value, true)} />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><MapPin size={10} /> {isHe ? 'כתובת' : 'Address'}</label>
                <input className="w-full p-2 border border-slate-200 rounded-xl text-sm" value={footer.contact.address?.[lang] || ''} onChange={(e) => onChange('address', e.target.value, true)} />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Mail size={10} /> Email</label>
                <input className="w-full p-2 border border-slate-200 rounded-xl text-sm" value={footer.contact.email || ''} onChange={(e) => onChange('email', e.target.value)} />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Phone size={10} /> {isHe ? 'טלפון' : 'Phone'}</label>
                <input className="w-full p-2 border border-slate-200 rounded-xl text-sm" value={footer.contact.phone || ''} onChange={(e) => onChange('phone', e.target.value)} />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Printer size={10} /> {isHe ? 'פקס' : 'Fax'}</label>
                <input className="w-full p-2 border border-slate-200 rounded-xl text-sm" value={footer.contact.fax || ''} onChange={(e) => onChange('fax', e.target.value)} />
            </div>

            <div className="md:col-span-2 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Bus size={12} /> {footer.contact.transport.title[lang]}</label>
                <input className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white" placeholder={isHe ? 'קווי אוטובוס' : 'Bus lines'} value={footer.contact.transport.he || ''} onChange={(e) => onChange('transport', e.target.value)} />
            </div>
        </div>
    );
};

export default ContactSection;