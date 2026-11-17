import type { Prediction } from "../components/result-card";

export const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/predict`
  : "/api/predict";

export class PredictionError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "PredictionError";
  }
}

export async function requestPrediction(
  text: string,
  signal?: AbortSignal,
): Promise<Prediction> {
  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
    signal,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      detail?: unknown;
    } | null;
    throw new PredictionError(
      typeof body?.detail === "string"
        ? body.detail
        : "The classification engine could not process that message.",
      response.status,
    );
  }

  return (await response.json()) as Prediction;
}

/** P(spam) from the API's label confidence. */
export function spamProbability(prediction: Prediction): number {
  return prediction.is_spam ? prediction.confidence : 1 - prediction.confidence;
}

/**
 * The logistic regression decision score. For a binary LogisticRegression,
 * P(spam) = sigmoid(z), so z = ln(p / (1 - p)).
 */
export function decisionScore(pSpam: number): number {
  const p = Math.min(Math.max(pSpam, 1e-4), 1 - 1e-4);
  return Math.log(p / (1 - p));
}
