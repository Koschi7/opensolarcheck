# Deployment-Anleitung

## Schritt 1: SSH-Key erstellen (auf deinem Mac)

```bash
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/opensolarcheck_deploy
```

Kein Passwort setzen (Enter druecken) — der Key wird nur fuer GitHub Actions gebraucht.

Das erzeugt zwei Dateien:
- `~/.ssh/opensolarcheck_deploy` (privater Key → kommt in GitHub)
- `~/.ssh/opensolarcheck_deploy.pub` (oeffentlicher Key → kommt auf den Server)

## Schritt 2: Public Key auf dem Server hinterlegen

```bash
ssh USER@SERVER_IP "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys" < ~/.ssh/opensolarcheck_deploy.pub
```

## Schritt 3: Nginx Config auf den Server kopieren

```bash
scp deploy/nginx/opensolarcheck.conf USER@SERVER_IP:/etc/nginx/sites-available/opensolarcheck
```

Dann auf dem Server aktivieren:

```bash
ssh USER@SERVER_IP
sudo ln -s /etc/nginx/sites-available/opensolarcheck /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
exit
```

## Schritt 4: GitHub Secrets einrichten

Gehe zu: https://github.com/Koschi7/opensolarcheck/settings/secrets/actions

Folgende Secrets anlegen:

| Secret | Wert |
|---|---|
| `DEPLOY_SSH_KEY` | Inhalt von `cat ~/.ssh/opensolarcheck_deploy` (der PRIVATE Key) |
| `DEPLOY_HOST` | z.B. `root@123.45.67.89` |
| `IMPRINT_NAME` | Dein Name |
| `IMPRINT_STREET` | Deine Strasse |
| `IMPRINT_CITY` | PLZ + Ort |
| `IMPRINT_EMAIL` | Deine E-Mail |

Optional (wenn Umami laeuft):

| Secret | Wert |
|---|---|
| `UMAMI_ENABLED` | `true` |
| `UMAMI_WEBSITE_ID` | Deine Umami Website-ID |
| `UMAMI_URL` | z.B. `https://analytics.opensolarcheck.de` |

## Schritt 5: Erstes Deployment ausloesen

1. Gehe zu: https://github.com/Koschi7/opensolarcheck/actions/workflows/deploy.yml
2. Klicke "Run workflow" → "Run workflow"
3. Warte bis der Job gruen ist

## Schritt 6: SSL einrichten (sobald DNS propagiert ist)

DNS-Propagation pruefen:

```bash
dig opensolarcheck.de +short
```

Wenn die IP deines Servers erscheint:

```bash
ssh USER@SERVER_IP
sudo certbot --nginx -d opensolarcheck.de -d www.opensolarcheck.de
exit
```

Automatische Erneuerung pruefen:

```bash
ssh USER@SERVER_IP "sudo certbot renew --dry-run"
```

## Weitere Deployments

Push auf `main` → CI laeuft automatisch (Lint, Types, Tests, Build).

Wenn du deployen willst:
1. GitHub → Actions → "Deploy" → "Run workflow"

Oder via CLI:

```bash
gh workflow run deploy.yml
```
