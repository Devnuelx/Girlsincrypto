import { DM_Sans, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import Providers from "./providers";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "girlsincrypto — Master Digital Wealth",
  description: "The ultimate digital guides to mastering crypto investing, DeFi, and Web3.",
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
    title: "girlsincrypto — Master Digital Wealth",
    description: "The ultimate digital guides to mastering crypto investing, DeFi, and Web3.",
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
    title: "girlsincrypto — Master Digital Wealth",
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
        className={`${dmSans.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable} antialiased`}
      >
        <Providers>
          <Toaster position="top-right" />
          {children}
        </Providers>
      </body>
    </html>
  );
}