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
        <Providers>
          {children}
          <ChatWidget />
          <GlobalModal />
        </Providers>
      </body>
    </html>
  );
}
