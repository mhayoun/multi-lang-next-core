// app/privacy/page.tsx

export default function PrivacyPolicyPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded-xl border border-slate-200">

        <header className="mb-8 border-b-2 border-blue-600 pb-4">
          <h1 className="text-3xl font-bold text-blue-700">
            מדיניות פרטיות
          </h1>
        </header>

        <div className="space-y-6 text-slate-700 leading-relaxed">

          <section>
            <p>
              אנו מכבדים את הפרטיות שלך ומחויבים להגן על המידע האישי שתשתף עמנו. מסמך זה מפרט את האופן בו אנו אוספים, משתמשים ושומרים על המידע שלך בעת הגלישה באתר.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">1. המידע שאנו אוספים</h2>
            <p className="mb-2">אנו עשויים לאסוף שני סוגי מידע:</p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li><strong>מידע אישי:</strong> שם, כתובת אימייל, או כל מידע אחר שאתה מספק מרצונך בטפסי יצירת קשר.</li>
              <li><strong>מידע טכני:</strong> כתובת IP, סוג דפדפן ונתוני גלישה סטטיסטיים לצורך שיפור האתר.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">2. השימוש במידע</h2>
            <p>
              המידע משמש למתן השירותים המבוקשים, שיפור חווית המשתמש, שליחת עדכונים (בכפוף להסכמתך) ושמירה על אבטחת האתר. איננו מוכרים או משתפים מידע אישי עם צדדים שלישיים למטרות שיווק.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">3. עוגיות (Cookies)</h2>
            <p>
              האתר עושה שימוש בעוגיות לצורך תפעולו השוטף. באפשרותך לבטל את השימוש בעוגיות דרך הגדרות הדפדפן שלך, אך הדבר עלול להשפיע על תפקוד חלקים מסוימים באתר.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">4. אבטחת מידע</h2>
            <p>
              אנו מיישמים אמצעי אבטחה טכנולוגיים מקובלים להגנה על המידע מפני גישה בלתי מורשית, אולם יש לזכור כי אף מערכת אינה חסינה לחלוטין.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">5. יצירת קשר</h2>
            <p className="mb-4">בכל שאלה בנושא פרטיות או לבקשת עיון ומחיקת מידע, ניתן לפנות אלינו:</p>

            <div className="bg-blue-50 p-6 rounded-lg border-r-4 border-blue-600 space-y-1">
              <p><strong>טלפון:</strong> 054-5665417</p>
              <p><strong>דוא"ל:</strong> yelotag@gmail.com</p>
            </div>
          </section>

          <footer className="mt-10 pt-6 border-t border-slate-200 text-sm text-slate-500">
            עדכון אחרון למדיניות הפרטיות: 30/04/2026
          </footer>

        </div>
      </div>
    </main>
  );
}