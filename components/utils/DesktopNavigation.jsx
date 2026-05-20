import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * DesktopNavigation component
 * Separates navigation markup into a dedicated, clean file.
 *
 * Props:
 * - menuData: The array of menu items from your business logic
 * - translate: The translation function (e.g., logic.t)
 * - onSubItemClick: The click handler callback function for standard sub-items
 */
export const DesktopNavigation = ({ menuData, translate, onSubItemClick }) => {
  return (
    <div className="hidden md:flex gap-1 h-14 items-center ml-2">
      {menuData?.map((menu) => {
        const hasSubItems = menu.subItems && menu.subItems.length > 0;
        const isSingleItem = menu.subItems && menu.subItems.length === 1;
        const isContact = menu.type === 'contact';

        const handleMainMenuClick = () => {
          if (isContact) {
            document.getElementById('contactus')?.scrollIntoView({ behavior: 'smooth' });
          } else if (isSingleItem) {
            onSubItemClick(menu.subItems[0]);
          }
        };

        return (
          <div key={menu.id} className="relative group h-full flex items-center">
            <button
              onClick={handleMainMenuClick}
              className={`px-3 py-1.5 rounded-md text-[12px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 hover:scale-105 ${
                isSingleItem || isContact
                  ? 'hover:text-blue-600 hover:font-black hover:bg-slate-50 cursor-pointer'
                  : 'text-slate-600 cursor-default group-hover:font-black group-hover:text-slate-900'
              }`}
            >
              {translate(menu.title)}

              {hasSubItems && !isSingleItem && !isContact && (
                <ChevronDown
                  size={12}
                  className="text-slate-400 group-hover:text-blue-600 transition-transform group-hover:rotate-180"
                />
              )}
            </button>

            {/* Dropdown container */}
            {hasSubItems && !isSingleItem && !isContact && (
              <div className="absolute top-full ltr:left-0 rtl:right-0 mt-0 hidden group-hover:block pt-2 z-[60]">
                <div className="bg-white shadow-xl border border-slate-100 rounded-xl p-1.5 min-w-[180px] animate-in fade-in zoom-in-95 duration-150">
                  {menu.subItems.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => onSubItemClick(sub)}
                      className="w-full text-start px-3 py-2 hover:bg-blue-50 hover:text-blue-700 hover:font-black rounded-lg text-[12px] font-bold transition-all"
                    >
                      {translate(sub.title)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};