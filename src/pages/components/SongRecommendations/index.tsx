// components/SongRecommendation.tsx
import { useEffect, useState } from "react";

interface Song {
  name: string;
  artist: string;
  image: string;
  url: string;
  embed: string;
}

export default function SongRecommendation({ mood }: { mood: string }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchSongs = async () => {
      const res = await fetch(`/api/spotify?mood=${encodeURIComponent(mood)}`);
      const data = await res.json();
      setSongs(data.songs || []);
    };

    fetchSongs();
  }, [mood]);

  const current = songs[index];

  if (songs.length === 0)
    return <p className="mt-6">Loading recommendations...</p>;

  return (
    <div className="mt-8 rounded-xl z-50 p-4 bg-white/20 text-left">
      <p className="text-sm font-semibold mb-2">🎧 Song Suggestion</p>
      <iframe
        src={current.embed}
        className="mt-4 w-full rounded-xl"
        height="80"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
      <button
        onClick={() => setIndex((i) => (i + 1) % songs.length)}
        className="mt-4 px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-800 text-white"
      >
        Next
      </button>
    </div>
  );
}
