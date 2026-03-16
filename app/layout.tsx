import ChatWidget from '@/widgets/chat-widget';
import GlobalModal from '@/widgets/global-modal';
import Providers from './providers';
import './globals.css';

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
    <html lang="ru" className="scroll-smooth">
      <body className="font-sans antialiased bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
        <a
          href="#main-content"
          className="sr-only z-50 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Перейти к основному содержимому
        </a>
        <Providers>
          {children}
          <ChatWidget />
          <GlobalModal />
        </Providers>
      </body>
    </html>
  );
}
