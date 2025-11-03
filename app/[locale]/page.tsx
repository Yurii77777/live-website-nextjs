import { useTranslations } from 'next-intl';
import { Chat } from '@/components/chat';

export default function Home() {
  const t = useTranslations('home');

  return (
    <main className="min-h-screen p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">{t('heading')}</h1>
        <p className="mt-4 text-gray-600">
          {t('subtitle')}
        </p>
      </header>

      <section className="max-w-4xl mx-auto">
        <Chat />
      </section>
    </main>
  );
}
