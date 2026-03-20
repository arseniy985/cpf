'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, MapPin, Clock, Send, MessageCircle, Search, Phone, User } from 'lucide-react';
import { useSession } from '@/features/session/model/use-session';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { CPFBrand } from '@/shared/ui/cpf-brand';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const navLinks = [
  { name: 'Главная', href: '/' },
  { name: 'О компании', href: '/about' },
  { name: 'Как это работает', href: '/how' },
  { name: 'Проекты', href: '/projects' },
  { name: 'Калькулятор', href: '/calculator' },
  { name: 'Тарифы', href: '/tariffs' },
  { name: 'Документы', href: '/documents' },
  { name: 'Отзывы', href: '/reviews' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Блог', href: '/blog' },
  { name: 'Контакты', href: '/contacts' },
  { name: 'Кабинет', href: '/app' },
];

export default function Header() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const session = useSession();

  const ownerLink = useMemo(
    () =>
      session.user
        ? session.user.roles.includes('project_owner')
          ? { href: '/app/owner', label: 'Кабинет владельца' }
          : { href: '/app/settings', label: 'Стать владельцем' }
        : { href: '/register?intent=owner', label: 'Стать владельцем' },
    [session.user],
  );

  const accountLink = useMemo(
    () =>
      session.user
        ? session.user.roles.includes('project_owner')
          ? { href: '/app/owner', label: 'Кабинет' }
          : { href: '/app/investor', label: 'Кабинет' }
        : { href: '/login', label: 'Вход' },
    [session.user],
  );

  async function handleLogout() {
    await session.logout();
    router.push('/login');
  }

  function handleSearchSubmit() {
    const query = search.trim();
    router.push(query ? `/projects?search=${encodeURIComponent(query)}` : '/projects');
    setIsMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 flex w-full flex-col border-b border-border/80 bg-white/95 shadow-sm backdrop-blur">
      <div className="hidden lg:flex justify-between items-center px-8 py-2 border-b border-slate-100 text-xs text-slate-500 bg-slate-50">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-indigo-600"/> г. Москва, Пресненская наб., 12</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-indigo-600"/> Пн-Вс 9:00 - 21:00</span>
        </div>
        <div className="flex items-center gap-6">
            <a href="tel:+74951369888" className="font-bold text-slate-800 hover:text-indigo-600 transition flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-indigo-600"/> +7 (495) 136-98-88
            </a>
          <div className="flex items-center gap-4">
            <Link href="/contacts" className="flex items-center gap-1.5 hover:text-blue-500 transition"><Send className="w-3.5 h-3.5 text-blue-500"/> Telegram</Link>
            <Link href="/contacts" className="flex items-center gap-1.5 hover:text-green-500 transition"><MessageCircle className="w-3.5 h-3.5 text-green-500"/> WhatsApp</Link>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center px-4 lg:px-8 py-4 gap-8">
        <CPFBrand className="shrink-0" />

        <div className="hidden lg:flex flex-1 max-w-2xl items-center gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Поиск по коммерческой недвижимости и инвестпроектам…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSearchSubmit();
                }
              }}
              className="h-13 rounded-full border-transparent bg-muted pl-11 pr-4"
            />
          </div>
          <Button size="icon" className="shrink-0" onClick={handleSearchSubmit} aria-label="Запустить поиск">
            <Search className="size-4" />
          </Button>
        </div>

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <Button asChild variant="outline" className="h-13 px-6">
            <Link href={ownerLink.href}>
              {ownerLink.label}
            </Link>
          </Button>
          <Button asChild className="h-13 px-6">
            <Link href={accountLink.href} className="flex items-center gap-2">
              <User className="w-4 h-4" /> {accountLink.label}
            </Link>
          </Button>
          {session.isAuthenticated && (
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="h-13 px-4"
            >
              Выйти
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Button asChild size="sm" className="h-10 rounded-full px-4 shadow-md shadow-primary/15">
            <Link href={accountLink.href} className="flex items-center gap-2">
              <User className="size-4" aria-hidden="true" />
              <span>{accountLink.label}</span>
            </Link>
          </Button>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-2xl" aria-label="Открыть меню навигации">
                <Menu className="size-5" aria-hidden="true" />
                <span className="sr-only">Открыть меню</span>
              </Button>
            </SheetTrigger>
          <SheetContent side="right" className="flex w-[90vw] max-w-sm flex-col bg-indigo-950 text-white">
            <SheetHeader>
              <SheetTitle>Навигация ЦПФ</SheetTitle>
              <SheetDescription>
                Быстрый доступ к каталогу, кабинету и заявке на привлечение капитала.
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-indigo-200" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleSearchSubmit();
                    }
                  }}
                  placeholder="Поиск по проектам…"
                  className="rounded-full border-indigo-800 bg-indigo-900 pl-11 text-white placeholder:text-indigo-300"
                />
              </div>

              <Button
                type="button"
                width="full"
                className="h-11 rounded-full bg-white text-indigo-950 hover:bg-indigo-100"
                onClick={handleSearchSubmit}
              >
                Найти проект
              </Button>

              <div className="grid gap-2">
                {navLinks.map((link) => (
                  <Button
                    key={link.name}
                    asChild
                    variant="ghost"
                    className="justify-start rounded-2xl px-4 text-left text-white hover:bg-white/10 hover:text-white"
                  >
                    <Link href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                      {link.name}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            <Separator className="my-6 bg-indigo-800" />

            <div className="grid gap-3">
              <Button asChild variant="outline" className="border-indigo-700 bg-transparent text-white hover:bg-white/10 hover:text-white">
                <Link href={ownerLink.href} onClick={() => setIsMobileMenuOpen(false)}>
                  {ownerLink.label}
                </Link>
              </Button>
              <Button asChild>
                <Link href={accountLink.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
                  <User className="w-4 h-4" /> {accountLink.label}
                </Link>
              </Button>
              {session.isAuthenticated ? (
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10 hover:text-white"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    void handleLogout();
                  }}
                >
                  Выйти
                </Button>
              ) : null}
            </div>
          </SheetContent>
          </Sheet>
        </div>
      </div>

      <nav className="hidden lg:flex bg-indigo-950 text-white px-6 py-3.5 gap-7 justify-start overflow-x-auto whitespace-nowrap shadow-inner">
        {navLinks.map(link => (
          <Link key={link.name} href={link.href} className="text-xs font-bold hover:text-teal-400 transition-colors uppercase tracking-widest shrink-0">
            {link.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
