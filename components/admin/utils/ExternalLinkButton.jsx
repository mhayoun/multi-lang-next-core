import React from 'react';

export const ExternalLinkButton = ({ type, isHe, icon: Icon }) => {
  // Matrix dictionary keeping your layout beautifully clean
  const configs = {
    json: {
      url: "https://json.onlineviewer.net/",
      styles: "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100",
      label: isHe ? "צפיין JSON" : "JSON Viewer"
    },
    html: {
      url: "https://bestonlinehtmleditor.com/",
      styles: "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100",
      label: isHe ? "עורך HTML" : "HTML Editor"
    },
    gemini: {
      url: "https://gemini.google.com/",
      styles: "bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100",
      label: isHe ? "ג'ימיני" : "Gemini"
    }
  };

  const current = configs[type];
  if (!current) return null;

  return (
    <a
      href={current.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`shrink-0 flex items-center gap-2 text-[10px] px-3 py-1.5 rounded-md font-bold transition border ${current.styles}`}
    >
      {Icon && <Icon size={12} />}
      <span>{current.label}</span>
    </a>
  );
};