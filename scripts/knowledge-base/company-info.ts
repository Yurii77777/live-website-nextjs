import type { KnowledgeBaseItem } from "./types";

export const companyInfoContent: KnowledgeBaseItem[] = [
  {
    title: "Magic WebLab - Загальна інформація",
    content: `Magic WebLab - команда розробників та дизайнерів, що втілює ідеї у реальність.

Основна місія: веб-розробка та інтеграція AI, автоматизація бізнес-процесів.

Унікальні переваги:
- Повний цикл веб-розробки
- Фокус на сучасних технологіях
- Клієнто-орієнтований підхід
- Оптимізація бізнес-процесів
- Відкрито, швидко та без зайвої бюрократії

Філософія: "Кожен наш проект - це не про код, це рішення, яке працює для вашого бізнесу."`,
    metadata: { type: "company_info", page: "main", lang: "uk" },
  },
  {
    title: "Технології Magic WebLab",
    content: `Технології, які використовує команда:

Languages:
- JavaScript
- TypeScript

Frontend:
- SCSS/SASS
- Tailwind CSS
- Material UI
- React
- Next.js
- micro-frontend
- shadcn/ui
- react-query
- vite

Backend:
- Node.js
- NestJS
- Express

Бази даних:
- MongoDB
- PostgreSQL
- Redis

AI:
- OpenAI
- Google Gemini
- Vercel AI SDK

Інші інструменти:
- Docker
- Figma`,
    metadata: { type: "technologies", page: "about", lang: "uk" },
  },
  {
    title: "Контактна інформація Magic WebLab",
    content: `Контакти Magic WebLab:

Телефон: +38 095 165 84 73
Email: info@magic-weblab.com.ua
Адреса: Україна, м. Київ
Графік роботи: Пн-Пт: 10:00-18:00, Сб-Нд: Вихідні

Безкоштовна консультація. Прозоре ціноутворення.`,
    metadata: { type: "contacts", page: "contacts", lang: "uk" },
  },
];
