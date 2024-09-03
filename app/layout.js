import "./globals.css";

export const metadata = {
  title: "Tizardin.mu - Plant Identifier",
  description: "Identify plants using AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
