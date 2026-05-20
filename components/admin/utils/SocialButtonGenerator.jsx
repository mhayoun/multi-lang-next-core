import React from 'react';

export const SocialButtonGenerator = ({
  type,            // 'fb' or 'ig'
  isHe,
  lastClicked,
  setLastClicked,
  isProcessing,
  successStatus,
  ActionButton,    // Pass your layout instance down
  icon: Icon
}) => {
  // Configuration lookup matrix to eliminate code duplication
  const config = {
    fb: {
      id: 'fb',
      bg: '#0866FF',
      urlPrompt: isHe ? "הכנס קישור לפייסבוק:" : "Enter Facebook URL:",
      defaultUrl: "https://www.facebook.com/reel/778211718240090",
      textPrompt: isHe ? "טקסט הכפתור:" : "Button text:",
      defaultText: isHe ? "צפו בפייסבוק" : "Watch on Facebook",
      label: isHe ? "קישור ל-Facebook" : "Link to Facebook",
      svg: `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      `
    },
    ig: {
      id: 'ig',
      bg: '#E1306C',
      urlPrompt: isHe ? "הכנס קישור לאינסטגרם:" : "Enter Instagram URL:",
      defaultUrl: "https://www.instagram.com/sup.sportunitespeople/",
      textPrompt: isHe ? "טקסט הכפתור:" : "Button text:",
      defaultText: isHe ? "עקבו אחרינו באינסטגרם" : "Follow us on Instagram",
      label: isHe ? "קישור ל-Instagram" : "Link to Instagram",
      svg: `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      `
    }
  }[type];

  const handleClick = () => {
    const url = prompt(config.urlPrompt, config.defaultUrl);
    if (!url) return;

    const btnText = prompt(config.textPrompt, config.defaultText);
    if (!btnText) return;

    const generatedHtml = `
      <div style="display: flex; justify-content: center; width: 100%; margin: 16px 0;">
          <a href="${url}" 
             target="_blank" 
             rel="noopener noreferrer" 
             style="display: inline-flex; align-items: center; gap: 8px; background-color: ${config.bg}; color: white; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: 500; font-family: system-ui, -apple-system, sans-serif; transition: transform 0.2s, opacity 0.2s;" 
             onmouseover="this.style.opacity='0.9'; this.style.transform='scale(1.02)';" 
             onmouseout="this.style.opacity='1'; this.style.transform='scale(1)';"
          >
              ${config.svg.trim()}
              <span>${btnText}</span>
          </a>
      </div>`.trim();

    navigator.clipboard.writeText(generatedHtml)
      .then(() => {
        setLastClicked(config.id);
        setTimeout(() => setLastClicked(null), 2000);
      })
      .catch(err => console.error("Clipboard Error:", err));
  };

  const isActive = lastClicked === config.id;

  return (
    <ActionButton
      onClick={handleClick}
      loading={isProcessing && isActive}
      success={(successStatus === 'success' && isActive) || isActive}
      icon={Icon}
      label={config.label}
    />
  );
};