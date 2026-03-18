export type TimelineItem = {
  id: string;
  title: string;
  description: string;
  meta: string;
  tone?: 'default' | 'warning' | 'success';
};

type AppTimelineProps = {
  items: TimelineItem[];
};

export function AppTimeline({ items }: AppTimelineProps) {
  return (
    <ol className="space-y-4">
      {items.map((item) => (
        <li key={item.id} className="relative border-l border-app-cabinet-border pl-5">
          <span
            className={
              item.tone === 'success'
                ? 'absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-app-cabinet-success'
                : item.tone === 'warning'
                  ? 'absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-app-cabinet-warning'
                  : 'absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-app-cabinet-accent'
            }
          />
          <p className="text-sm font-semibold text-app-cabinet-text">{item.title}</p>
          <p className="mt-1 text-sm leading-6 text-app-cabinet-muted">{item.description}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-app-cabinet-muted">{item.meta}</p>
        </li>
      ))}
    </ol>
  );
}
