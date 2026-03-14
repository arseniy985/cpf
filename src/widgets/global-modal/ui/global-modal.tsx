'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ContactRequestForm } from '@/features/contact-request/ui/contact-request-form';
import { ProjectSubmissionForm } from '@/features/project-submission/ui/project-submission-form';

export default function GlobalModal() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'invest' | 'consult'>('consult');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [prefillMessage, setPrefillMessage] = useState('');
  const isCabinetRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/owner');

  useEffect(() => {
    if (isCabinetRoute) {
      return;
    }

    const handleOpen = (event: Event) => {
      const customEvent = event as CustomEvent<{
        type?: 'invest' | 'consult';
        prefillMessage?: string;
      }>;

      setType(customEvent.detail?.type || 'consult');
      setPrefillMessage(customEvent.detail?.prefillMessage || '');
      setIsSubmitted(false);
      setIsOpen(true);
    };

    window.addEventListener('open-modal', handleOpen);

    return () => window.removeEventListener('open-modal', handleOpen);
  }, [isCabinetRoute]);

  if (isCabinetRoute) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="overflow-hidden border-none p-0 sm:max-w-2xl">
        <div className="relative bg-card px-6 py-8 sm:px-8 sm:py-10">
          <div className="pointer-events-none absolute top-0 right-0 size-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/20 blur-3xl" />

          {isSubmitted ? (
            <div className="relative z-10 py-6 text-center">
              <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-primary/12 text-primary">
                <CheckCircle2 className="size-10" />
              </div>
              <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
                Заявка принята
              </Badge>
              <h3 className="mt-5 text-3xl font-display font-black text-indigo-950">
                Свяжемся с вами вручную
              </h3>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                {type === 'invest'
                  ? 'Наш менеджер свяжется с вами и поможет подобрать подходящий проект.'
                  : 'Команда ЦПФ свяжется с вами для разбора параметров объекта и структуры сделки.'}
              </p>
              <Button className="mt-8" width="full" onClick={() => setIsOpen(false)}>
                Закрыть
              </Button>
            </div>
          ) : (
            <div className="relative z-10">
              <DialogHeader>
                <Badge variant="outline" className="w-fit border-primary/20 bg-primary/10 text-primary">
                  {type === 'invest' ? 'Investor intake' : 'Origination intake'}
                </Badge>
                <DialogTitle>
                  {type === 'invest' ? 'Начать инвестировать' : 'Привлечь капитал под объект'}
                </DialogTitle>
                <DialogDescription>
                  {type === 'invest'
                    ? 'Оставьте контакты, и мы свяжемся с вами для подбора проектов и старта на платформе.'
                    : 'Заполните короткую анкету по объекту, и мы оценим возможность размещения на платформе.'}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-8">
                {type === 'invest' ? (
                  <ContactRequestForm
                    className="grid gap-4"
                    source="global-modal"
                    subject="Инвесторская консультация"
                    defaultMessage={prefillMessage}
                    showMessageField
                    successMessage="Заявка отправлена. Мы свяжемся с вами в ближайшее время."
                    submitLabel="Получить предложения"
                  />
                ) : (
                  <ProjectSubmissionForm onSuccess={() => setIsSubmitted(true)} />
                )}

                <p className="mt-4 text-center text-xs leading-relaxed text-slate-400">
                  Нажимая на кнопку, вы даете согласие на обработку{' '}
                  <a href="#" className="underline hover:text-indigo-600">
                    персональных данных
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
