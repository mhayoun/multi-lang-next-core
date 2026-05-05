import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

const ContactForm = ({ isFooter = false, isHe = true }) => {
    // 1. Define the missing status state
    const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        // Use standard object from state or FormData
        const data = {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            message: formData.message,
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', phone: '', email: '', message: '' });
                e.target.reset();
                // Reset to idle after 5 seconds
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
            }
        } catch (err) {
            console.error("Submission error:", err);
            setStatus('error');
        }
    };

    const inputClass = `w-full p-3 rounded-lg border outline-none transition-all ${
        isFooter
            ? 'bg-slate-800 border-slate-700 text-white focus:ring-blue-400 placeholder-slate-400'
            : 'bg-white border-slate-200 text-slate-800 focus:ring-blue-500 placeholder-slate-500'
    } focus:ring-2`;

    return (
        <div className={`w-full ${isFooter ? 'bg-transparent' : 'bg-white p-6 rounded-3xl shadow-sm'}`}>
            <h3 className={`text-xl font-bold mb-6 ${isFooter ? 'text-white' : 'text-slate-800'}`}>
                {isHe ? 'יצירת קשר' : 'Contact Us'}
            </h3>

            {status === 'success' ? (
                <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                    <CheckCircle2 size={20} />
                    <span className="font-bold">{isHe ? 'הודעה נשלחה בהצלחה!' : 'Message sent successfully!'}</span>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            name="name"
                            type="text"
                            placeholder={isHe ? "שם מלא *" : "Full Name *"}
                            className={inputClass}
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            name="phone"
                            type="tel"
                            placeholder={isHe ? "טלפון *" : "Phone *"}
                            className={inputClass}
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <input
                            name="email"
                            type="email"
                            placeholder={isHe ? "אימייל *" : "E-mail *"}
                            className={inputClass}
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <textarea
                            name="message"
                            placeholder={isHe ? "הודעה" : "Message"}
                            rows="3"
                            className={inputClass}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        ></textarea>
                    </div>

                    {status === 'error' && (
                        <div className="text-red-500 text-sm flex items-center gap-2">
                            <AlertCircle size={14} />
                            {isHe ? 'שגיאה בשליחה. נסה שוב.' : 'Error sending. Try again.'}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={status === 'sending'}
                        className={`w-full ${status === 'sending' ? 'bg-slate-500' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95`}
                    >
                        <Send size={18} className={status === 'sending' ? 'animate-pulse' : ''} />
                        {status === 'sending'
                            ? (isHe ? 'שולח...' : 'Sending...')
                            : (isHe ? 'שלח הודעה' : 'Send Message')}
                    </button>
                </form>
            )}
        </div>
    );
};

export default ContactForm;