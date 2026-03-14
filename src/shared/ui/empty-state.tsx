import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="border-dashed bg-muted/30">
      <CardContent className="py-10 text-center">
        <Badge variant="outline" className="border-primary/20 bg-primary/8 text-primary">
          Empty state
        </Badge>
        <h3 className="text-xl font-display font-bold text-indigo-950">{title}</h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600">{description}</p>
        {action ? <div className="mt-6">{action}</div> : null}
      </CardContent>
    </Card>
  );
}
