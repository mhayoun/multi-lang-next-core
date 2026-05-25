import React, { useState } from 'react';
import Link from 'next/link';
import * as Lucide from 'lucide-react';
// Import specific brand icons from FontAwesome (part of react-icons)
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa6';

const Footer = ({ data, isHe = true, menuData = [], setActiveSubItem }) => {
    const [status, setStatus] = useState('idle');
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });

    if (!data) return null;

    const { hours, contact, form, bottomBar } = data;

    const handleFooterLinkClick = (linkedId) => {
        if (!linkedId || !setActiveSubItem) return;

        let targetItem = null;
        menuData.forEach(category => {
            const found = category.subItems.find(sub => String(sub.id) === String(linkedId));
            if (found) targetItem = found;
        });

        if (targetItem) {
            setActiveSubItem(targetItem);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const payload = {
                clientId: process.env.NEXT_PUBLIC_CLIENT_ID || 'unknown_site',
                ...formData,
                timestamp: new Date().toISOString()
            };

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', phone: '', email: '', message: '' });
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                throw new Error('Failed to send');
            }
        } catch (err) {
            console.error("Footer send error:", err);
            setStatus('idle');
            alert(isHe ? "שגיאה בשליחה, נסה שנית" : "Error sending, try again");
        }
    };

    // FIX: Updated SocialIcon helper to handle brands via react-icons
    const SocialIcon = ({ name }) => {
        const iconName = name.toLowerCase();
        if (iconName === 'facebook') return <FaFacebook size={20} />;
        if (iconName === 'instagram') return <FaInstagram size={20} />;
        if (iconName === 'linkedin') return <FaLinkedin size={20} />;
        if (iconName === 'whatsapp' || iconName === 'messagecircle') return <FaWhatsapp size={20} />;

        // Fallback for standard UI icons to Lucide
        const LucideIcon = Lucide[name] || Lucide.Share2;
        return <LucideIcon size={20} />;
    };

    const inputStyle = "w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all";

    return (
        <footer id='footer' className="bg-slate-950 text-white pt-16 pb-6 px-4 mt-20" dir={isHe ? "rtl" : "ltr"}>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

                {/* Section 1: Working Hours & Socials */}
                <div className="space-y-6">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Lucide.Clock className="text-blue-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold">{isHe ? hours?.title?.he : hours?.title?.en}</h3>
                        </div>
                        <div className="space-y-4 text-slate-400 text-sm">
                            {hours?.items?.map((item, idx) => (
                                <div key={idx} className="border-b border-slate-800 pb-2 last:border-0">
                                    <span className="block font-bold text-slate-200">
                                        {isHe ? item.label?.he : item.label?.en}
                                    </span>
                                    <span
                                        onClick={() => item.isLink ? handleFooterLinkClick(item.linkedSubItemId) : null}
                                        className={`${item.isLink ? 'text-blue-400 cursor-pointer hover:underline' : ''} inline-block mt-1`}
                                    >
                                        {isHe ? item.value?.he : item.value?.en}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {data.socials && (
                        <div className="pt-4 border-t border-slate-900">
                            <h4 className="text-xs font-bold uppercase text-slate-500 mb-4 tracking-wider">
                                {isHe ? data.socials.title?.he : data.socials.title?.en}
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                {data.socials.facebook && (
                                    <a href={data.socials.facebook} target="_blank" rel="noopener noreferrer"
                                        className="p-2.5 bg-slate-900 rounded-xl hover:bg-blue-600/20 hover:text-blue-400 transition-all border border-slate-800">
                                        <SocialIcon name="facebook" />
                                    </a>
                                )}
                                {data.socials.instagram && (
                                    <a href={data.socials.instagram} target="_blank" rel="noopener noreferrer"
                                        className="p-2.5 bg-slate-900 rounded-xl hover:bg-pink-600/20 hover:text-pink-400 transition-all border border-slate-800">
                                        <SocialIcon name="instagram" />
                                    </a>
                                )}
                                {data.socials.linkedin && (
                                    <a href={data.socials.linkedin} target="_blank" rel="noopener noreferrer"
                                        className="p-2.5 bg-slate-900 rounded-xl hover:bg-blue-700/20 hover:text-blue-500 transition-all border border-slate-800">
                                        <SocialIcon name="linkedin" />
                                    </a>
                                )}
                                {data.socials.whatsapp && (
                                    <a href={data.socials.whatsapp.startsWith('http') ? data.socials.whatsapp : `https://wa.me/${data.socials.whatsapp}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="p-2.5 bg-slate-900 rounded-xl hover:bg-green-600/20 hover:text-green-400 transition-all border border-slate-800">
                                        <SocialIcon name="whatsapp" />
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Section 2: Contact Details */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Lucide.MapPin className="text-blue-400" size={24} />
                        </div>
                        <h3 className="text-xl font-bold">{isHe ? contact?.title?.he : contact?.title?.en}</h3>
                    </div>
                    <div className="space-y-4 text-slate-400 text-sm">
                        <div className="mb-4">
                            <h4 className="text-white font-bold text-lg">
                                {isHe ? contact?.cie_name?.he : contact?.cie_name?.en}
                            </h4>
                            <p className="italic text-slate-500">
                                {isHe ? contact?.cie_desc?.he : contact?.cie_desc?.en}
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <Lucide.MapPin size={18} className="shrink-0 text-slate-500" />
                            <p>{isHe ? contact?.address?.he : contact?.address?.en}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Lucide.Mail size={18} className="shrink-0 text-slate-500" />
                            <a href={`mailto:${contact?.email}`} className="hover:text-white transition-colors">
                                {contact?.email}
                            </a>
                        </div>
                        {contact?.phones?.map((p, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <Lucide.Phone size={18} className="shrink-0 text-slate-500" />
                                <p>
                                    <span className="opacity-60">{isHe ? p.label?.he : p.label?.en}:</span> {p.number}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 3: Contact Form */}
                <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                    <h3 className="text-xl font-bold mb-6">{isHe ? form?.title?.he : form?.title?.en}</h3>
                    {status === 'success' ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                            <Lucide.CheckCircle size={48} className="text-green-500" />
                            <p className="font-bold">{isHe ? form?.successMessage?.he : form?.successMessage?.en}</p>
                        </div>
                    ) : (
                        <form id='contactus' onSubmit={handleSubmit} className="space-y-4">
                            <input
                                required
                                className={inputStyle}
                                placeholder={isHe ? form?.fields?.name?.he : form?.fields?.name?.en}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    required
                                    type="tel"
                                    className={inputStyle}
                                    placeholder={isHe ? form?.fields?.phone?.he : form?.fields?.phone?.en}
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                                <input
                                    required
                                    type="email"
                                    className={inputStyle}
                                    placeholder={isHe ? form?.fields?.email?.he : form?.fields?.email?.en}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <textarea
                                rows="3"
                                className={inputStyle}
                                placeholder={isHe ? form?.fields?.message?.he : form?.fields?.message?.en}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            ></textarea>
                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                {status === 'sending' ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Lucide.Send size={18} />
                                        <span>{isHe ? form?.fields?.submit?.he : form?.fields?.submit?.en}</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
                <p>© {new Date().getFullYear()} {isHe ? bottomBar?.copyright?.he : bottomBar?.copyright?.en}</p>
                <div className="flex gap-6">
                    <Link href="/accessibility" className="hover:text-slate-300 cursor-pointer transition-colors">
                        {isHe ? "הצהרת נגישות" : "Accessibility"}
                    </Link>
                    <Link href="/privacy" className="hover:text-slate-300 cursor-pointer transition-colors">
                        {isHe ? "מדיניות פרטיות" : "Privacy Policy"}
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;