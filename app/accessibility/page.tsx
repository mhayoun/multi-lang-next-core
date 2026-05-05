// app/accessibility/page.tsx

export default function AccessibilityPage() {
    return (
        <main dir="rtl" className="min-h-screen bg-slate-50 py-10 px-4 text-right">
            <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded-xl border border-slate-200">

                <header className="mb-8 border-b-2 border-blue-600 pb-4">
                    <h1 className="text-3xl font-bold text-blue-700">
                        הצהרת נגישות
                    </h1>
                </header>

                <div className="space-y-6 text-slate-700 leading-relaxed">

                    {/* חנייה ורמפה */}
                    <section>
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">חנייה ודרכי גישה</h2>
                        <ul className="list-disc list-inside space-y-2 mr-4">
                            <li><strong>חנייה:</strong> בחניית המרכז 3 חניות נכים: 2 לרכב רגיל ולמשתמשים בכיסאות גלגלים
                                ו-1 לרכב גבוה.
                            </li>
                            <li><strong>רמפה:</strong> מחניית הנכים לכניסה לקומת הקרקע קיימת רמפה בשיפוע של 7%, רוחב 1.3
                                מטר, מאחז יד בקוטר 30-40 ס"מ, בגובה 90-95 ס"מ.
                            </li>
                            <li>מהרמפה לקומת הכניסה התחתונה כ-20 מטר בשבילים מונגשים.</li>
                        </ul>
                    </section>

                    {/* קומת קרקע */}
                    <section>
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">קומת הקרקע</h2>
                        <p>
                            מונגשת לאולם הספורט, חדר אומנויות לחימה וסטודיו "מועדון החבר". הכניסה ללובי הקומה מדלת ברוחב
                            מטר.
                            <br/>
                            אם דלת הכניסה סגורה, ניתן לצלצל לעמדת השומר באינטרקום מונגש שבצמוד ולימין הדלת, או
                            בטלפון: <span className="font-semibold">02-6494114</span> או למזכירות: <span
                            className="font-semibold">02-6494122</span>.
                        </p>
                    </section>

                    {/* קומה ראשונה */}
                    <section>
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">קומה ראשונה</h2>
                        <p>
                            מונגשת לחדרי הסטודיו: מחולה A, B, רזים, סטודיו תיאטרון מחול, כיתה, מזכירות, לובי ומזנון.
                            <br/>
                            הכניסה מהחנייה שבגב הבניין לרמפה קטנה וכניסה מדלת חירום ברוחב מטר.
                            במידת כל צורך שעולה / אם דלת הכניסה סגורה, ניתן לצלצל לעמדת השומר בטלפון: <span
                            className="font-semibold">02-6494114</span> או למזכירות: <span
                            className="font-semibold">02-6494122</span> או לרכזת הנגישות.
                        </p>
                    </section>

                    {/* שירותים ובריכה */}
                    <section>
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">שירותים ומתקנים נוספים</h2>
                        <ul className="list-disc list-inside space-y-2 mr-4">
                            <li><strong>שירותים מונגשים:</strong> בקומת הקרקע מהכניסה ללובי - ישר וימינה. בקומת המזכירות
                                – מהלובי למסדרון בו שירותים מונגשים בצד שמאל (תא מותאם בשירותי נשים ותא מותאם בשירותי
                                גברים).
                            </li>
                            <li><strong>נגישות לכבדי שמיעה:</strong> במרכז מערכות שמע הנמצאות בעמדת השומר ובמזכירות
                                המרכז.
                            </li>
                            <li><strong>בריכה:</strong> קיים כיסא הורדה והרמה מהמים לנכים - לשימוש יש לפנות למציל.</li>
                            <li><strong>ריהוט:</strong> קיימים מושבים נגישים ומתקן מים קרים מונגש.</li>
                        </ul>
                    </section>

                    {/* הכשרת עובדים */}
                    <section>
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">הכשרת עובדים</h2>
                        <p>
                            צוות עובדי המרכז השתתפו בהכשרה מקצועית בנושא נגישות השירות ובכלל.
                        </p>
                    </section>

                    {/* רכזת נגישות */}
                    <section>
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">רכזת נגישות</h2>
                        <p className="mb-4">בכל שאלה או בקשה, ניתן לפנות לרכזת הנגישות:</p>

                        <div className="bg-blue-50 p-6 rounded-lg border-r-4 border-blue-600 space-y-1">
                            <p><strong>שם:</strong> גב' סימה כהן</p>
                            <p><strong>טלפון:</strong> 02-6494103</p>
                            <p><strong>נייד:</strong> 052-8960777</p>
                            <p><strong>מייל:</strong> sima19169@gmail.com</p>
                        </div>
                    </section>

                    <footer className="mt-10 pt-6 border-t border-slate-200 text-center font-medium text-blue-700">
                        נשמח לראותכם!
                    </footer>

                </div>
            </div>
        </main>
    );
}