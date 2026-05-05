import React from 'react';
import { Upload, Trash2 } from 'lucide-react';

const LogoSection = ({ logo, setLogo, updateLogo, isHe }) => {
  return (
    <section className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
      <h3 className="text-lg font-black text-slate-800">
        {isHe ? 'ניהול לוגו' : 'Logo Management'}
      </h3>
      <div className="flex items-center gap-4">
        {logo && (
          <div className="relative group">
            <img
              src={logo}
              alt="Logo"
              className="h-12 w-24 object-contain border rounded-xl p-1 bg-slate-50"
            />
            <button
              onClick={() => setLogo(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-transform hover:scale-110"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
        <label className="cursor-pointer bg-blue-50 text-blue-600 px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-100 transition text-sm">
          <Upload size={16} />
          <span>{isHe ? 'בחר קובץ לוגו' : 'Select Logo'}</span>
          <input
            type="file"
            accept="image/*"
            onChange={updateLogo}
            className="hidden"
          />
        </label>
      </div>
    </section>
  );
};

export default LogoSection;