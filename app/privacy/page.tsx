"use client";
import { useMenuManager } from '@/lib/useMenuManager';

export default function PrivacyPolicyPage() {
    const { logic, mounted } = useMenuManager();

    // Guard for hydration/loading
    if (!mounted || !logic) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-slate-500 animate-pulse">טוען נתונים...</div>
            </div>
        );
    }

    const { t, footerData } = logic;
    const contact = footerData?.contact || {};

    const ui = {
        title: { he: "מדיניות פרטיות", en: "Privacy Policy" },
        intro: {
            he: "אנו מכבדים את הפרטיות שלך ומחויבים להגן על המידע האישי שלך. מסמך זה מסביר אילו נתונים אנו אוספים, כיצד אנו משתמשים בהם ומהן הזכויות שלך לגבי המידע שלך.",
            en: "We respect your privacy and are committed to protecting your personal information. This document explains what data we collect, how we use it, and your rights regarding your information."
        },
        section1Title: { he: "1. איסוף מידע אישי", en: "1. Collection of Personal Information" },
        section1Desc: { he: "אנו עשויים לאסוף את סוגי המידע הבאים:", en: "We may collect the following types of information:" },
        infoPersonal: { he: "מידע אישי:", en: "Personal Info:" },
        infoPersonalDesc: { he: "שם, כתובת אימייל, וכל מידע אחר שאתה מוסר באופן יזום דרך טפסי יצירת קשר.", en: "Name, email, and any other info you provide via contact forms." },
        infoTechnical: { he: "מידע טכני:", en: "Technical Info:" },
        infoTechnicalDesc: { he: "כתובת IP, סוג דפדפן ונתוני סטטיסטיקה לגבי השימוש באתר.", en: "IP address, browser type, and site usage statistics." },
        section2Title: { he: "2. שימוש במידע", en: "2. Use of Information" },
        section2Desc: {
            he: "המידע נאסף לצורך שיפור חוויית המשתמש, יצירת קשר במקרה הצורך, וניתוח סטטיסטי (באופן אנונימי) לשיפור איכות האתר. המידע האישי שלך לא יימכר או יועבר לצדדים שלישיים ללא הסכמתך המפורשת.",
            en: "Information is collected to improve user experience, contact you if necessary, and for statistical analysis. Your personal info will not be sold to third parties."
        },
        section3Title: { he: "3. עוגיות (Cookies)", en: "3. Cookies" },
        section3Desc: {
            he: "האתר עושה שימוש בעוגיות לצורך תפעולו השוטף ושיפורו. באפשרותך לשנות את הגדרות הדפדפן שלך כדי למנוע שימוש בעוגיות, אך זה עלול לפגוע בחלק מהפונקציות באתר.",
            en: "The site uses cookies for ongoing operation. You can disable cookies in your browser settings, though this may affect site functionality."
        },
        section4Title: { he: "4. אבטחת מידע", en: "4. Data Security" },
        section4Desc: {
            he: "אנו מיישמים אמצעי הגנה וטכנולוגיות אבטחה מתקדמות כדי לשמור על המידע שלך, אולם אף אתר או שירות אינם מאובטחים ב-100%.",
            en: "We implement advanced security measures to protect your data, though no service is 100% secure."
        },
        section5Title: { he: "5. יצירת קשר", en: "5. Contact Us" },
        section5Desc: { he: "לכל שאלה בנושא מדיניות הפרטיות או עדכון נתוניך האישיים, ניתן לפנות אלינו:", en: "For questions regarding privacy or updating your data, please contact us:" },
        phoneLabel: { he: "טלפון:", en: "Phone:" },
        emailLabel: { he: "דוא\"ל:", en: "Email:" },
        updated: { he: "עדכון אחרון למדיניות הפרטיות:", en: "Last updated:" }
    };

    return (
        <main dir="rtl" className="min-h-screen bg-slate-50 py-10 px-4 text-right">
            <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded-xl border border-slate-200">

                <header className="mb-8 border-b-2 border-blue-600 pb-4">
                    <h1 className="text-3xl font-bold text-blue-700">
                        {t(ui.title)} - {t(contact.cie_name)}
                    </h1>
                </header>

                <div className="space-y-6 text-slate-700 leading-relaxed">

                    <section>
                        <p>{t(ui.intro)}</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">{t(ui.section1Title)}</h2>
                        <p className="mb-2">{t(ui.section1Desc)}</p>
                        <ul className="list-disc list-inside space-y-2 mr-4">
                            <li><strong>{t(ui.infoPersonal)}</strong> {t(ui.infoPersonalDesc)}</li>
                            <li><strong>{t(ui.infoTechnical)}</strong> {t(ui.infoTechnicalDesc)}</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">{t(ui.section2Title)}</h2>
                        <p>{t(ui.section2Desc)}</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">{t(ui.section3Title)}</h2>
                        <p>{t(ui.section3Desc)}</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">{t(ui.section4Title)}</h2>
                        <p>{t(ui.section4Desc)}</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">{t(ui.section5Title)}</h2>
                        <p className="mb-4">{t(ui.section5Desc)}</p>

                        <div className="bg-blue-50 p-6 rounded-lg border-r-4 border-blue-600 space-y-1">
                            <p><strong>{t(ui.phoneLabel)}</strong> {contact.phones?.[0]?.number || contact.phone}</p>
                            <p><strong>{t(ui.emailLabel)}</strong> {contact.email}</p>
                        </div>
                    </section>

                    <footer className="mt-10 pt-6 border-t border-slate-200 text-sm text-slate-500">
                        {t(ui.updated)} 30/04/2026
                    </footer>

                </div>
            </div>
        </main>
    );
}