export const DEFAULT_FOOTER = {
  // 1. Working Hours Section
  hours: {
    title: {
      he: "שעות פעילות",
      en: "Opening Hours"
    },
    items: [
      {
        label: { he: "מרכז מידע ורישום", en: "Information & Registration" },
        value: { he: "א׳-ה׳, 8:00-19:00", en: "Sun-Thu, 8:00-19:00" }
      },
      {
        label: { he: "בריכה", en: "Swimming Pool" },
        value: { he: "פירוט הפעילות בבריכה", en: "See pool schedule" },
        isLink: true
      },
      {
        label: { he: "חדר כושר", en: "Gym" },
        value: { he: "פירוט הפעילות בחדר הכושר", en: "See gym schedule" },
        isLink: true
      },
      {
        label: { he: "ג׳ימבורי", en: "Gymboree" },
        value: { he: "פירוט הפעילות בגימבורי", en: "See gymboree schedule" },
        isLink: true
      }
    ]
  },

  // 2. Contact Details Section
  contact: {
    title: {
      he: "פרטי יצירת קשר",
      en: "Contact Details"
    },
    address: {
      he: "רח׳ הרצוג 105, ירושלים 92622",
      en: "105 Herzog St., Jerusalem 92622"
    },
    email: "info@beithanoar.org.il",
    phones: [
      { label: { he: "משרד", en: "Office" }, number: "02-6494111" },
      { label: { he: "פקס", en: "Fax" }, number: "02-6494100" }
    ],
    transport: {
      title: { he: "תחבורה ציבורית", en: "Public Transport" },
      lines: "6, 17, 19, 32"
    }
  },

  // 3. Contact Form Texts
  form: {
    title: { he: "יצירת קשר", en: "Contact Us" },
    fields: {
      name: { he: "שם מלא *", en: "Full Name *" },
      phone: { he: "טלפון *", en: "Phone *" },
      email: { he: "E-mail *", en: "E-mail *" },
      message: { he: "הודעה", en: "Message" },
      submit: { he: "שלח הודעה", en: "Send Message" }
    },
    successMessage: {
      he: "הודעתך נשלחה בהצלחה!",
      en: "Message sent successfully!"
    }
  },

  // 4. Legal / Bottom Bar
  bottomBar: {
    copyright: {
      he: "בית הנוער העברי ירושלים. כל הזכויות שמורות.",
      en: "Hebrew Youth Center Jerusalem. All rights reserved."
    }
  }
};