import "./globals.css";
import { Archivo, Atkinson_Hyperlegible, IBM_Plex_Mono } from "next/font/google";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["400", "700"],
  display: "swap",
});

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  variable: "--font-atkinson",
  weight: ["400", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "600"],
  display: "swap",
});

export const metadata = {
  title: "RestockPilot | Autonomous Shop Purchasing Agent",
  description:
    "AI purchasing agent for independent cafes and shops. Searches supplier catalogs, verifies budgets, and submits orders to PayPal Sandbox checkout for owner approval.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${atkinson.variable} ${ibmPlexMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
              try {
                var saved = localStorage.getItem('restockpilot-theme');
                if (saved) {
                  document.documentElement.setAttribute('data-theme', saved);
                } else {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              } catch (e) {}
            })()`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
