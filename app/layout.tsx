import { Onest, Jura } from 'next/font/google';
import ChatWidget from '@/components/chat-widget';
import GlobalModal from '@/components/modal';
import './globals.css';

const onest = Onest({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-sans',
});

const jura = Jura({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-display',
});

export const metadata = {
  title: 'ЦПФ | Центр Партнёрского Финансирования',
  description: 'Вложения в коммерческую недвижимость и бизнес от 10 000 ₽ с ежемесячными выплатами.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${onest.variable} ${jura.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
        {children}
        <ChatWidget />
        <GlobalModal />
      </body>
    </html>
  );
}
