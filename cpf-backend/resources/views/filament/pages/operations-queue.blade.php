<x-filament-panels::page>
    <style>
        .cpf-queue-page {
            display: grid;
            gap: 24px;
        }

        .cpf-queue-panel,
        .cpf-queue-item {
            border: 1px solid #e5e7eb;
            border-radius: 20px;
            background: #fff;
            box-shadow: 0 18px 40px -28px rgba(15, 23, 42, 0.35);
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
        }

        .cpf-queue-head {
            display: flex;
            justify-content: space-between;
            gap: 16px;
        }

        .cpf-queue-count {
            min-width: 92px;
            text-align: right;
        }

        .cpf-queue-title,
        .cpf-queue-section-title {
            color: #0f172a;
            font-weight: 700;
        }

        .cpf-queue-section-copy,
        .cpf-queue-copy,
        .cpf-queue-meta {
            color: #667085;
            line-height: 1.6;
        }

        .cpf-queue-value {
            font-size: 30px;
            font-weight: 700;
            line-height: 1;
            color: #111827;
        }

        .cpf-queue-action {
            display: inline-flex;
            align-items: center;
            margin-top: 14px;
            color: #1d4ed8;
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
                    <h2 class="cpf-queue-section-title">{{ $section['title'] }}</h2>
                    <p class="cpf-queue-section-copy">{{ $section['description'] }}</p>
                </div>

                <div class="cpf-queue-grid">
                    @foreach ($section['items'] as $item)
                        <div class="cpf-queue-item">
                            <div class="cpf-queue-head">
                                <div>
                                    <div class="cpf-queue-title">{{ $item['label'] }}</div>
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

                            <a href="{{ $item['url'] }}" class="cpf-queue-action">{{ $item['action'] }}</a>
                        </div>
                    @endforeach
                </div>
            </section>
        @endforeach
    </div>
</x-filament-panels::page>
