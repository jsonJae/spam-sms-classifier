# SMS Guardian

SMS Guardian is a web app for checking a text message before you reply to it. You paste the message into the page and get a `spam` or `ham` label, a confidence score, and a few browser-side checks for links, urgency wording, and prize or money bait.

The classifier is a scikit-learn pipeline served by FastAPI. The frontend is a Next.js app. Both run separately in development and are connected through Docker Compose or the route handlers in the Next.js app.

## Repository layout

- `backend/` contains the FastAPI service, Python requirements, Dockerfile, and the model the service loads.
- `frontend/` contains the Next.js App Router app and Tailwind CSS styles.
- `sms-message-classifier.ipynb` builds the dataset, trains the pipeline, and prints evaluation metrics.
- `message_classifier.joblib` is the serialized model at the repo root. `backend/message_classifier.joblib` is the copy used at runtime.
- `docker-compose.yml` runs the two services locally.
- `vercel.json` defines the frontend and backend services for Vercel.
- `.github/workflows/` holds the CI and container publishing jobs.

## How it works

1. The browser posts `{ "text": "..." }` to `/api/predict` on the Next.js app.
2. The route handler in `frontend/app/api/predict/route.ts` forwards the request to the FastAPI service at `BACKEND_URL`, which defaults to `http://localhost:8000`.
3. FastAPI loads `backend/message_classifier.joblib`, runs the text through the pipeline, and returns the label and the probability for that label.
4. The result card treats confidence below 60% as a borderline result. It also runs regex checks on the scanned text for links, urgency words, and prize or money wording. Those checks only affect what the card displays.

If `NEXT_PUBLIC_API_URL` is set at build time, the browser calls `${NEXT_PUBLIC_API_URL}/predict` directly instead of using the proxy route.

## Tech stack

| Layer | What it uses |
| --- | --- |
| Frontend | Next.js 16.4.6 (App Router), React 19.3.0, TypeScript 5, Tailwind CSS 4.3.5, PostCSS |
| Backend | Python 3.12, FastAPI, Uvicorn, Pydantic, scikit-learn 1.6.1, joblib |
| Tooling | Node 22, npm, ESLint 9, flake8, Husky 9, lint-staged 17 |
| Runtime | Docker and Docker Compose, GitHub Actions, Vercel |

## Run with Docker

```
docker compose up --build
```

Frontend: http://localhost:3000

API: http://localhost:8000

Compose sets `BACKEND_URL=http://backend:8000` for the frontend container, so the Next.js proxy works inside the Compose network. The API allows requests from `http://localhost:3000` and `http://127.0.0.1:3000` by default.

## Run locally

You need Python 3.12, Node 22, and npm. The model files are already in the repo.

Start the backend in PowerShell:

```
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
uvicorn main:app --app-dir backend --reload --port 8000
```

On macOS or Linux, activate the environment with `source .venv/bin/activate`.

Start the frontend in a second terminal:

```
cd frontend
npm install
npm run dev
```

Open http://localhost:3000. The proxy points at `http://localhost:8000` unless `BACKEND_URL` is set.

The root `package.json` only holds repo tooling:

```
npm install
```

That installs Husky and lint-staged for the commit hooks. It does not install the frontend dependencies.

## Configuration

| Variable | Set in | Default | Purpose |
| --- | --- | --- | --- |
| `ALLOWED_ORIGINS` | Backend | `http://localhost:3000,http://127.0.0.1:3000` | Comma-separated CORS origins. |
| `BACKEND_URL` | Frontend server | `http://localhost:8000` | Target for the `/api/predict` and `/api/health` route handlers. |
| `NEXT_PUBLIC_API_URL` | Frontend build | unset | When set, the browser calls the backend directly and skips the proxy. |

## API

`GET /health`

```
{"status": "ok"}
```

`POST /predict`

Request:

```
{"text": "Congratulations! You won a free prize, claim now"}
```

Example response:

```
{"label": "spam", "is_spam": true, "confidence": 0.98}
```

`text` must be between 1 and 5,000 characters. Whitespace-only text returns 400, and a body that fails schema validation returns 422.

## Model and dataset

The notebook trains one pipeline:

```
TfidfVectorizer(stop_words="english", max_features=5000)
LogisticRegression(class_weight="balanced", max_iter=1000)
```

Two Kaggle datasets are combined:

| Source | Rows used | Label |
| --- | --- | --- |
| [UCI SMS Spam Collection](https://www.kaggle.com/datasets/uciml/sms-spam-collection-dataset), `spam.csv` | 4,825 | `ham` only |
| [Philippine spam SMS messages](https://www.kaggle.com/datasets/bwandowando/philippine-spam-sms-messages), `SPAM_SMS.csv` | 1,023 | `spam` only |

After dropping empty text, the combined set has 5,848 messages. The split is 80/20, stratified, with `random_state=42`: 4,678 training rows and 1,170 test rows.

Reported test results from the notebook:

| Class | Precision | Recall | F1 | Support |
| --- | --- | --- | --- | --- |
| ham | 0.99 | 1.00 | 1.00 | 965 |
| spam | 1.00 | 0.98 | 0.99 | 205 |

Accuracy is 0.99. The confusion matrix is `[[964, 1], [5, 200]]`.

The notebook writes `spam_classifier.joblib`. The service resolves the model relative to `backend/main.py`, so `backend/message_classifier.joblib` is the file actually loaded. The Docker build also copies the root `message_classifier.joblib` into the image. When you retrain, rename the output to `message_classifier.joblib` and keep the root and backend copies identical.

Training dependencies are not in `backend/requirements.txt`. The notebook needs `kagglehub`, `pandas`, `scikit-learn`, and `joblib`, plus Kaggle authentication if the datasets are not already cached.

## Checks

Install the backend dev requirements and the frontend dependencies first:

```
pip install -r backend/requirements-dev.txt
npm --prefix frontend install
```

Then run these from the repo root:

```
npm run lint
npm run typecheck:frontend
npm run build:frontend
```

`npm run lint` runs ESLint on the frontend and flake8 on the backend. CI also loads the model and sends two sample messages to a running API instance. The container workflow publishes images to GHCR on pushes to `main` and on version tags.

## Contributing

Create a branch from `main`. Use a type prefix and a short kebab-case description:

```
feat/frontend-confidence-warning
fix/backend-empty-text
docs/update-api-examples
refactor/split-prediction-route
```

The prefix should match the kind of change. Use `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, or `revert`. Keep branch names lowercase and use hyphens instead of spaces.

Commit messages use the same type prefix and must follow the format enforced by the Husky hook:

```
<type>: <message>
```

For example:

```
fix: handle whitespace-only messages
```

Pull requests use `.github/PULL_REQUEST_TEMPLATE.md`. Complete the summary, scope, testing steps, and any API, configuration, or model changes. Add screenshots for UI changes. Keep each pull request focused on one area and split unrelated backend and frontend work when it can be reviewed separately.

Before opening a pull request, run the checks in the previous section. If you retrain the model, update the notebook, include the new metrics, and replace both model copies.

## Notes and limits

The dataset is not balanced and each source contributes only one class. All ham comes from the UCI collection and all spam comes from the Philippine dataset, so the model can learn source and language cues as well as spam cues. The 0.99 test score measures performance on that mixed split, not on live SMS traffic.

Confidence is the logistic regression probability for the predicted class. It has not been calibrated against real messages. The link, urgency, and bait indicators in the result card are regular expressions in the browser, so treat them as hints rather than part of the prediction.

Neither the FastAPI service nor the Next.js route handler writes message text to disk. Hosting providers and reverse proxies may still keep request logs.
