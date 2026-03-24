<x-filament-panels::page>
    @php
        $tones = [
            'slate' => 'border-slate-200 bg-white dark:border-white/10 dark:bg-gray-900',
            'rose' => 'border-rose-200 bg-rose-50/80 dark:border-rose-500/30 dark:bg-rose-500/10',
            'emerald' => 'border-emerald-200 bg-emerald-50/80 dark:border-emerald-500/30 dark:bg-emerald-500/10',
            'amber' => 'border-amber-200 bg-amber-50/80 dark:border-amber-500/30 dark:bg-amber-500/10',
            'blue' => 'border-blue-200 bg-blue-50/80 dark:border-blue-500/30 dark:bg-blue-500/10',
        ];
    @endphp

    <div class="space-y-6">
        <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            @foreach ($summary as $card)
                <div class="rounded-2xl border p-5 shadow-sm {{ $tones[$card['tone']] ?? $tones['slate'] }}">
                    <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $card['label'] }}</div>
                    <div class="mt-3 text-3xl font-semibold tracking-tight text-gray-950 dark:text-white">
                        {{ $card['value'] }}
                    </div>
                    <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{{ $card['description'] }}</p>

                    @if (filled($card['url'] ?? null))
                        <a
                            href="{{ $card['url'] }}"
                            class="mt-4 inline-flex items-center text-sm font-medium text-blue-700 transition hover:text-blue-900 focus-visible:outline-none focus-visible:underline dark:text-blue-300 dark:hover:text-blue-100"
                        >
                            Перейти
                        </a>
                    @endif
                </div>
            @endforeach
        </section>

        <section class="grid gap-4 xl:grid-cols-3">
            @foreach ($sections as $section)
                <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-900">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <h2 class="text-base font-semibold text-gray-950 dark:text-white">{{ $section['title'] }}</h2>
                            <p class="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">{{ $section['description'] }}</p>
                        </div>
                    </div>

                    <div class="mt-5 space-y-3">
                        @foreach ($section['items'] as $item)
                            <div class="rounded-xl border border-gray-200 p-4 dark:border-white/10">
                                <div class="flex items-start justify-between gap-4">
                                    <div class="min-w-0">
                                        <div class="text-sm font-semibold text-gray-950 dark:text-white">{{ $item['label'] }}</div>
                                        <p class="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">{{ $item['description'] }}</p>
                                    </div>

                                    <div class="shrink-0 text-right">
                                        <div class="text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">{{ $item['count'] }}</div>
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
                </div>
            @endforeach
        </section>

        <section class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-900">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 class="text-base font-semibold text-gray-950 dark:text-white">Быстрые переходы</h2>
                    <p class="text-sm leading-6 text-gray-500 dark:text-gray-400">
                        Разделы, куда менеджер обычно переходит после обработки входящих задач.
                    </p>
                </div>

                <a
                    href="{{ \App\Filament\Pages\OperationsQueue::getUrl() }}"
                    class="inline-flex items-center text-sm font-medium text-blue-700 transition hover:text-blue-900 focus-visible:outline-none focus-visible:underline dark:text-blue-300 dark:hover:text-blue-100"
                >
                    Открыть все входящие
                </a>
            </div>

            <div class="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                @foreach ($quickLinks as $link)
                    <a
                        href="{{ $link['url'] }}"
                        class="rounded-xl border border-gray-200 p-4 transition hover:border-blue-300 hover:bg-blue-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-white/10 dark:hover:border-blue-400/40 dark:hover:bg-blue-500/10"
                    >
                        <div class="text-sm font-semibold text-gray-950 dark:text-white">{{ $link['label'] }}</div>
                        <p class="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">{{ $link['description'] }}</p>
                    </a>
                @endforeach
            </div>
        </section>
    </div>
</x-filament-panels::page>
