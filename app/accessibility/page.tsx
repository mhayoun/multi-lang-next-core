"use client";
import { useMenuManager } from '@/lib/useMenuManager';

export default function AccessibilityPage() {
    const { logic, mounted } = useMenuManager();

    // 1. Guard: Wait until the hook has initialized data from Cloud/Local
    if (!mounted || !logic) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-slate-500 animate-pulse">טוען נתונים...</div>
            </div>
        );
    }

    // 2. Destructure safely from the logic provided by the hook
    const { footerData, t } = logic;
    const contact = footerData?.contact || {};
    const accessibility = footerData?.accessibility || {};

    // UI Strings with restored Hebrew
    const ui = {
        title: { he: "הצהרת נגישות", en: "Accessibility Statement" },
        physicalHeading: { he: "הסדרי נגישות פיזיים", en: "Physical Accessibility" },
        serviceHeading: { he: "שירות לקוחות נגיש", en: "Accessible Customer Service" },
        websiteHeading: { he: "נגישות אתר האינטרנט", en: "Website Accessibility" },
        coordinatorHeading: { he: "פרטי רכז נגישות", en: "Accessibility Coordinator" },
        contactLabel: { he: "ליצירת קשר:", en: "Contact us:" },
        office: { he: "משרד", en: "Office" },
        fax: { he: "פקס", en: "Fax" },
        email: { he: "דוא\"ל", en: "Email" },
        name: { he: "שם", en: "Name" },
        phone: { he: "טלפון", en: "Phone" }
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

                    {/* Physical Accessibility */}
                    <section>
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">{t(ui.physicalHeading)}</h2>
                        <ul className="list-disc list-inside space-y-2 mr-4">
                            <li><strong>{t(ui.contactLabel)}</strong> {t(contact.address)}</li>
                            {accessibility?.hasAccessibleParking && (
                                <li>{t({ he: "קיימת חניית נכים מוסדרת בקרבת הכניסה.", en: "Accessible parking available near the entrance." })}</li>
                            )}
                            {accessibility?.hasAccessiblePool && (
                                <li>{t({ he: "קיימת גישה מונגשת ומעלון לבריכה.", en: "Accessible pool lift/ramp available." })}</li>
                            )}
                            <li>{t({ he: "קיימים תאי שירותים מונגשים במבנה.", en: "Accessible restrooms available in the building." })}</li>
                        </ul>
                    </section>

                    {/* Customer Service */}
                    <section>
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">{t(ui.serviceHeading)}</h2>
                        <p>
                            {t({
                                he: "צוות העובדים הודרך למתן שירות נגיש. ניתן לפנות אלינו לקבלת מידע בפורמטים נגישים.",
                                en: "Our staff is trained for accessible service. Contact us for information in accessible formats."
                            })}
                            <br/>
                            {t(ui.office)}: <span className="font-semibold">{contact.phones?.[0]?.number || contact.phone}</span>
                            {contact.fax && <> | {t(ui.fax)}: <span className="font-semibold">{contact.fax}</span></>}
                        </p>
                    </section>

                    {/* Website Accessibility */}
                    <section>
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">{t(ui.websiteHeading)}</h2>
                        <p>
                            {t({
                                he: "אתר זה עומד בדרישות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע\"ג-2013 ברמה AA.",
                                en: "This website meets the AA accessibility standards according to the Equal Rights for Persons with Disabilities regulations."
                            })}
                        </p>
                    </section>

                    {/* Accessibility Coordinator Section */}
                    <section>
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">{t(ui.coordinatorHeading)}</h2>
                        <p className="mb-4">{t({ he: "במידה ומצאתם תקלה או שיש לכם הצעה לשיפור:", en: "If you found an issue or have a suggestion for improvement:" })}</p>

                        <div className="bg-blue-50 p-6 rounded-lg border-r-4 border-blue-600 space-y-1">
                            <p><strong>{t(ui.name)}:</strong> {accessibility?.coordinatorName || t(contact.cie_name)}</p>
                            <p><strong>{t(ui.phone)}:</strong> {accessibility?.phone || contact.phones?.[0]?.number || contact.phone}</p>
                            <p><strong>{t(ui.email)}:</strong> {accessibility?.email || contact.email}</p>
                        </div>
                    </section>

                    <footer className="mt-10 pt-6 border-t border-slate-200 text-center font-medium text-blue-700">
                        {t({ he: "אנו מחויבים להמשך שיפור הנגישות!", en: "We are committed to improving accessibility!" })}
                    </footer>

                </div>
            </div>
        </main>
    );
}