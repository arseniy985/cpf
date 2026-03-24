<x-filament-panels::page>
    <div class="space-y-6">
        @foreach ($sections as $section)
            <section class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-900">
                <div class="flex flex-col gap-1">
                    <h2 class="text-base font-semibold text-gray-950 dark:text-white">{{ $section['title'] }}</h2>
                    <p class="text-sm leading-6 text-gray-500 dark:text-gray-400">{{ $section['description'] }}</p>
                </div>

                <div class="mt-5 grid gap-4 md:grid-cols-2">
                    @foreach ($section['items'] as $item)
                        <div class="rounded-xl border border-gray-200 p-4 dark:border-white/10">
                            <div class="flex items-start justify-between gap-4">
                                <div class="min-w-0">
                                    <div class="text-sm font-semibold text-gray-950 dark:text-white">{{ $item['label'] }}</div>
                                    <p class="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">{{ $item['description'] }}</p>
                                </div>

                                <div class="shrink-0 text-right">
                                    <div class="text-3xl font-semibold tracking-tight text-gray-950 dark:text-white">{{ $item['count'] }}</div>
                                    <div class="text-xs text-gray-500 dark:text-gray-400">
                                        @if ($item['overdue'] > 0)
                                            Просрочено: {{ $item['overdue'] }}
                                        @else
                                            Без просрочки
                                        @endif
                                    </div>
                                </div>
                            </div>

                            <a
                                href="{{ $item['url'] }}"
                                class="mt-4 inline-flex items-center text-sm font-medium text-blue-700 transition hover:text-blue-900 focus-visible:outline-none focus-visible:underline dark:text-blue-300 dark:hover:text-blue-100"
                            >
                                {{ $item['action'] }}
                            </a>
                        </div>
                    @endforeach
                </div>
            </section>
        @endforeach
    </div>
</x-filament-panels::page>
