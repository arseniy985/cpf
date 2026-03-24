<x-filament-panels::page>
    <style>
        .cpf-queue-page {
            --cpf-surface: #ffffff;
            --cpf-surface-alt: #f8fafc;
            --cpf-surface-muted: #f1f5f9;
            --cpf-border: #dbe3f0;
            --cpf-text: #0f172a;
            --cpf-text-muted: #64748b;
            --cpf-shadow: 0 18px 44px -28px rgba(15, 23, 42, 0.28);
            --cpf-primary: #f59e0b;
            display: grid;
            gap: 24px;
        }

        :is(html.dark, .dark) .cpf-queue-page {
            --cpf-surface: rgba(15, 23, 42, 0.92);
            --cpf-surface-alt: rgba(17, 24, 39, 0.9);
            --cpf-surface-muted: rgba(30, 41, 59, 0.88);
            --cpf-border: rgba(148, 163, 184, 0.16);
            --cpf-text: #e5edf8;
            --cpf-text-muted: #94a3b8;
            --cpf-shadow: 0 28px 60px -36px rgba(2, 6, 23, 0.85);
            --cpf-primary: #fbbf24;
        }

        .cpf-queue-panel,
        .cpf-queue-item {
            border: 1px solid var(--cpf-border);
            border-radius: 20px;
            background: var(--cpf-surface);
            box-shadow: var(--cpf-shadow);
        }

        .cpf-queue-panel {
            padding: 20px;
        }

        .cpf-queue-grid {
            display: grid;
            gap: 16px;
            margin-top: 20px;
            grid-template-columns: repeat(1, minmax(0, 1fr));
        }

        .cpf-queue-item {
            padding: 16px;
            background: var(--cpf-surface-alt);
        }

        .cpf-queue-head,
        .cpf-queue-section-lead,
        .cpf-queue-item-lead {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .cpf-queue-head {
            align-items: flex-start;
            justify-content: space-between;
        }

        .cpf-queue-count {
            min-width: 108px;
            text-align: right;
        }

        .cpf-queue-icon-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 14px;
            border: 1px solid var(--cpf-border);
            background: var(--cpf-surface-muted);
            color: var(--cpf-primary);
            flex: 0 0 auto;
        }

        .cpf-queue-icon-svg {
            width: 18px;
            height: 18px;
        }

        .cpf-queue-title,
        .cpf-queue-section-title {
            color: var(--cpf-text);
            font-weight: 700;
        }

        .cpf-queue-section-copy,
        .cpf-queue-copy,
        .cpf-queue-meta {
            color: var(--cpf-text-muted);
            line-height: 1.65;
        }

        .cpf-queue-value {
            font-size: 30px;
            font-weight: 700;
            line-height: 1;
            color: var(--cpf-text);
            letter-spacing: -0.04em;
        }

        .cpf-queue-action {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-top: 14px;
            color: var(--cpf-primary);
            font-weight: 600;
            text-decoration: none;
        }

        .cpf-queue-action:hover,
        .cpf-queue-action:focus-visible {
            text-decoration: underline;
        }

        @media (min-width: 768px) {
            .cpf-queue-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
        }
    </style>

    <div class="cpf-queue-page">
        @foreach ($sections as $section)
            <section class="cpf-queue-panel">
                <div>
                    <div class="cpf-queue-section-lead">
                        <span class="cpf-queue-icon-badge">
                            @include('filament.pages.partials.workspace-icon', ['name' => $section['icon'] ?? 'checks', 'class' => 'cpf-queue-icon-svg'])
                        </span>

                        <h2 class="cpf-queue-section-title">{{ $section['title'] }}</h2>
                    </div>

                    <p class="cpf-queue-section-copy">{{ $section['description'] }}</p>
                </div>

                <div class="cpf-queue-grid">
                    @foreach ($section['items'] as $item)
                        <div class="cpf-queue-item">
                            <div class="cpf-queue-head">
                                <div>
                                    <div class="cpf-queue-item-lead">
                                        <span class="cpf-queue-icon-badge">
                                            @include('filament.pages.partials.workspace-icon', ['name' => $item['icon'] ?? 'inbox', 'class' => 'cpf-queue-icon-svg'])
                                        </span>

                                        <div class="cpf-queue-title">{{ $item['label'] }}</div>
                                    </div>

                                    <p class="cpf-queue-copy">{{ $item['description'] }}</p>
                                </div>

                                <div class="cpf-queue-count">
                                    <div class="cpf-queue-value">{{ $item['count'] }}</div>
                                    <div class="cpf-queue-meta">
                                        @if ($item['overdue'] > 0)
                                            Просрочено: {{ $item['overdue'] }}
                                        @else
                                            Без просрочки
                                        @endif
                                    </div>
                                </div>
                            </div>

                            <a href="{{ $item['url'] }}" class="cpf-queue-action">
                                {{ $item['action'] }}
                                @include('filament.pages.partials.workspace-icon', ['name' => 'arrow', 'class' => 'cpf-queue-icon-svg'])
                            </a>
                        </div>
                    @endforeach
                </div>
            </section>
        @endforeach
    </div>
</x-filament-panels::page>
