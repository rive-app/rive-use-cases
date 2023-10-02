import "./globals.css";
import { Inter } from "@next/font/google";

const inter = Inter({
  subsets: ["latin"],
  // this will be the css variable
  variable: "--font-inter",
});

export const metadata = {
  title: "Avatar Creator",
  description: "Rive avatar creator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <link
        rel="preload"
        href="/avatar_demo.riv"
        as="fetch"
        crossOrigin="anonymous"
      />
      <body className="bg-[#121212]">{children}</body>
    </html>
  );
}
