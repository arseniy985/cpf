# ЦПФ — структурированное ТЗ платформы

## 1. Что за платформа

ЦПФ — онлайн-платформа партнерского финансирования для:
1. Инвестирования в проекты (коммерческая недвижимость, бизнес, доли, финансовые инструменты).
2. Привлечения инвестиций инициаторами проектов.
3. Управления инвестициями, документами, выплатами и отчетностью через личные кабинеты.

## 2. Основные сценарии платформы

1. Публичный пользователь изучает проекты и условия.
2. Инвестор регистрируется, проходит верификацию, пополняет баланс онлайн, инвестирует в проект.
3. Инвестор отслеживает доходность, документы, историю операций, подает заявки на вывод.
4. Инициатор проекта (привлекающий инвестиции) размещает проект и проходит модерацию.
5. Админ-команда проверяет проекты/пользователей, управляет контентом CMS и финансовыми статусами.

## 3. Правило движения денег (обязательное)

1. Пополнение: только онлайн через платежный шлюз, зачисление автоматически.
2. Вывод: только через заявку пользователя в кабинете и ручную обработку сотрудником в админке.
3. Статусы вывода отображаются пользователю в кабинете.

## 4. Роли и права

## 4.1 Внешние роли

1. `guest`
- Доступ: публичные страницы, проекты, блог, FAQ, документы.
- Без финансовых операций.

2. `investor`
- Регистрация/логин, KYC.
- Просмотр проектов и документов.
- Пополнение баланса онлайн.
- Инвестирование в проекты.
- Просмотр портфеля, истории операций, выплат.
- Создание и отслеживание заявок на вывод.

3. `project_owner` (инициатор, привлекающий инвестиции)
- Создание и редактирование карточек своих проектов.
- Загрузка документов и отчетов.
- Отправка проекта на модерацию.
- Просмотр статусов привлечения и аналитики по своему проекту.

## 4.2 Внутренние роли

1. `manager`
- Модерация проектов и лидов.
- Коммуникация с инвесторами/инициаторами.
- Подтверждение операционных шагов по заявкам.

2. `compliance`
- KYC/KYB/AML-проверки.
- Подтверждение/отклонение спорных операций.

3. `accountant`
- Обработка финансовых операций.
- Ручное проведение подтвержденных выплат по заявкам на вывод.

4. `content_manager`
- CMS: страницы, FAQ, отзывы, кейсы, блог, документы.

5. `admin`
- Полный доступ: роли, права, настройки, аудит, системные справочники.

## 5. Как человек привлекает инвестиции (`project_owner`)

1. Регистрация и верификация (KYC/KYB).
2. Создание проекта в статусе `draft`.
3. Заполнение карточки: описание, финмодель, риск-профиль, параметры участия.
4. Загрузка документов проекта.
5. Отправка на модерацию (`pending_review`).
6. Проверка менеджером и compliance (Due Diligence).
7. Публикация (`published`) или возврат на доработку.
8. Сбор инвестиций, обновление отчетности, закрытие раунда.

## 6. Как человек инвестирует (`investor`)

1. Регистрация и прохождение KYC.
2. Выбор проекта через каталог/фильтры/калькулятор.
3. Пополнение баланса онлайн.
4. Подтверждение условий участия и создание инвестиции.
5. Мониторинг в кабинете: активы, выплаты, документы, операции.
6. Создание заявки на вывод средств.
7. Ожидание ручной обработки заявки сотрудником.
8. Получение финального статуса выплаты.

## 7. Разделы сайта (функциональные)

1. Главная.
2. О компании.
3. Как это работает.
4. Проекты (каталог).
5. Страница проекта.
6. Калькулятор доходности.
7. Тарифы и участие.
8. Документы.
9. Отзывы и кейсы.
10. FAQ.
11. Блог.
12. Контакты.
13. Личный кабинет (инвестор).
14. Кабинет инициатора проекта (project owner).
15. Админка/CMS.

## 8. Требования к ключевым модулям

## 8.1 Каталог проектов

1. Фильтры: категория, минимальная сумма входа, доходность, срок, статус.
2. Сортировка: по доходности, сроку, сумме входа, дате публикации.
3. Карточка проекта: фото, название, min сумма, доходность, срок, статус, `Подробнее`, `Инвестировать`.

