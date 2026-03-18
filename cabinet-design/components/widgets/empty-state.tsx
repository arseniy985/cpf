import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Card className="shadow-none border-dashed border-2 border-[#E2E8F0] bg-transparent">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <div className="h-12 w-12 rounded-full bg-brand-secondary flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-brand-primary" />
        </div>
        <h3 className="text-lg font-semibold text-brand-text mb-2">{title}</h3>
        <p className="text-sm text-brand-text-muted max-w-md mb-6">{description}</p>
        {actionLabel && (
          <Button onClick={onAction}>{actionLabel}</Button>
        )}
      </CardContent>
    </Card>
  );
}
