import React from 'react';
import { FaWhatsapp } from 'react-icons/fa6';

// Converts a local Israeli number (e.g. "050-1234567") to wa.me format ("972501234567")
const toWhatsAppNumber = (number) => {
    const digits = String(number || '').replace(/\D/g, '');
    if (!digits) return '';
    if (digits.startsWith('972')) return digits;
    if (digits.startsWith('0')) return `972${digits.slice(1)}`;
    return digits;
};

const WhatsAppButton = ({ phone, isHe = true }) => {
    const waNumber = toWhatsAppNumber(phone);
    if (!waNumber) return null;

    return (
        <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={isHe ? 'שלחו לנו הודעה בוואטסאפ' : 'Chat with us on WhatsApp'}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 hover:shadow-xl transition-transform"
        >
            <FaWhatsapp size={30} />
        </a>
    );
};

export default WhatsAppButton;
