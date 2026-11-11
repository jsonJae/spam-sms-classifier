import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET() {
  try {
    const targetUrl = new URL("/health", BACKEND_URL);
    const response = await fetch(targetUrl);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to connect to backend service";
    return NextResponse.json({ status: "error", detail: message }, { status: 502 });
  }
}

