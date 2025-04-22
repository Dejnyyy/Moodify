import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const questions = [
  { question: "Cítíš se energicky?", value: 2 },
  { question: "Chceš si spíš odpočinout?", value: -2 },
  { question: "Máš chuť tančit?", value: 2 },
  { question: "Cítíš se smutně?", value: -3 },
  { question: "Cítíš se motivovaný/á?", value: 2 },
  { question: "Máš chuť na relax?", value: -1 },
  { question: "Jsi dnes pozitivně naladěn/a?", value: 2 },
];

const asciiArt: Record<string, string> = {
  energický: "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
  pozitivní: "(＾▽＾)",
  klidný: "(◡‿◡✿)",
  smutný: "(╥_╥)",
  melancholický: "(._.)",
};

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<{ mood: string; genre: string } | null>(null);

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
    if (s >= 6) return { mood: "energický", genre: "Electro/Pop" };
    if (s >= 2) return { mood: "pozitivní", genre: "Indie/Rock" };
    if (s >= -1) return { mood: "klidný", genre: "Lo-fi/Chillstep" };
    if (s >= -5) return { mood: "smutný", genre: "Akustické balady" };
    return { mood: "melancholický", genre: "Instrumentální klavír" };
  };

  const restart = () => {
    setCurrent(0);
    setScore(0);
    setResult(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-[#e0c3fc] via-[#8ec5fc] to-[#f9f9f9] flex items-center justify-center px-4 py-10 ">
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
              {/* Spinning gradient border ring */}
              <div className="absolute inset-0 rounded-xl p-[2px] animate-spin-slow z-0">
                <div className="w-full h-full rounded-xl" />
              </div>

              {/* Static content box */}
              <div className="relative z-10 rounded-xl p-6 backdrop-blur-md bg-black/30 text-white shadow-xl">
                {!result ? (
                  <>
                    <h1 className="text-2xl font-semibold mb-4 text-white">Moodify 🎵</h1>
                    <p className="text-lg mb-6 text-gray-200">
                      {questions[current].question}
                    </p>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleAnswer(true)}
                        className="px-6 py-2 rounded bg-green-500 hover:bg-green-600 text-white font-semibold"
                      >
                        Ano
                      </button>
                      <button
                        onClick={() => handleAnswer(false)}
                        className="px-6 py-2 rounded bg-red-500 hover:bg-red-600 text-white font-semibold"
                      >
                        Ne
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
                    <p className="text-sm text-gray-300 mt-2">
                      {current + 1} / {questions.length}
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-2">
                      Tvoje nálada je:{" "}
                      <span className="uppercase">{result.mood}</span>
                    </h2>
                    <p className="text-lg mb-4">
                      Doporučený žánr: <b>🎧 {result.genre}</b>
                    </p>
                    <pre className="text-4xl">{asciiArt[result.mood]}</pre>
                    <button
                      onClick={restart}
                      className="mt-6 px-5 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded font-semibold"
                    >
                      Zkusit znovu
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
