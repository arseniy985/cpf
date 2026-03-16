<?php

namespace App\Modules\Content\Support;

use App\Modules\Content\Data\FaqItemData;
use App\Modules\Content\Data\ReviewData;

class PublicContentDefaults
{
    /**
     * @return array{projectsCount:int, investorsCount:int, totalInvested:int}
     */
    public static function homeStats(): array
    {
        return [
            'projectsCount' => 12,
            'investorsCount' => 284,
            'totalInvested' => 186000000,
        ];
    }

    /**
     * @return array<int, FaqItemData>
     */
    public static function faqs(): array
    {
        return [
            new FaqItemData(
                id: 'faq-default-1',
                groupName: 'Инвестиции',
                question: 'Как проходит регистрация и когда открывается кабинет?',
                answer: 'Сначала вы создаете учетную запись, подтверждаете email кодом и сразу попадаете в личный кабинет. Там доступны проекты, документы, заявки и история действий.',
            ),
            new FaqItemData(
                id: 'faq-default-2',
                groupName: 'Инвестиции',
                question: 'С какой суммы можно начать и где видеть статус участия?',
                answer: 'Минимальный чек зависит от проекта, стартовые сделки обычно начинаются от 10 000 ₽. После подачи заявки статус, документы и история действий отображаются в кабинете инвестора.',
            ),
            new FaqItemData(
                id: 'faq-default-3',
                groupName: 'Инвестиции',
                question: 'Как происходят выплаты и вывод средств?',
                answer: 'Доход и возвраты отображаются в личном кабинете. Если доступен вывод, вы подаете заявку, а ее статус и комментарии команды видите там же.',
            ),
            new FaqItemData(
                id: 'faq-default-4',
                groupName: 'Сделки',
                question: 'Как платформа проверяет проекты перед публикацией?',
                answer: 'Команда запрашивает документы по активу, проверяет юридическую структуру, модель выплат и ключевые риски. На витрину попадают только проекты с подготовленным пакетом материалов.',
            ),
            new FaqItemData(
                id: 'faq-default-5',
                groupName: 'Сделки',
                question: 'Что получает владелец объекта после регистрации?',
                answer: 'Владелец получает отдельный кабинет для заполнения данных компании, загрузки документов, добавления объекта и публикации отчетов. Публичный сайт и рабочий кабинет разделены.',
            ),
            new FaqItemData(
                id: 'faq-default-6',
                groupName: 'Сделки',
                question: 'Можно ли обновлять FAQ и отзывы через CMS?',
                answer: 'Да, тексты, вопросы, отзывы и основные цифры можно менять через CMS. Пока редактор не заполнил разделы, платформа показывает стартовые данные по умолчанию.',
            ),
        ];
    }

    /**
     * @return array<int, ReviewData>
     */
    public static function reviews(): array
    {
        return [
            new ReviewData(
                id: 'review-default-1',
                authorName: 'Алексей Миронов',
                authorRole: 'Частный инвестор',
                companyName: null,
                rating: 5,
                body: 'Понравилось, что после регистрации сразу видно структуру сделки, документы и статус заявки. Не пришлось вести переписку в пяти каналах.',
            ),
            new ReviewData(
                id: 'review-default-2',
                authorName: 'Елена Воронова',
                authorRole: 'Финансовый директор SPV',
                companyName: 'North Estate',
                rating: 5,
                body: 'Для владельца объекта удобно, что данные компании, карточка проекта и этапы проверки собраны в одном кабинете. Не нужно вести все вручную в таблицах.',
            ),
            new ReviewData(
                id: 'review-default-3',
                authorName: 'Роман Захаров',
                authorRole: 'Инвестор',
                companyName: null,
                rating: 5,
                body: 'Личный кабинет понятный: деньги, подтверждения, отчеты и выплаты собраны в одном месте. Не приходится искать информацию по разным разделам.',
            ),
        ];
    }
}
