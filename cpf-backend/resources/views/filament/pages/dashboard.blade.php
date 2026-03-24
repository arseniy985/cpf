<x-filament-panels::page>
    <style>
        .cpf-admin-page {
            display: grid;
            gap: 24px;
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
            border: 1px solid #e5e7eb;
            border-radius: 20px;
            background: #fff;
            box-shadow: 0 18px 40px -28px rgba(15, 23, 42, 0.35);
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

        .cpf-admin-summary-label,
        .cpf-admin-meta,
        .cpf-admin-copy,
        .cpf-admin-link-copy {
            color: #667085;
        }

        .cpf-admin-summary-value,
        .cpf-admin-title,
        .cpf-admin-item-title,
        .cpf-admin-section-title,
        .cpf-admin-link-title {
            color: #0f172a;
        }

        .cpf-admin-summary-value {
            margin-top: 12px;
            font-size: 32px;
            font-weight: 700;
            line-height: 1;
        }

        .cpf-admin-copy,
        .cpf-admin-link-copy {
            margin-top: 8px;
            line-height: 1.6;
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

        .cpf-admin-item-meta {
            min-width: 92px;
            text-align: right;
        }

        .cpf-admin-item-count {
            font-size: 28px;
            font-weight: 700;
            line-height: 1;
            color: #111827;
        }

        .cpf-admin-action {
            display: inline-flex;
            align-items: center;
            margin-top: 14px;
            color: #1d4ed8;
            font-weight: 600;
            text-decoration: none;
        }

        .cpf-admin-action:hover,
        .cpf-admin-action:focus-visible {
            text-decoration: underline;
        }

        .cpf-admin-link-card {
            text-decoration: none;
            transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
        }

        .cpf-admin-link-card:hover,
        .cpf-admin-link-card:focus-visible {
            border-color: #bfdbfe;
            box-shadow: 0 18px 44px -28px rgba(37, 99, 235, 0.35);
            transform: translateY(-1px);
        }

        .cpf-admin-tone-slate {
            border-color: #d0d5dd;
            background: #ffffff;
        }

        .cpf-admin-tone-rose {
            border-color: #fecdd3;
            background: #fff1f2;
        }

        .cpf-admin-tone-emerald {
            border-color: #a7f3d0;
            background: #ecfdf3;
        }

        .cpf-admin-tone-amber {
            border-color: #fde68a;
            background: #fffbeb;
        }

        .cpf-admin-tone-blue {
            border-color: #bfdbfe;
            background: #eff6ff;
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
                    <div class="cpf-admin-summary-label">{{ $card['label'] }}</div>
                    <div class="cpf-admin-summary-value">{{ $card['value'] }}</div>
                    <p class="cpf-admin-copy">{{ $card['description'] }}</p>

                    @if (filled($card['url'] ?? null))
                        <a href="{{ $card['url'] }}" class="cpf-admin-action">Перейти</a>
                    @endif
                </div>
            @endforeach
        </section>

        <section class="cpf-admin-sections-grid">
            @foreach ($sections as $section)
                <div class="cpf-admin-panel">
                    <div class="cpf-admin-panel-head">
                        <div>
                            <h2 class="cpf-admin-section-title">{{ $section['title'] }}</h2>
                            <p class="cpf-admin-copy">{{ $section['description'] }}</p>
                        </div>
                    </div>

                    <div class="cpf-admin-items">
                        @foreach ($section['items'] as $item)
                            <div class="cpf-admin-item">
                                <div class="cpf-admin-item-head">
                                    <div>
                                        <div class="cpf-admin-item-title">{{ $item['label'] }}</div>
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

                                <a href="{{ $item['url'] }}" class="cpf-admin-action">{{ $item['action'] }}</a>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endforeach
        </section>

        <section class="cpf-admin-panel">
            <div class="cpf-admin-panel-head">
                <div>
                    <h2 class="cpf-admin-section-title">Быстрые переходы</h2>
                    <p class="cpf-admin-copy">
                        Разделы, куда менеджер обычно переходит после обработки входящих задач.
                    </p>
                </div>

                <a href="{{ \App\Filament\Pages\OperationsQueue::getUrl() }}" class="cpf-admin-action">Открыть все входящие</a>
            </div>

            <div class="cpf-admin-links-grid" style="margin-top: 20px;">
                @foreach ($quickLinks as $link)
                    <a href="{{ $link['url'] }}" class="cpf-admin-link-card">
                        <div class="cpf-admin-link-title">{{ $link['label'] }}</div>
                        <p class="cpf-admin-link-copy">{{ $link['description'] }}</p>
                    </a>
                @endforeach
            </div>
        </section>
    </div>
</x-filament-panels::page>
