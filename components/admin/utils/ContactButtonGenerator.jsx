import React from 'react';
import { Mail } from 'lucide-react';

// 1. The Helper logic placed directly inside the file
const generateContactHtml = (inputVal) => {
  if (typeof window === 'undefined') return '';

  const isHtml = /<[a-z][\s\S]*>/i.test(inputVal);

  // The raw JavaScript scroll string injection used inside the generated markup
  const scrollScript = "const target = document.getElementById('contactus'); if(target){ target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }";

  if (isHtml) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(inputVal, 'text/html');
      const anchor = doc.querySelector('a');

      // If the pasted HTML already has an anchor tag, remove href and append custom inline click logic
      if (anchor) {
        anchor.removeAttribute('href');
        anchor.setAttribute('onclick', scrollScript);
        anchor.style.cursor = 'pointer'; // Ensure pointer feedback remains
        return doc.body.innerHTML.trim();
      }
      return inputVal.trim();
    } catch (e) {
      console.error("HTML parsing failed, using raw input fallback", e);
      return inputVal.trim();
    }
  }

  // Default block for plain text strings generating a modern customized design template
  return `
    <div style="display: flex; justify-content: center; width: 100%; margin: 16px 0;">
        <button onclick="${scrollScript}" 
           style="display: inline-flex; align-items: center; gap: 8px; background-color: #334155; color: white; padding: 12px 24px; border-radius: 9999px; border: none; cursor: pointer; font-weight: 500; font-family: system-ui, -apple-system, sans-serif; transition: transform 0.2s, opacity 0.2s;" 
           onmouseover="this.style.opacity='0.9'; this.style.transform='scale(1.02)';" 
           onmouseout="this.style.opacity='1'; this.style.transform='scale(1)';"
           type="button"
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>${inputVal}</span>
        </button>
    </div>`.trim();
};

// 2. The Component that your toolbar reads
export const ContactButtonGenerator = ({
  isHe,
  lastClicked,
  setLastClicked,
  isProcessing,
  ActionButton
}) => {
  const handleClick = () => {
    const promptMessage = isHe
      ? "הזן טקסט לכפתור או הדבק קוד HTML מלא:"
      : "Enter button text or paste entire HTML code:";
    const defaultVal = isHe ? "צור קשר" : "Contact Us";

    const inputVal = prompt(promptMessage, defaultVal);
    if (!inputVal) return;

    const finalHtml = generateContactHtml(inputVal);

    navigator.clipboard.writeText(finalHtml)
      .then(() => {
        setLastClicked('contact');

        // Handles immediate local view scrolling down to your layout contact section instantly
        document.getElementById('contactus')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

        setTimeout(() => setLastClicked(null), 2000);
      })
      .catch(err => console.error("Clipboard Error:", err));
  };

  return (
    <ActionButton
      onClick={handleClick}
      loading={isProcessing && lastClicked === 'contact'}
      success={lastClicked === 'contact'}
      icon={Mail}
      label={isHe ? 'מחולל כפתור צור קשר' : 'Contact Us'}
    />
  );
};