import "@/styles/globals.css";
import type { AppProps } from "next/app";

import Head from "next/head";

const URL = "https://moodify.dejny.eu";
const TITLE = "Moodify – Music Recommendations Based on Your Mood";
const DESCRIPTION =
  "Answer seven quick yes/no questions and Moodify guesses your mood, then recommends a music genre and Spotify songs that fit how you feel right now.";

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://dejny.eu/#organization",
      name: "Dejny",
      url: "https://dejny.eu",
      logo: { "@type": "ImageObject", url: "https://dejny.eu/icon.png", width: 512, height: 512 },
      email: "dejny@dejny.eu",
      address: { "@type": "PostalAddress", addressLocality: "Praha", addressCountry: "CZ" },
      contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: "dejny@dejny.eu", availableLanguage: ["cs", "en"] },
      sameAs: [
        "https://github.com/Dejnyyy",
        "https://linkedin.com/in/dejny",
        "https://www.instagram.com/_dejny",
        "https://www.tiktok.com/@dejnyyy",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${URL}/#website`,
      name: "Moodify",
      url: URL,
      inLanguage: "en",
      publisher: { "@id": "https://dejny.eu/#organization" },
    },
    {
      "@type": "WebApplication",
      "@id": `${URL}/#app`,
      name: "Moodify",
      url: URL,
      description: DESCRIPTION,
      image: `${URL}/moodify.png`,
      applicationCategory: "MusicApplication",
      operatingSystem: "Any",
      inLanguage: ["en", "cs"],
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      author: { "@id": "https://dejny.eu/#organization" },
      publisher: { "@id": "https://dejny.eu/#organization" },
    },
  ],
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href={URL} />

        {/* Open Graph Meta Tags (for social sharing) */}
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image" content={`${URL}/moodify.png`} />
        <meta property="og:image:width" content="1024" />
        <meta property="og:image:height" content="1024" />
        <meta property="og:url" content={URL} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Moodify" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card Meta Tags (for Twitter/X previews) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={`${URL}/moodify.png`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2713534461037003"
     crossOrigin="anonymous"></script>
      </Head>

      <Component {...pageProps} />
    </>
  );
}
