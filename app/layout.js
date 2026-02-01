import { EB_Garamond, Geist, Geist_Mono, Playwrite_IN, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playwright = Playwrite_IN({
  variable: "--font-playwrite",
  subsets: ["latin"],
})

const Gara = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata = {
  title: "GirlsinCryptoHub | Empowering Women in Web3",
  description: "Join the leading community where women learn how to make money in crypto, share strategies, and support each other girl-to-girl.",
  keywords: [
    "Crypto for women",
    "Girls in crypto",
    "Web3 education",
    "Crypto hub",
    "Female crypto traders",
    "Blockchain community",
    "Crypto Nigeria",
  ],
  authors: [{ name: "GirlsinCryptoHub Team", url: "https://girlsincryptohub.com" }],
  creator: "GirlsinCryptoHub",
  publisher: "GirlsinCryptoHub",
  metadataBase: new URL("https://girlsincryptohub.com"),

  openGraph: {
    title: "GirlsinCryptoHub | Empowering Women in Web3",
    description: "Discover how women are making money in crypto. From beginners to pros, join a supportive and powerful female-led crypto community.",
    url: "https://girlsincryptohub.com",
    siteName: "GirlsinCryptoHub",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/pink.png",
        width: 1200,
        height: 630,
        alt: "GirlsinCryptoHub",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "GirlsinCryptoHub | Empowering Women in Web3",
    description: "A crypto space built by women, for women to Learn, grow, and earn.",
    creator: "@girlsincryptohub",
    images: ["/pink.png"],
  },

  // themeColor: "#ff69b4",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script strategy="afterInteractive" async src="https://www.googletagmanager.com/gtag/js?id=G-9MKL7K9WVE" />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-9MKL7K9WVE');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${playwright.variable}  ${Gara.variable} antialiased`}
      >
        <Providers>
          <Toaster position="top-right" />
          {children}
        </Providers>
      </body>
    </html>
  );
}