## 8.2 Страница проекта

1. Полные параметры участия.
2. Риски и условия.
3. Документы проекта.
4. FAQ по проекту.
5. Калькулятор по проекту.
6. CTA для инвестирования.

## 8.3 Калькулятор

1. Входные параметры: сумма, срок, сценарий/тариф, проект.
2. Результат: прогноз выплат по месяцам, суммарный доход, итоговый возврат.
3. Экспорт расчета в PDF.

## 8.4 Личный кабинет инвестора

1. Дашборд: баланс, активные инвестиции, ближайшие выплаты.
2. Мои проекты.
3. История операций.
4. Документы.
5. Пополнение (онлайн).
6. Вывод (заявка + статусы ручной обработки).
7. Настройки профиля/уведомлений.

## 8.5 CMS/контент

Управляемые сущности:
1. Страницы и контент-блоки.
2. FAQ.
3. Отзывы.
4. Кейсы.
5. Блог (категории, теги, статьи).
6. Документы платформы и проектов.
7. Медиафайлы.
8. Лиды и обращения.

## 9. Сущности данных (домен)

1. `User`
2. `UserProfile`
3. `Role`
4. `Session`
5. `KycProfile`
6. `Project`
7. `ProjectRisk`
8. `ProjectDocument`
9. `ProjectMetricsSnapshot`
10. `Investment`
11. `TariffPlan`
12. `Wallet`
13. `WalletTransaction`
14. `Deposit`
15. `WithdrawalRequest`
16. `Payout`
17. `Page`
18. `PageBlock`
19. `FaqItem`
20. `Review`
21. `CaseStudy`
22. `BlogCategory`
23. `BlogTag`
24. `BlogPost`
25. `LegalDocument`
26. `MediaAsset`
27. `ContactLead`
28. `Notification`
29. `AuditLog`
30. `StatusHistory`

## 10. API требования

1. Базовый префикс: `/api/v1`.
2. Формат: JSON.
3. Аутентификация: `Bearer JWT`.
4. Проверка webhook-подписей для платежного провайдера.
5. Пагинация list-методов: `page`, `perPage`, `sort`, `order`.
6. Единый формат ошибок: `{ code, message, details?, traceId }`.
7. Ролевая авторизация на уровне endpoint.
8. Идемпотентность финансовых POST-запросов через `Idempotency-Key`.

## 11. API: публичная часть

1. `GET /public/home`
2. `GET /public/about`
3. `GET /public/how-it-works`
4. `GET /public/contacts`

5. `GET /projects`
6. `GET /projects/{projectId}`
7. `GET /projects/{projectId}/documents`
8. `GET /projects/{projectId}/faq`
9. `GET /projects/{projectId}/payout-forecast`

10. `GET /tariffs`
11. `POST /calculator/estimate`
12. `POST /calculator/estimate/export`

13. `GET /documents`
14. `GET /reviews`
15. `GET /case-studies`
16. `GET /faq`
17. `GET /blog/categories`
18. `GET /blog/posts`
19. `GET /blog/posts/{slug}`

20. `POST /leads/consultation`
21. `POST /leads/contact`
22. `POST /leads/callback`

## 12. API: кабинет инвестора

1. `POST /auth/register`
2. `POST /auth/login`
3. `POST /auth/refresh`
4. `POST /auth/logout`
5. `GET /me`
6. `PATCH /me`
7. `POST /me/kyc`
8. `GET /me/kyc`

9. `GET /cabinet/overview`
10. `GET /cabinet/investments`
11. `GET /cabinet/investments/{investmentId}`
12. `GET /cabinet/transactions`
13. `GET /cabinet/documents`
14. `GET /cabinet/notifications`
15. `PATCH /cabinet/notifications/{id}/read`

16. `POST /investments`
17. `GET /investments/{investmentId}/agreement`
18. `POST /investments/{investmentId}/confirm`

19. `POST /wallet/deposits`
20. `GET /wallet/deposits`
21. `GET /wallet/deposits/{depositId}`

22. `POST /wallet/withdrawals`
23. `GET /wallet/withdrawals`
24. `GET /wallet/withdrawals/{withdrawalId}`
25. `POST /wallet/withdrawals/{withdrawalId}/cancel`

