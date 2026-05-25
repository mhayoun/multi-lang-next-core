import React from 'react';
import * as LucideIcons from 'lucide-react';

const SocialSection = ({ footer, isHe, lang, onChange }) => {
    // Fail-safe icon picker
    const SafeIcon = ({ name, size = 16, className = "" }) => {
        const IconComponent = LucideIcons[name] || LucideIcons[`${name}Icon`] || LucideIcons.Share2;
        return <IconComponent size={size} className={className} />;
    };

    const handleChange = (platform, value) => {
        onChange(platform, value);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Section Title */}
            <div className="md:col-span-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                <label className="text-[10px] font-bold text-blue-600 uppercase px-1">
                    {isHe ? 'כותרת המדור' : 'Section Title'}
                </label>
                <input
                    className="w-full p-2 border border-blue-200 rounded-lg text-sm bg-white"
                    value={footer.socials?.title?.[lang] || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                />
            </div>

            {/* Facebook */}
            <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <SafeIcon name="Facebook" size={12} /> Facebook URL
                </label>
                <input
                    className="w-full p-2 border border-slate-200 rounded-xl text-sm"
                    placeholder="https://facebook.com/..."
                    value={footer.socials?.facebook || ''}
                    onChange={(e) => handleChange('facebook', e.target.value)}
                />
            </div>

            {/* Instagram */}
            <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <SafeIcon name="Instagram" size={12} /> Instagram URL
                </label>
                <input
                    className="w-full p-2 border border-slate-200 rounded-xl text-sm"
                    placeholder="https://instagram.com/..."
                    value={footer.socials?.instagram || ''}
                    onChange={(e) => handleChange('instagram', e.target.value)}
                />
            </div>

            {/* Linkedin */}
            <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <SafeIcon name="Linkedin" size={12} /> LinkedIn URL
                </label>
                <input
                    className="w-full p-2 border border-slate-200 rounded-xl text-sm"
                    placeholder="https://linkedin.com/in/..."
                    value={footer.socials?.linkedin || ''}
                    onChange={(e) => handleChange('linkedin', e.target.value)}
                />
            </div>

            {/* WhatsApp */}
            <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <SafeIcon name="MessageCircle" size={12} /> WhatsApp (Phone/Link)
                </label>
                <input
                    className="w-full p-2 border border-slate-200 rounded-xl text-sm"
                    placeholder={isHe ? 'מספר טלפון או קישור' : 'Phone number or link'}
                    value={footer.socials?.whatsapp || ''}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                />
            </div>
        </div>
    );
};

export default SocialSection;