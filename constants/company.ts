export const COMPANY_INFO = {
  name: 'Magic WebLab',
  tagline: {
    uk: 'Втілюємо ваші ідеї у реальність!',
    en: 'Bringing your ideas to life!'
  },
  description: {
    uk: 'Команда розробників та дизайнерів, що створює бізнес-рішення',
    en: 'Team of developers and designers creating business solutions'
  }
} as const;

export const SERVICES = {
  landing: { minPrice: 300, duration: '1 week' },
  ecommerce: { minPrice: 3000, duration: '2 months' },
  ai: { minPrice: 1500, duration: '1 month' },
  chatbot: { minPrice: 1000, duration: '2 weeks' },
  modernization: { minPrice: 1500, duration: '1 month' },
  crm: { minPrice: 1500, duration: '1.5 months' },
  maintenance: { minPrice: 500, duration: 'by agreement' },
  mobile: { minPrice: 3000, duration: '2 months' }
} as const;
