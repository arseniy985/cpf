import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight } from "lucide-react";

interface WhatToDoNowProps {
  title: string;
  description: string;
  primaryActionLabel: string;
  primaryActionHref?: string;
  secondaryActionLabel?: string;
}

export function WhatToDoNow({ 
  title, 
  description, 
  primaryActionLabel,
  secondaryActionLabel 
}: WhatToDoNowProps) {
  return (
    <Card className="border-brand-warning/30 bg-[#FFFAF0] mb-8">
      <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="mt-1 bg-brand-warning/10 p-2 rounded-full text-brand-warning">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-brand-text mb-1">{title}</h3>
            <p className="text-sm text-brand-text-muted">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          {secondaryActionLabel && (
            <Button variant="ghost" className="w-full sm:w-auto">
              {secondaryActionLabel}
            </Button>
          )}
          <Button className="w-full sm:w-auto gap-2">
            {primaryActionLabel}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
