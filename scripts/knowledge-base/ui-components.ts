import type { KnowledgeBaseItem } from "./types";

export const uiComponentsContent: KnowledgeBaseItem[] = [
  {
    title: "UI Компоненти для відповідей",
    content: `Система має набір UI компонентів для форматування відповідей користувачу.

ДОСТУПНІ КОМПОНЕНТИ:

1. Button - кнопка з liquid glass ефектом
Варіанти: default, destructive, outline, ghost
Розміри: default, sm, lg, icon
Використання для CTA (Call To Action)

2. Link - посилання для телефонів, email, зовнішніх ресурсів
Варіанти:
- inline: текстове посилання з підкресленням
- subtle: ненав'язливе посилання
- unstyled: без стилів
- asButton: посилання у вигляді кнопки (використовує стилі Button)

Приклади:
- Телефон: <Link href="tel:+380951658473">+38 095 165 84 73</Link>
- Email: <Link href="mailto:info@magic-weblab.com.ua">info@magic-weblab.com.ua</Link>
- Як кнопка: <Link asButton href="tel:+380951658473">Зателефонувати</Link>

3. Heading - заголовки
Варіанти: h1, h2, h3, h4, h5, h6, title, subtitle
Вирівнювання: left, center, right
Mobile-first адаптивні розміри

4. Paragraph - параграфи тексту
Варіанти:
- default: звичайний текст (14px → 18px)
- lead: вступний текст (16px → 20px)
- small: малий текст (12px → 14px)
- muted: приглушений колір
- caption: підписи (12px)
Вирівнювання: left, center, right, justify

5. Input - поле вводу
Для форм та взаємодії з користувачем

6. Списки (ul/li) - маркіровані списки
Автоматично додається іконка ChevronRight перед кожним пунктом
Синтаксис:
<ul>
  <li>Перший пункт</li>
  <li>Другий пункт</li>
  <li>Третій пункт</li>
</ul>

ПРАВИЛА ВИКОРИСТАННЯ:
- Використовуй Link для контактів (телефон, email)
- Використовуй Heading для структурування інформації
- Використовуй Paragraph для основного тексту
- Використовуй Button для дій (CTA)
- Дотримуйся семантики та доступності (a11y)
- Mobile-first підхід у всьому

ПРИКЛАД ВІДПОВІДІ:
<Heading variant="h2">Наші послуги</Heading>
<Paragraph variant="lead">Ми пропонуємо повний цикл веб-розробки</Paragraph>
<Paragraph>Детальніше про послуги можна дізнатися за телефоном <Link href="tel:+380951658473">+38 095 165 84 73</Link> або email <Link href="mailto:info@magic-weblab.com.ua">info@magic-weblab.com.ua</Link></Paragraph>
<Link asButton href="tel:+380951658473">Зателефонувати зараз</Link>`,
    metadata: { type: "ui_components", category: "system", lang: "uk" },
  },
  {
    title: "Іконки для відповідей",
    content: `Система має набір іконок (Lucide React) для візуального підсилення відповідей.

ДОСТУПНІ ІКОНКИ:

Контакти:
- PhoneIcon - телефон
- MailIcon - email
- MapPinIcon - адреса/локація
- MessageCircleIcon - месенджер/чат

Загальні:
- GlobeIcon - веб-сайт/інтернет
- SendIcon - відправити/надіслати
- CalendarIcon - календар/дата
- ClockIcon - час
- DollarSignIcon - ціна/гроші
- CheckCircleIcon - успіх/виконано
- ArrowRightIcon - стрілка вправо
- ExternalLinkIcon - зовнішнє посилання
- ChevronRightIcon - шеврон вправо (використовується в списках)
- CircleArrowRightIcon - стрілка в колі
- MoveRightIcon - стрілка руху

СИНТАКСИС:
<Icon name="PhoneIcon" />
<Icon name="MailIcon" size="18" />
<Icon name="PhoneIcon" variant="default" />

ВАРІАНТИ СТИЛІЗАЦІЇ:
- inline (за замовчуванням) - проста іконка без фону
- default - liquid glass стиль з фоном, тінями та border (як у кнопок)

ПРАВИЛА ВИКОРИСТАННЯ:
- Використовуй іконки для візуального підсилення тексту
- Іконки ставляться ПЕРЕД текстом для акценту
- Розмір за замовчуванням: 16px
- variant="default" для важливих контактів (телефон, email)
- variant="inline" або без variant для звичайних іконок

ПРИКЛАДИ ВИКОРИСТАННЯ:
- Телефон з liquid glass: <Icon name="PhoneIcon" variant="default" /> <Link href="tel:+380951658473">+38 095 165 84 73</Link>
- Email з liquid glass: <Icon name="MailIcon" variant="default" /> <Link href="mailto:info@magic-weblab.com.ua">info@magic-weblab.com.ua</Link>
- Адреса (inline): <Icon name="MapPinIcon" /> Україна, м. Київ
- Ціна (inline): <Icon name="DollarSignIcon" /> від $300
- Термін (inline): <Icon name="ClockIcon" /> від 1 тижня

Список з іконками (ChevronRightIcon додається автоматично):
<ul>
  <li><strong>Дизайн:</strong> Індивідуальний або шаблонний</li>
  <li><strong>Функціонал:</strong> Інтерактивні елементи</li>
  <li><strong>Терміни:</strong> Від 1 тижня</li>
</ul>

КОЛИ ВИКОРИСТОВУВАТИ:
- При згадці контактів (телефон, email, адреса)
- При згадці соціальних мереж
- При згадці цін та термінів
- Для візуального виділення важливої інформації
- При переліку переваг, функцій, особливостей (використовуй списки ul/li)`,
    metadata: { type: "ui_components", category: "icons", lang: "uk" },
  },
];
