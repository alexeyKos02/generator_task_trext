# Jira Generator

Генератор заголовков и текстов для Jira на основе таблицы агентов / ЮЛ / терминалов.

**Стек:** Vue 3 + TypeScript + Vite

---

## Быстрый старт (локально)

```bash
npm install
npm run dev
```

---

## Деплой через GitHub Pages

### 1. Создайте репозиторий на GitHub

Зайдите на https://github.com/new и создайте публичный репозиторий, например `generator-task-trext`.

### 2. Настройте base path

Откройте `vite.config.ts` и замените `REPO_NAME` на имя вашего репозитория:

```ts
const REPO_NAME = 'ваш-репозиторий'  // ← замените здесь
```

### 3. Залейте проект в GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/ВАШ_РЕПОЗИТОРИЙ.git
git push -u origin main
```

### 4. Включите GitHub Pages

1. Откройте репозиторий на GitHub
2. Перейдите в **Settings → Pages**
3. В разделе **Build and deployment** выберите:
   - **Source:** `GitHub Actions`
4. Нажмите **Save**

### 5. Автодеплой

После включения GitHub Pages при каждом `git push` в ветку `main` автоматически запустится workflow из `.github/workflows/deploy.yml`:

1. Установит зависимости (`npm ci`)
2. Соберёт проект (`npm run build`)
3. Опубликует папку `dist` в GitHub Pages

Статус деплоя виден во вкладке **Actions** репозитория.

### 6. Ваш сайт будет доступен по адресу:

```
https://ВАШ_ЛОГИН.github.io/ВАШ_РЕПОЗИТОРИЙ/
```

---

## Добавление данных

Данные об агентах хранятся в `src/data/agents.json`.

Структура записи:

```json
{
  "name": "ООО «Название»",
  "gateId": 3026,
  "guid1c": "a956c365-f1f2-11f0-9062-005056a25b06",
  "salesChannel1cbu": "Розница",
  "salesChannelReports": "Точка продаж",
  "terminalIds": [31954824, 31954825, 31954826]
}
```

Замените содержимое файла своими реальными данными и сделайте `git push`.

---

## Добавление нового типа сообщения

Откройте `src/logic/templates.ts` и добавьте объект в массив `templates`:

```ts
{
  id: 'my-new-type',
  label: 'Название в выпадающем списке',
  requiredFields: ['name', 'gateId'],  // поля Agent, которые обязательны
  buildTitle: (agent) => `${agent.name} — мой заголовок`,
  buildBody:  (agent) => `Текст для ${agent.name}, gateId: ${agent.gateId}`,
},
```

Больше ничего менять не нужно — новый тип появится в списке автоматически.

---

## Структура проекта

```
src/
├── assets/
│   └── main.css              # Глобальные стили (reset, .card)
├── components/
│   ├── AppHeader.vue         # Шапка приложения
│   ├── SearchForm.vue        # Форма выбора шаблона и поиска
│   ├── MultipleResults.vue   # Список совпадений при неоднозначном поиске
│   ├── ResultBlock.vue       # Результат с кнопками копирования
│   └── ErrorBlock.vue        # Блок ошибки
├── data/
│   └── agents.json           # Данные агентов (замените на свои)
├── logic/
│   ├── formatTerminals.ts    # Форматирование списка terminalIds в диапазоны
│   ├── search.ts             # Нечёткий поиск по названию
│   ├── templates.ts          # Реестр шаблонов Jira-сообщений
│   └── validate.ts           # Валидация обязательных полей
├── types/
│   └── index.ts              # TypeScript-интерфейсы
├── App.vue                   # Корневой компонент
└── main.ts                   # Точка входа
```

---

## Подключение внешних источников данных

В будущем `agents.json` можно заменить на:

- **Excel / CSV** — парсинг через `xlsx` или `papaparse` с загрузкой файла
- **Google Sheets API** — fetch в `onMounted` вместо импорта JSON

Для этого достаточно заменить строку импорта в `App.vue`:

```ts
// было:
import rawAgents from './data/agents.json'

// станет (пример):
const rawAgents = await fetchFromGoogleSheets(SHEET_ID)
```
