export function AppShellSkeleton() {
  return (
    <div className="min-h-screen bg-cabinet-canvas text-cabinet-ink">
      <div className="flex min-h-screen">
        <aside className="hidden w-[320px] shrink-0 border-r border-cabinet-border bg-cabinet-primary lg:block">
          <div className="flex h-full animate-pulse flex-col gap-4 p-6 motion-reduce:animate-none">
            <div className="h-6 w-32 rounded-sm bg-white/15" />
            <div className="mt-4 h-11 w-full rounded-sm bg-white/10" />
            <div className="h-11 w-full rounded-sm bg-white/10" />
            <div className="h-11 w-full rounded-sm bg-white/10" />
            <div className="mt-auto h-16 w-full rounded-sm bg-white/10" />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="border-b border-cabinet-border bg-cabinet-canvas/95 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-[1440px] animate-pulse flex-col gap-4 motion-reduce:animate-none lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="h-3 w-28 rounded-sm bg-cabinet-border" />
                <div className="h-8 w-64 rounded-sm bg-cabinet-border" />
              </div>
              <div className="h-11 w-full rounded-sm bg-cabinet-surface sm:w-64" />
            </div>
          </div>

          <main id="main-content" className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto grid max-w-[1440px] gap-6 lg:grid-cols-[1.4fr_0.9fr]">
              <div className="space-y-6">
                <div className="h-48 animate-pulse rounded-sm border border-cabinet-border bg-cabinet-surface motion-reduce:animate-none" />
                <div className="h-64 animate-pulse rounded-sm border border-cabinet-border bg-cabinet-surface motion-reduce:animate-none" />
              </div>
              <div className="h-80 animate-pulse rounded-sm border border-cabinet-border bg-cabinet-surface motion-reduce:animate-none" />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
