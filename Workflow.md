# Как работать над проектом

## Запуск проекта

1. Установите Node.js и npm версии из `package.json` (`engines.node`, `engines.npm`).
2. Установите зависимости:

```bash
npm install
```

3. Скопируйте переменные окружения:

```bash
cp .env.example .env
```

4. Заполните `.env` реальными значениями (особенно `JWT_SECRET`).
5. Запустите MongoDB (например, через `docker-compose.yml`):

```bash
docker compose up -d
```

6. Запустите REST API:

```bash
npm run start:dev
```

Для production-запуска:

```bash
npm start
```

## Переменные окружения

Для REST-сервиса используется `.env` (пример: `.env.example`).

- `PORT=4000` — порт REST API сервера.
- `SALT=salt` — соль для хеширования паролей.
- `DB_HOST=127.0.0.1` — хост MongoDB.
- `DB_USER=admin` — пользователь MongoDB.
- `DB_PASSWORD=test` — пароль MongoDB.
- `DB_PORT=27017` — порт MongoDB.
- `DB_NAME=six-cities` — имя базы данных.
- `UPLOAD_DIRECTORY=upload` — директория хранения загружаемых файлов.
- `JWT_SECRET=secret` — секрет подписи JWT-токенов.

## Сценарии

Список скриптов из `package.json` и их назначение:

- `npm start` — сборка и запуск REST API из `dist`.
- `npm run start:dev` — запуск REST API в dev-режиме через `nodemon`.
- `npm run build` — полная сборка (`clean` + `compile`).
- `npm run compile` — компиляция TypeScript в директорию `dist`.
- `npm run clean` — удаление директории `dist`.
- `npm run lint` — проверка исходников линтером ESLint.
- `npm run cli -- <command> [args]` — запуск CLI-интерфейса.
- `npm run mock:server` — запуск `json-server` для файла `mocks/mock-server-data.json`.

## CLI

Запуск:

```bash
npm run cli -- --<command> [--arguments]
```

Команды:

- `--version` — вывод версии приложения.
- `--help` — вывод справки по командам.
- `--import <path> <db-uri> <salt>` — импорт TSV в MongoDB.
- `--import <path> <user> <password> <host> <db> <salt>` — импорт TSV c параметрами подключения по частям.
- `--generate <n> <path> <url>` — генерация TSV с тестовыми предложениями.
