import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tizardin.mu - Plant Identifier",
  description: "Identify plants using AI",
  manifest: "/manifest.json",
  themeColor: "#4caf50",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tizardin Plant Pal",
  },
  applicationName: "Tizardin Plants Identifier",
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=5">
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4caf50" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={inter.className}>
        {children}
        <Script
          id="register-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
