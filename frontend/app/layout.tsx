import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  IBM_Plex_Sans,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: "variable",
});

const body = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: "variable",
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: "variable",
});

export const metadata: Metadata = {
  title: "SMS Guardian | Spam Message Classifier",
  description:
    "Check any SMS or chat message and get an instant spam or ham verdict with a confidence score.",
};

export const viewport: Viewport = {
  themeColor: "#f3efe4",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
