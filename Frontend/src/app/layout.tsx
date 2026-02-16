import type { Metadata } from "next";
import "./globals.css";
import QueryProviders from "@/lib/providers";
import { Toaster } from "sonner";
import { NuqsAdapter } from 'nuqs/adapters/next/app'


export const metadata: Metadata = {
  metadataBase: new URL("https://kivo-new.vercel.app"),
  title: "Kivo — Simple Project Management",
  description:
    "Kivo is a simple and powerful project management tool to organize boards, manage tasks, and collaborate in real-time without the clutter.",
  keywords: [
    "Kivo",
    "project management",
    "kanban board",
    "task management",
    "team collaboration",
    "productivity app",
  ],

  authors: [{ name: "Kivo" }],
  creator: "Kivo",

  openGraph: {
    type: "website",
    url: "https://kivo-new.vercel.app",
    title: "Kivo",
    description:
      "Create boards, manage tasks, and collaborate in real-time with Kivo.",
    siteName: "Kivo",
    images: [
      {
        url: "/main/dashboard.png",
        width: 1200,
        height: 630,
        alt: "Kivo Dashboard Preview",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Kivo — Simple Project Management",
    description:
      "Organize your work simply. Boards, tasks, and collaboration made easy.",
    images: ["/main/dashboard.png"],
  },

  icons: {
    icon: "/main/favicon.ico",
  },

  robots: {
    index: true,
    follow: true,
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
        <NuqsAdapter>
          <QueryProviders>
            <Toaster />
            {children}
          </QueryProviders>
        </NuqsAdapter>
      </body>
    </html>
  );
}
