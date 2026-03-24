<x-filament-panels::page>
    <style>
        .cpf-admin-page {
            --cpf-surface: #ffffff;
            --cpf-surface-alt: #f8fafc;
            --cpf-surface-muted: #f1f5f9;
            --cpf-border: #dbe3f0;
            --cpf-border-strong: #c4d0e3;
            --cpf-text: #0f172a;
            --cpf-text-muted: #64748b;
            --cpf-text-soft: #94a3b8;
            --cpf-shadow: 0 18px 44px -28px rgba(15, 23, 42, 0.28);
            --cpf-primary: #f59e0b;
            --cpf-primary-soft: rgba(245, 158, 11, 0.16);
            --cpf-danger: #f87171;
            --cpf-danger-soft: rgba(248, 113, 113, 0.16);
            --cpf-success: #34d399;
            --cpf-success-soft: rgba(52, 211, 153, 0.15);
            --cpf-info: #60a5fa;
            --cpf-info-soft: rgba(96, 165, 250, 0.16);
            display: grid;
            gap: 24px;
        }

        :is(html.dark, .dark) .cpf-admin-page {
            --cpf-surface: rgba(15, 23, 42, 0.92);
            --cpf-surface-alt: rgba(17, 24, 39, 0.9);
            --cpf-surface-muted: rgba(30, 41, 59, 0.88);
            --cpf-border: rgba(148, 163, 184, 0.16);
            --cpf-border-strong: rgba(245, 158, 11, 0.28);
            --cpf-text: #e5edf8;
            --cpf-text-muted: #94a3b8;
            --cpf-text-soft: #64748b;
            --cpf-shadow: 0 28px 60px -36px rgba(2, 6, 23, 0.85);
            --cpf-primary: #fbbf24;
            --cpf-primary-soft: rgba(251, 191, 36, 0.14);
            --cpf-danger: #fda4af;
            --cpf-danger-soft: rgba(251, 113, 133, 0.14);
            --cpf-success: #6ee7b7;
            --cpf-success-soft: rgba(52, 211, 153, 0.14);
            --cpf-info: #93c5fd;
            --cpf-info-soft: rgba(96, 165, 250, 0.14);
        }

        .cpf-admin-summary-grid,
        .cpf-admin-sections-grid,
        .cpf-admin-links-grid {
            display: grid;
            gap: 16px;
        }

        .cpf-admin-summary-grid {
            grid-template-columns: repeat(1, minmax(0, 1fr));
        }

        .cpf-admin-sections-grid {
            grid-template-columns: repeat(1, minmax(0, 1fr));
        }

        .cpf-admin-links-grid {
            grid-template-columns: repeat(1, minmax(0, 1fr));
        }

        .cpf-admin-panel,
        .cpf-admin-summary-card,
        .cpf-admin-item,
        .cpf-admin-link-card {
            border: 1px solid var(--cpf-border);
            border-radius: 20px;
            background: var(--cpf-surface);
            box-shadow: var(--cpf-shadow);
        }

        .cpf-admin-summary-card {
            padding: 20px;
        }

        .cpf-admin-panel {
            padding: 20px;
        }

        .cpf-admin-item,
        .cpf-admin-link-card {
            padding: 16px;
        }

        .cpf-admin-summary-head,
        .cpf-admin-item-lead,
        .cpf-admin-link-lead,
        .cpf-admin-section-lead {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .cpf-admin-icon-badge {
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

        .cpf-admin-icon-svg {
            width: 18px;
            height: 18px;
        }

        .cpf-admin-summary-label,
        .cpf-admin-meta,
        .cpf-admin-copy,
        .cpf-admin-link-copy,
        .cpf-admin-section-copy {
            color: var(--cpf-text-muted);
        }

        .cpf-admin-summary-value,
        .cpf-admin-item-title,
        .cpf-admin-section-title,
        .cpf-admin-link-title {
            color: var(--cpf-text);
        }

        .cpf-admin-summary-value {
            margin-top: 14px;
            font-size: 40px;
            font-weight: 700;
            line-height: 1;
            letter-spacing: -0.04em;
        }

        .cpf-admin-copy,
        .cpf-admin-link-copy,
        .cpf-admin-section-copy {
            margin-top: 8px;
            line-height: 1.65;
        }

        .cpf-admin-items {
            display: grid;
            gap: 12px;
            margin-top: 20px;
        }

        .cpf-admin-item-head,
        .cpf-admin-panel-head {
            display: flex;
            justify-content: space-between;
            gap: 16px;
        }

        .cpf-admin-item {
            background: var(--cpf-surface-alt);
        }

        .cpf-admin-item-meta {
            min-width: 108px;
            text-align: right;
        }

        .cpf-admin-item-count {
            font-size: 30px;
            font-weight: 700;
            line-height: 1;
            color: var(--cpf-text);
            letter-spacing: -0.04em;
        }

        .cpf-admin-meta {
            margin-top: 6px;
            font-size: 13px;
        }

        .cpf-admin-action {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-top: 14px;
            color: var(--cpf-primary);
            font-weight: 600;
            text-decoration: none;
        }

        .cpf-admin-action:hover,
        .cpf-admin-action:focus-visible {
            text-decoration: underline;
        }

        .cpf-admin-link-card {
            text-decoration: none;
            transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease, background 0.2s ease;
            background: var(--cpf-surface-alt);
        }

        .cpf-admin-link-card:hover,
        .cpf-admin-link-card:focus-visible {
            border-color: var(--cpf-border-strong);
            background: var(--cpf-surface-muted);
            transform: translateY(-1px);
        }

        .cpf-admin-tone-slate {
            background: linear-gradient(180deg, var(--cpf-surface) 0%, var(--cpf-surface-alt) 100%);
        }

        .cpf-admin-tone-rose {
            background: linear-gradient(180deg, color-mix(in srgb, var(--cpf-surface) 88%, var(--cpf-danger-soft)) 0%, color-mix(in srgb, var(--cpf-surface-alt) 76%, var(--cpf-danger-soft)) 100%);
            border-color: color-mix(in srgb, var(--cpf-border) 72%, var(--cpf-danger) 28%);
        }

        .cpf-admin-tone-emerald {
            background: linear-gradient(180deg, color-mix(in srgb, var(--cpf-surface) 88%, var(--cpf-success-soft)) 0%, color-mix(in srgb, var(--cpf-surface-alt) 76%, var(--cpf-success-soft)) 100%);
            border-color: color-mix(in srgb, var(--cpf-border) 72%, var(--cpf-success) 28%);
        }

        .cpf-admin-tone-amber {
            background: linear-gradient(180deg, color-mix(in srgb, var(--cpf-surface) 86%, var(--cpf-primary-soft)) 0%, color-mix(in srgb, var(--cpf-surface-alt) 74%, var(--cpf-primary-soft)) 100%);
            border-color: color-mix(in srgb, var(--cpf-border) 68%, var(--cpf-primary) 32%);
        }

        .cpf-admin-tone-blue {
            background: linear-gradient(180deg, color-mix(in srgb, var(--cpf-surface) 86%, var(--cpf-info-soft)) 0%, color-mix(in srgb, var(--cpf-surface-alt) 74%, var(--cpf-info-soft)) 100%);
            border-color: color-mix(in srgb, var(--cpf-border) 68%, var(--cpf-info) 32%);
        }

        @media (min-width: 768px) {
            .cpf-admin-summary-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .cpf-admin-links-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
        }

        @media (min-width: 1280px) {
            .cpf-admin-summary-grid {
                grid-template-columns: repeat(4, minmax(0, 1fr));
            }

            .cpf-admin-sections-grid {
                grid-template-columns: repeat(3, minmax(0, 1fr));
            }

            .cpf-admin-links-grid {
                grid-template-columns: repeat(5, minmax(0, 1fr));
            }
        }
    </style>

    @php
        $tones = [
            'slate' => 'cpf-admin-tone-slate',
            'rose' => 'cpf-admin-tone-rose',
            'emerald' => 'cpf-admin-tone-emerald',
            'amber' => 'cpf-admin-tone-amber',
            'blue' => 'cpf-admin-tone-blue',
        ];
    @endphp

    <div class="cpf-admin-page">
        <section class="cpf-admin-summary-grid">
            @foreach ($summary as $card)
                <div class="cpf-admin-summary-card {{ $tones[$card['tone']] ?? $tones['slate'] }}">
                    <div class="cpf-admin-summary-head">
                        <span class="cpf-admin-icon-badge">
                            @include('filament.pages.partials.workspace-icon', ['name' => $card['icon'] ?? 'inbox', 'class' => 'cpf-admin-icon-svg'])
                        </span>

                        <div class="cpf-admin-summary-label">{{ $card['label'] }}</div>
                    </div>

                    <div class="cpf-admin-summary-value">{{ $card['value'] }}</div>
                    <p class="cpf-admin-copy">{{ $card['description'] }}</p>

                    @if (filled($card['url'] ?? null))
                        <a href="{{ $card['url'] }}" class="cpf-admin-action">
                            Открыть
                            @include('filament.pages.partials.workspace-icon', ['name' => 'arrow', 'class' => 'cpf-admin-icon-svg'])
                        </a>
                    @endif
                </div>
            @endforeach
        </section>

        <section class="cpf-admin-sections-grid">
            @foreach ($sections as $section)
                <div class="cpf-admin-panel">
                    <div class="cpf-admin-panel-head">
                        <div>
                            <div class="cpf-admin-section-lead">
                                <span class="cpf-admin-icon-badge">
                                    @include('filament.pages.partials.workspace-icon', ['name' => $section['icon'] ?? 'checks', 'class' => 'cpf-admin-icon-svg'])
                                </span>

                                <h2 class="cpf-admin-section-title">{{ $section['title'] }}</h2>
                            </div>

                            <p class="cpf-admin-section-copy">{{ $section['description'] }}</p>
                        </div>
                    </div>

                    <div class="cpf-admin-items">
                        @foreach ($section['items'] as $item)
                            <div class="cpf-admin-item">
                                <div class="cpf-admin-item-head">
                                    <div>
                                        <div class="cpf-admin-item-lead">
                                            <span class="cpf-admin-icon-badge">
                                                @include('filament.pages.partials.workspace-icon', ['name' => $item['icon'] ?? 'inbox', 'class' => 'cpf-admin-icon-svg'])
                                            </span>

                                            <div class="cpf-admin-item-title">{{ $item['label'] }}</div>
                                        </div>

                                        <p class="cpf-admin-copy">{{ $item['description'] }}</p>
                                    </div>

                                    <div class="cpf-admin-item-meta">
                                        <div class="cpf-admin-item-count">{{ $item['count'] }}</div>
                                        <div class="cpf-admin-meta">
                                            @if ($item['overdue'] > 0)
                                                Просрочено: {{ $item['overdue'] }}
                                            @else
                                                Без просрочки
                                            @endif
                                        </div>
                                    </div>
                                </div>

                                <a href="{{ $item['url'] }}" class="cpf-admin-action">
                                    {{ $item['action'] }}
                                    @include('filament.pages.partials.workspace-icon', ['name' => 'arrow', 'class' => 'cpf-admin-icon-svg'])
                                </a>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endforeach
        </section>

        <section class="cpf-admin-panel">
            <div class="cpf-admin-panel-head">
                <div>
                    <div class="cpf-admin-section-lead">
                        <span class="cpf-admin-icon-badge">
                            @include('filament.pages.partials.workspace-icon', ['name' => 'arrow', 'class' => 'cpf-admin-icon-svg'])
                        </span>

                        <h2 class="cpf-admin-section-title">Быстрые переходы</h2>
                    </div>

                    <p class="cpf-admin-section-copy">
                        Разделы, куда менеджер обычно переходит после обработки входящих задач.
                    </p>
                </div>

                <a href="{{ \App\Filament\Pages\OperationsQueue::getUrl() }}" class="cpf-admin-action">
                    Открыть все входящие
                    @include('filament.pages.partials.workspace-icon', ['name' => 'arrow', 'class' => 'cpf-admin-icon-svg'])
                </a>
            </div>

            <div class="cpf-admin-links-grid" style="margin-top: 20px;">
                @foreach ($quickLinks as $link)
                    <a href="{{ $link['url'] }}" class="cpf-admin-link-card">
                        <div class="cpf-admin-link-lead">
                            <span class="cpf-admin-icon-badge">
                                @include('filament.pages.partials.workspace-icon', ['name' => $link['icon'] ?? 'globe', 'class' => 'cpf-admin-icon-svg'])
                            </span>

                            <div class="cpf-admin-link-title">{{ $link['label'] }}</div>
                        </div>

                        <p class="cpf-admin-link-copy">{{ $link['description'] }}</p>
                    </a>
                @endforeach
            </div>
        </section>
    </div>
</x-filament-panels::page>
