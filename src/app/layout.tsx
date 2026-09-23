import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CoreStack Academy — CS fundamentals with tracked progress",
    template: "%s · CoreStack Academy",
  },
  description:
    "CoreStack Academy is a full-stack course platform for operating systems, DBMS, system design, DSA, OOD and computer networks — with quizzes, notes and progress that persist across devices.",
  keywords: ["operating systems", "dbms", "system design", "dsa", "computer networks", "interview prep", "corestack academy"],
  openGraph: {
    title: "CoreStack Academy — CS fundamentals with tracked progress",
    description: "Six deep courses, 150+ lessons, quizzes and notes that sync to your account.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