## 13. API: кабинет инициатора проекта (`project_owner`)

1. `GET /owner/projects`
2. `POST /owner/projects`
3. `GET /owner/projects/{projectId}`
4. `PATCH /owner/projects/{projectId}`
5. `POST /owner/projects/{projectId}/submit-review`
6. `GET /owner/projects/{projectId}/investments`
7. `GET /owner/projects/{projectId}/reports`
8. `POST /owner/projects/{projectId}/reports`
9. `GET /owner/projects/{projectId}/documents`
10. `POST /owner/projects/{projectId}/documents`

## 14. API: админка/CMS

1. `GET /admin/pages`
2. `GET /admin/pages/{pageKey}`
3. `PUT /admin/pages/{pageKey}`
4. `POST /admin/pages/{pageKey}/publish`

5. `GET /admin/projects`
6. `POST /admin/projects`
7. `GET /admin/projects/{projectId}`
8. `PATCH /admin/projects/{projectId}`
9. `POST /admin/projects/{projectId}/publish`
10. `POST /admin/projects/{projectId}/archive`

11. `GET /admin/documents`
12. `POST /admin/documents`
13. `PATCH /admin/documents/{documentId}`
14. `POST /admin/documents/{documentId}/publish`
15. `DELETE /admin/documents/{documentId}`

16. `GET /admin/reviews`
17. `POST /admin/reviews`
18. `PATCH /admin/reviews/{reviewId}`
19. `POST /admin/reviews/{reviewId}/publish`
20. `DELETE /admin/reviews/{reviewId}`

21. `GET /admin/case-studies`
22. `POST /admin/case-studies`
23. `PATCH /admin/case-studies/{caseId}`
24. `POST /admin/case-studies/{caseId}/publish`

25. `GET /admin/faq`
26. `POST /admin/faq`
27. `PATCH /admin/faq/{faqId}`
28. `DELETE /admin/faq/{faqId}`

29. `GET /admin/blog/posts`
30. `POST /admin/blog/posts`
31. `GET /admin/blog/posts/{postId}`
32. `PATCH /admin/blog/posts/{postId}`
33. `POST /admin/blog/posts/{postId}/publish`
34. `DELETE /admin/blog/posts/{postId}`

35. `GET /admin/blog/categories`
36. `POST /admin/blog/categories`
37. `PATCH /admin/blog/categories/{categoryId}`
38. `DELETE /admin/blog/categories/{categoryId}`

39. `GET /admin/leads`
40. `GET /admin/leads/{leadId}`
41. `PATCH /admin/leads/{leadId}`
42. `POST /admin/leads/{leadId}/assign`
43. `POST /admin/leads/{leadId}/comment`

44. `POST /admin/media/upload`
45. `DELETE /admin/media/{assetId}`

46. `GET /admin/audit-logs`
47. `GET /admin/status-history/{entityType}/{entityId}`

## 15. Операционный контур ручного вывода

### 15.1 Статусы `WithdrawalRequest`

1. `draft`
2. `pending_review`
3. `approved`
4. `rejected`
5. `processing_manual_payout`
6. `paid`
7. `failed`
8. `canceled`

### 15.2 Админ endpoint для ручной обработки

1. `GET /admin/withdrawals`
2. `GET /admin/withdrawals/{withdrawalId}`
3. `POST /admin/withdrawals/{withdrawalId}/approve`
4. `POST /admin/withdrawals/{withdrawalId}/reject`
5. `POST /admin/withdrawals/{withdrawalId}/mark-processing`
6. `POST /admin/withdrawals/{withdrawalId}/mark-paid`
7. `POST /admin/withdrawals/{withdrawalId}/mark-failed`

Обязательные поля фиксации ручной выплаты:
1. `processedByUserId`
2. `processedAt`
3. `externalPaymentReference`
4. `managerComment`

## 16. Webhooks платежей

1. `POST /webhooks/payments/{provider}`
- обновляет статусы депозитов/возвратов;
- валидирует подпись провайдера;
- пишет событие в аудит.

## 17. Нефункциональные требования

1. Версионирование API через `/v1`.
2. Audit trail для всех финансовых смен статусов.
3. TraceId в ответах ошибок и логах.
4. Rate limiting публичного API.
5. RBAC на все кабинетные и админ-эндпоинты.
