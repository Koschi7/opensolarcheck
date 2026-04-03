# Contributing to OpenSolarCheck

Vielen Dank für dein Interesse an OpenSolarCheck!

## Entwicklung starten

```bash
git clone https://github.com/Koschi7/opensolarcheck.git
cd opensolarcheck
pnpm install
cp .env.example .env
pnpm dev
```

## Code-Richtlinien

- TypeScript strict mode
- ESLint + Prettier
- Conventional Commits (feat:, fix:, docs:, etc.)
- Tests für Berechnungsmodule erforderlich

## Pull Requests

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feat/mein-feature`)
3. Committe deine Änderungen (`git commit -m 'feat: beschreibung'`)
4. Push den Branch (`git push origin feat/mein-feature`)
5. Erstelle einen Pull Request

## Tests

```bash
pnpm test:run
```

Stelle sicher, dass alle Tests bestehen, bevor du einen PR erstellst.

## Berechnungslogik

Änderungen an den Berechnungsmodulen (`src/lib/calculations/`) müssen mit entsprechenden Tests abgedeckt werden. Die Testabdeckung für dieses Verzeichnis soll mindestens 80% betragen.

## Tarife aktualisieren

Die Einspeisevergütung und Strompreise werden in `src/lib/data/tariffs.ts` gepflegt. Diese Werte sollten alle 6 Monate geprüft und aktualisiert werden.
