import React from 'react';
import {useSession} from "next-auth/react";
import DetailView from '@/components/user/DetailView';
import HomeNewsSlider from '@/components/user/HomeNewsSlider';
import CardGrid from '@/components/user/CardGrid';
import ContactForm from '@/components/ContactForm'; // 1. Import the form

const UserInterface = ({logic, uiText}) => {
    const {activeSubItem, setActiveSubItem, menuData, newsData, t, lang} = logic;
    const isHe = lang === 'he';

    if (activeSubItem) {
        // 2. Intercept the "contact" type here
        if (activeSubItem.type === 'contact') {
            return (
                <div className="max-w-4xl mx-auto py-12 px-4">
                    {/* Header for the page version of the form */}
                    <button
                        onClick={() => setActiveSubItem(null)}
                        className="mb-8 text-blue-600 font-bold flex items-center gap-2 hover:underline"
                    >
                        {isHe ? '← חזרה' : '← Back'}
                    </button>

                    <ContactForm isHe={isHe} isFooter={false}/>
                </div>
            );
        }

        // Standard DetailView for everything else
        return (
            <DetailView
                activeSubItem={activeSubItem}
                setActiveSubItem={setActiveSubItem}
                menuData={menuData}
                t={t}
                isHe={isHe}
                uiText={uiText}
            />
        );
    }

    // Define the click handler using the 'logic' object provided by your state manager
    const handleSubItemClick = (sub) => {
        if (!sub) return;

        // 1. Set the active content
        logic.setActiveSubItem(sub);

        // 2. Ensure we are in user view
        logic.setView('user');

        // 3. Smooth scroll to top so the user sees the new content
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="space-y-12" dir={isHe ? 'rtl' : 'ltr'}>
            <HomeNewsSlider
                newsData={newsData}
                menuData={menuData}
                handleSubItemClick={handleSubItemClick}
                setActiveSubItem={setActiveSubItem}
                t={t}
                isHe={isHe}
            />
            <CardGrid
                menuData={menuData}
                setActiveSubItem={setActiveSubItem}
                t={t}
                isHe={isHe}
            />
        </div>
    );
};

export default UserInterface;