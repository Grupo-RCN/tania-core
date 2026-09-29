# Initial page


## Local development

A Docker dev environment with hot reload for both halves of the app. Nothing in it is
used by the deploy path — production is built by the separate `tania` repo.

```bash
cp .env.dev.example .env.dev
docker compose -f compose.dev.yml --env-file .env.dev up --build
# http://localhost:4180 — log in as tania / tania (created on first start)
docker compose -f compose.dev.yml --env-file .env.dev down   # volumes are kept
```

| Service | What it does | Host port |
|---|---|---|
| `backend` | Go server under [air](https://github.com/air-verse/air): any `.go` edit rebuilds and restarts it. Serves `/api` and the built frontend. | `127.0.0.1:4180` |
| `frontend` | `webpack --watch` rebuilds the Vue bundle into the shared `public` volume on every edit under `resources/`. Reload the browser to see it. | none |

SQLite and uploads live in the `data` volume, not in the checkout. Settings are passed as
environment variables, which viper reads ahead of `conf.json`; `conf.json` is seeded from
the example only because `webpack.config.js` requires it. The first `up` takes several
minutes (npm install and Go module download); later ones are cached.

Ports 4180-4189 belong to this app (Company Brain `registry/local-dev.yaml`).
