import React from 'react';
import { ChevronLeft } from 'lucide-react';

const CardGrid = ({ menuData, setActiveSubItem, t, isHe }) => {
  const handleItemClick = (sub) => {
    setActiveSubItem(sub);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {menuData
        /* Filter: Only keep menu items that have at least one sub-item */
        .filter((menu) => menu.subItems && menu.subItems.length > 0)
        .map((menu) => (
          <div
            key={menu.id}
            className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-slate-100 transition-transform hover:-translate-y-1"
          >
            {/* Header Image Section */}
            <div className="h-40 relative">
              <img
                src={menu.bgImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa'}
                className="w-full h-full object-cover"
                alt=""
              />
              <div className="absolute inset-0 bg-black/20" />
              <h2 className="absolute bottom-4 right-6 left-6 text-white text-2xl font-black">
                {t(menu.title)}
              </h2>
            </div>

            {/* Buttons List Section */}
            <div className="p-4 space-y-2">
              {menu.subItems.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleItemClick(sub)}
                  className="w-full text-right px-5 py-3 rounded-2xl bg-slate-50 hover:bg-blue-600 hover:text-white transition-all flex justify-between items-center group font-bold text-slate-700"
                >
                  {t(sub.title)}
                  <ChevronLeft
                    size={16}
                    className={isHe ? '' : 'rotate-180'}
                  />
                </button>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default CardGrid;