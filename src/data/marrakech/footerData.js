export const DEFAULT_FOOTER = {
    // 1. Working Hours Section
    hours: {
        title: {
            he: "שעות פעילות",
            en: "Opening Hours"
        },
        items: [
            {
                label: {he: "שירות לקוחות", en: "Customer Service"},
                value: {he: "א'-ה', 09:00-18:00", en: "Sun-Thu, 09:00-18:00"}
            },
            {
                label: {he: "תמיכה טכנית", en: "Technical Support"},
                value: {he: "א'-ה', 08:00-17:00", en: "Sun-Thu, 08:00-17:00"}
            }
        ]
    },

    // 2. Contact Details Section
    contact: {
        title: {
            he: "פרטי התקשרות",
            en: "Contact Details"
        },
        cie_name: {
            he: "שם החברה",
            en: "Company Name"
        },
        cie_desc: {
            he: "תיאור קצר של פעילות החברה כאן",
            en: "A brief description of company activities here"
        },
        address: {
            he: "רחוב דוגמה 1, עיר 12345",
            en: "1 Example St., City 12345"
        },
        email: "contact@example.com",
        phones: [
            {label: {he: "משרד", en: "Office"}, number: "00-0000000"},
            {label: {he: "פקס", en: "Fax"}, number: "00-0000000"}
        ],
        transport: {
            title: {he: "דרכי הגעה", en: "Directions"},
            lines: ""
        }
    },

    // 3. Contact Form Texts
    form: {
        title: {he: "צור קשר", en: "Contact Us"},
        fields: {
            name: {he: "שם מלא *", en: "Full Name *"},
            phone: {he: "טלפון *", en: "Phone *"},
            email: {he: "אימייל *", en: "E-mail *"},
            message: {he: "הודעה", en: "Message"},
            submit: {he: "שלח הודעה", en: "Send Message"}
        },
        successMessage: {
            he: "ההודעה נשלחה בהצלחה!",
            en: "Message sent successfully!"
        }
    },

    // 4. Legal / Bottom Bar
    bottomBar: {
        copyright: {
            he: "כל הזכויות שמורות לשם החברה.",
            en: "All rights reserved to Company Name."
        }
    }
};