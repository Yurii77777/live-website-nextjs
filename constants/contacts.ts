export const CONTACT_INFO = {
  phone: "+38 095 165 84 73",
  email: "info@magic-weblab.com.ua",
  address: {
    uk: "м. Київ, вул. 85-та Садова, буд. 6",
    en: "Kyiv, 85-ta Sadova St., building 6",
  },
  hours: {
    uk: "Пн-Пт: 10:00-18:00",
    en: "Mon-Fri: 10:00-18:00",
  },
} as const;

export const getContactsFormatted = (locale: "uk" | "en" = "uk") => `📞 ${
  locale === "uk" ? "Телефон" : "Phone"
}: ${CONTACT_INFO.phone}
✉️ Email: ${CONTACT_INFO.email}
📍 ${locale === "uk" ? "Адреса" : "Address"}: ${CONTACT_INFO.address[locale]}
⏰ ${locale === "uk" ? "Графік" : "Hours"}: ${CONTACT_INFO.hours[locale]}`;
