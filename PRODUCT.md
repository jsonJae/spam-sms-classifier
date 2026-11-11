# Product
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Everyday individuals on desktop and mobile devices who receive unfamiliar, urgent, or suspicious SMS or chat messages and want to verify whether a message is safe or fraudulent before responding, clicking links, or sharing sensitive information.

## Product Purpose

SMS Guardian provides instant, accessible SMS message classification. It allows users to quickly inspect suspicious text messages and receive an immediate verdict ("spam" or "ham") paired with an explainable confidence score and signal indicators, preventing fraud and protecting users from phishing attacks.

## Positioning

Instant, zero-friction message verification with transparent confidence scoring and observable signal breakdowns (urgent phrasing, shortened links, bait rewards). Unlike complex threat tools or closed security suites, SMS Guardian requires no account, installation, or personal data entry to deliver rapid, understandable protection.

## Operating Context

- Used reactively when a suspicious text arrives on a mobile phone or messaging platform.
- Primary interaction: copying raw message text and pasting it into the web scanner console across mobile and desktop browsers.
- Real-time API status check against the inference service ensures users know whether predictions are currently available.

## Capabilities and Constraints

- Text input constrained to 1–5,000 characters.
- Machine learning backend: Scikit-learn classification pipeline loaded from `message_classifier.joblib` served via FastAPI.
- Endpoints: `POST /predict` returning binary label (`spam` / `ham`), boolean `is_spam`, and probability confidence score; `GET /health` for real-time uptime monitoring.
- Explainable signal indicators highlighting key spam markers: shortened URLs, artificial urgency/pressure, and prize/bait claims.
- Front-end stack: Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript.

## Brand Commitments

- Product name: SMS Guardian.
- Subtitle: Signal intelligence / Spam message classifier.
- Voice and tone: Vigilant, precise, calm, and reassuring. Technical clarity without fear-mongering or patronizing jargon.

## Evidence on Hand

- Trained classification model binary: `message_classifier.joblib`
- Exploratory data analysis and model training notebook: `sms-message-classifier.ipynb`
- Python FastAPI inference service: `backend/main.py`
- Complete Next.js web application frontend: `frontend/`

## Product Principles

1. **Immediate clarity**: Deliver a definitive verdict and confidence score immediately without extraneous steps or sign-ups.
2. **Explainable signals**: Demystify the decision by highlighting visible patterns (urgency, link shorteners, prize bait) so users learn what to look for.
3. **Respect user privacy**: Treat message text as ephemeral verification input; do not log, persist, or profile scanned texts.
4. **Resilient feedback**: Keep the user informed of operational status (online vs offline API) with clear error handling and graceful fallbacks.

## Accessibility & Inclusion

- Adhere to WCAG 2.1 AA standards: high contrast ratios for verdicts and text, semantic labels, screen reader announcements for asynchronous scan results, keyboard navigation, and respect for `prefers-reduced-motion`.

