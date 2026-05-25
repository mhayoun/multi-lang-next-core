import React, {useState} from 'react';
import {Clock, MapPin, Plus, Share2} from 'lucide-react';
import {AccordionItem} from "@/components/admin/FooterSectionUI";
import HoursSection from "@/components/admin/FooterSection_HoursSection";
import ContactSection from "@/components/admin/FooterSection_ContactSection";
import SocialSection from "@/components/admin/FooterSection_SocialSection";

const FooterSection = ({logic, isHe}) => {
    const {t, menuData, footerData, lang, updateFooter} = logic;
    const [openIndex, setOpenIndex] = useState(0);

    const footer = footerData || {
        hours: {title: {he: 'שעות פעילות', en: 'Opening Hours'}, items: []},
        contact: {
            title: {he: 'פרטי יצירת קשר', en: 'Contact Details'},
            address: {he: '', en: ''}, email: '', phones: [],
            transport: {title: {he: 'תחבורה ציבורית', en: 'Public Transport'}, lines: '', he: ''},
            cie_name: {he: '', en: ''}, cie_desc: {he: '', en: ''}
        },
        socials: {
            title: {he: 'רשתות חברתיות', en: 'Social Media'},
            facebook: '',
            instagram: '',
            linkedin: '',
            whatsapp: ''
        }
    };

    const handleUpdate = (updater) => {
        const updated = JSON.parse(JSON.stringify(footer));
        updater(updated);
        updateFooter(updated);
    };

    const handleHoursChange = (index, field, value) => {
        handleUpdate((f) => {
            if (['label', 'value'].includes(field)) {
                if (!f.hours.items[index][field]) f.hours.items[index][field] = {he: '', en: ''};
                f.hours.items[index][field][lang] = value;
            } else f.hours.items[index][field] = value;
        });
    };

    const handleContactChange = (field, value, isMultilang = false) => {
        handleUpdate((f) => {
            if (isMultilang) {
                if (!f.contact[field]) f.contact[field] = {he: '', en: ''};
                f.contact[field][lang] = value;
            } else if (field === 'phone' || field === 'fax') {
                const idx = field === 'phone' ? 0 : 1;
                f.contact.phones[idx] = {number: value};
                f.contact[field] = value;
            } else if (field === 'transport') f.contact.transport.he = value;
            else if (field === 'title') f.contact.title[lang] = value;
            else f.contact[field] = value;
        });
    };

    const handleSocialChange = (platform, value) => {
        const updatedFooter = JSON.parse(JSON.stringify(footer));
        if (!updatedFooter.socials) {
            updatedFooter.socials = {title: {he: 'רשתות חברתיות', en: 'Social Media'}};
        }
        updatedFooter.socials[platform] = value;
        updateFooter(updatedFooter);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-4 pb-10">
            <AccordionItem
                index={0} title={footer.hours.title} icon={Clock} lang={lang}
                isOpen={openIndex === 0} setOpenIndex={setOpenIndex}
            >
                <HoursSection
                    footer={footer} lang={lang} isHe={isHe} menuData={menuData} t={t}
                    onTitleChange={(sec, val) => handleUpdate(f => f[sec].title[lang] = val)}
                    onItemChange={handleHoursChange}
                    onAdd={() => handleUpdate(f => f.hours.items.push({
                        label: {he: '', en: ''},
                        value: {he: '', en: ''},
                        isLink: false
                    }))}
                    onRemove={(idx) => handleUpdate(f => f.hours.items.splice(idx, 1))}
                    onMove={(idx, dir) => handleUpdate(f => {
                        const newIdx = dir === 'up' ? idx - 1 : idx + 1;
                        [f.hours.items[idx], f.hours.items[newIdx]] = [f.hours.items[newIdx], f.hours.items[idx]];
                    })}
                />
            </AccordionItem>

            <AccordionItem index={1} title={footer.contact.title} icon={MapPin} lang={lang} isOpen={openIndex === 1}
                           setOpenIndex={setOpenIndex}>
                <ContactSection footer={footer} lang={lang} isHe={isHe} onChange={handleContactChange}/>
            </AccordionItem>

            <AccordionItem
                index={2}
                title={footer.socials?.title || {he: 'רשתות חברתיות', en: 'Social Media'}}
                icon={Share2}
                lang={lang}
                isOpen={openIndex === 2}
                setOpenIndex={setOpenIndex}
            >
                <SocialSection
                    footer={footer}
                    isHe={isHe}
                    lang={lang}
                    onChange={(field, value) => {
                        handleUpdate(f => {
                            if (!f.socials) f.socials = {title: {he: '', en: ''}};
                            if (field === 'title') {
                                f.socials.title[lang] = value;
                            } else {
                                f.socials[field] = value;
                            }
                        });
                    }}
                />
            </AccordionItem>
        </div>
    );
};

export default FooterSection;