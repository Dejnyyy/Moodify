import "@/styles/globals.css";
import type { AppProps } from "next/app";

import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* Open Graph Meta Tags (for social sharing) */}
        <meta property="og:title" content="Dejny EU" />
        <meta property="og:description" content="dejny eu | dejny.eu website | Dejnyho stránka | Dejny's website | Moodify | Moodify website" />
        <meta property="og:image" content="/moodify.png" />
        <meta property="og:url" content="https://moodify.dejny.eu" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Meta Tags (for Twitter/X previews) */}
        <meta name="twitter:card" content="Moodify" />
        <meta name="twitter:title" content="Moodify" />
        <meta name="twitter:description" content="Moodify| Moodify website" />
        <meta name="twitter:image" content="/moodify.png" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2713534461037003"
     crossOrigin="anonymous"></script>
        <title> Moodify</title>
      </Head>

      <Component {...pageProps} />
    </>
  );
}
