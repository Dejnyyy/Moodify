// pages/index.tsx
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import SongRecommendation from "./components/SongRecommendations";
const questions = [
  { cs: "Cítíš se energicky?", en: "Do you feel energetic?", value: 2 },
  { cs: "Chceš si spíš odpočinout?", en: "Would you rather relax?", value: -2 },
  { cs: "Máš chuť tančit?", en: "Do you feel like dancing?", value: 2 },
  { cs: "Cítíš se smutně?", en: "Do you feel sad?", value: -3 },
  { cs: "Cítíš se motivovaný/á?", en: "Do you feel motivated?", value: 2 },
  { cs: "Máš chuť na relax?", en: "Do you crave some relaxation?", value: -1 },
  { cs: "Jsi dnes pozitivně naladěn/a?", en: "Are you feeling positive today?", value: 2 },
];

const asciiArt: Record<string, string> = {
  energický: "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
  pozitivní: "(＾▽＾)",
  klidný: "(◡‿◡✿)",
  smutný: "(╥_╥)",
  melancholický: "(._.)",
};
const moodSongs: Record<string, { title: string; artist: string; spotify: string; apple: string }[]> = {
  energický: [
    {
      title: "Blinding Lights",
      artist: "The Weeknd",
      spotify: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b",
      apple: "https://music.apple.com/us/album/blinding-lights/1488406714?i=1488406717",
    },
    {
      title: "Titanium",
      artist: "David Guetta ft. Sia",
      spotify: "https://open.spotify.com/track/61TgDF8aB75wPz9RIs7y3x",
      apple: "https://music.apple.com/us/album/titanium-feat-sia/1440827103?i=1440827107",
    },
    // Add 3 more...
  ],
  pozitivní: [
    {
      title: "Sunroof",
      artist: "Nicky Youre, dazy",
      spotify: "https://open.spotify.com/track/1dGr1c8CrMLDpV6mPbImSI",
      apple: "https://music.apple.com/us/album/sunroof/1622725531?i=1622725535",
    },
    // 4 more...
  ],
  klidný: [
    {
      title: "Snowman",
      artist: "Sia",
      spotify: "https://open.spotify.com/track/3Zwu2K0Qa5sT6teCCHPShP",
      apple: "https://music.apple.com/us/album/snowman/1540357763?i=1540357765",
    },
  ],
  smutný: [
    {
      title: "Someone Like You",
      artist: "Adele",
      spotify: "https://open.spotify.com/track/4kflIGfjdZJW4ot2ioixTB",
      apple: "https://music.apple.com/us/album/someone-like-you/420075073?i=420075085",
    },
  ],
  melancholický: [
    {
      title: "River Flows In You",
      artist: "Yiruma",
      spotify: "https://open.spotify.com/track/1Mxqyy3pSjf8kZZL4QVxS0",
      apple: "https://music.apple.com/us/album/river-flows-in-you/290399963?i=290400001",
    },
  ],
};

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<{ mood: string; genre: string } | null>(null);
  const [songIndex, setSongIndex] = useState(0);

  const [language, setLanguage] = useState<"cs" | "en">("cs");
  const [darkMode, setDarkMode] = useState(true);
  const [videoDone, setVideoDone] = useState(false);

  const fullVideoRef = useRef<HTMLVideoElement | null>(null);
  const miniVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (fullVideoRef.current) {
      fullVideoRef.current.onended = () => {
        setVideoDone(true);
        miniVideoRef.current?.play();
      };
    }
  }, []);

  const handleAnswer = (yes: boolean) => {
    const value = questions[current].value;
    const adjustedScore = yes ? value : -Math.floor(value / 2);
    const newScore = score + adjustedScore;

    if (current + 1 < questions.length) {
      setScore(newScore);
      setCurrent(current + 1);
    } else {
      const mood = calculateMood(newScore);
      setResult(mood);
    }
  };

  const calculateMood = (s: number) => {
    if (s >= 6) return { mood: "energický", genre: language === "cs" ? "Electro/Pop" : "Electro/Pop" };
    if (s >= 2) return { mood: "pozitivní", genre: language === "cs" ? "Indie/Rock" : "Indie/Rock" };
    if (s >= -1) return { mood: "klidný", genre: language === "cs" ? "Lo-fi/Chillstep" : "Lo-fi/Chillstep" };
    if (s >= -5) return { mood: "smutný", genre: language === "cs" ? "Akustické balady" : "Acoustic ballads" };
    return { mood: "melancholický", genre: language === "cs" ? "Instrumentální klavír" : "Instrumental piano" };
  };

  const restart = () => {
    setCurrent(0);
    setScore(0);
    setResult(null);
  };

  return (
    <>
      {/* Fullscreen loading video */}
      <AnimatePresence>
        {!videoDone && (
          <motion.div
            key="loading-video"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            <video
              ref={fullVideoRef}
              src="/moodify.mp4"
              autoPlay
              className="w-2/3 h-2/3 object-fit"
              muted
              playsInline
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini floating video (shrunk) */}
      {videoDone && (
        <motion.video
          ref={miniVideoRef}
          src="/moodify.mp4"
          muted
          loop
          autoPlay
          className="fixed rounded-xl pointer-events-none shadow-xl"
          initial={{ width: "100vw", height: "100vh", top: 0, left: 0 }}
          animate={{
            width: "240px",
            height: "170px",
            top: "20px",
            left: "50%",
            x: "-50%",
            y: 0,
          }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{ objectFit: "cover" }}
        />
      )}

      {/* Main App UI */}
      <main
        className={clsx(
          "min-h-screen text-center flex items-center justify-center px-4 py-10 transition-colors duration-500",
          darkMode
            ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white"
            : "bg-gradient-to-r from-[#e0c3fc] via-[#8ec5fc] to-[#f9f9f9] text-gray-900"
        )}
      >
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={result ? "result" : current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="relative">
              <div className="absolute inset-0 rounded-xl p-[2px] animate-spin-slow z-0 pointer-events-none">
              <div className="w-full h-full rounded-xl" />
            </div>
                <div
                  className={clsx(
                    "relative z-10 rounded-xl p-6 backdrop-blur-md shadow-xl",
                    darkMode ? "bg-white/10 text-white" : "bg-white/70 text-black"
                  )}
                >
                  {!result ? (
                    <>
                      <button
                        onClick={() => setLanguage(language === "cs" ? "en" : "cs")}
                        className="rounded-full absolute top-5 left-6 cursor-pointer hover:scale-125 duration-100 text-lg"
                      >
                        {language === "cs" ? "🇨🇿" : "🇬🇧"}
                      </button>
                      <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="rounded-full absolute top-5 right-6 cursor-pointer hover:scale-125 duration-100 text-lg"
                      >
                        {darkMode ? "☀️" : "🌙"}
                      </button>

                      <h1 className="text-2xl font-semibold mb-4">Moodify</h1>
                      <p className="text-lg mb-6">{questions[current][language]}</p>
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => handleAnswer(true)}
                          className="px-6 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold"
                        >
                          {language === "cs" ? "Ano" : "Yes"}
                        </button>
                        <button
                          onClick={() => handleAnswer(false)}
                          className="px-6 py-2 rounded-full bg-black hover:bg-red-600 text-white font-semibold"
                        >
                          {language === "cs" ? "Ne" : "No"}
                        </button>
                      </div>
                      <div className="w-full mt-6 bg-gray-600/40 h-2 rounded">
                        <div
                          className="bg-blue-400 h-2 rounded transition-all duration-300"
                          style={{
                            width: `${((current + 1) / questions.length) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="text-sm mt-2">
                        {current + 1} / {questions.length}
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold mb-2">
                        {language === "cs" ? `Tvoje nálada je:` : `Your mood is:`}{" "}
                        <span className="uppercase">
                          {language === "cs"
                            ? result.mood
                            : {
                                energický: "energetic",
                                pozitivní: "positive",
                                klidný: "calm",
                                smutný: "sad",
                                melancholický: "melancholic",
                              }[result.mood]}
                        </span>
                        <button
                        onClick={() => setLanguage(language === "cs" ? "en" : "cs")}
                        className="rounded-full absolute top-5 left-6 cursor-pointer hover:scale-125 duration-100 text-lg"
                      >
                        {language === "cs" ? "🇨🇿" : "🇬🇧"}
                      </button>
                      <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="rounded-full absolute top-5 right-6 cursor-pointer hover:scale-125 duration-100 text-lg"
                      >
                        {darkMode ? "☀️" : "🌙"}
                      </button>
                      </h2>
                      <p className="text-lg mb-4">
                        {language === "cs"
                          ? `Doporučený žánr:`
                          : `Recommended genre:`}{" "}
                        <b>🎧 {result.genre}</b>
                      </p>
                      <pre className="text-4xl">{asciiArt[result.mood]}</pre>
                    </>
                  )}
                  
                </div>
                <div className="">
                {result && <SongRecommendation mood={result.mood} />}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}
