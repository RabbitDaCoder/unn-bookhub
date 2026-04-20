import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useMusicStore } from "../store/useStore";

export function MusicPlayer() {
  const location = useLocation();
  const {
    tracks,
    currentTrackIndex,
    isPlaying,
    volume,
    progress,
    showPlayer,
    play,
    pause,
    toggle,
    next,
    prev,
    selectTrack,
    setVolume,
    setProgress,
    setShowPlayer,
  } = useMusicStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isLibraryRoute =
    location.pathname.startsWith("/library") ||
    location.pathname.startsWith("/reader");

  useEffect(() => {
    if (isLibraryRoute) {
      setShowPlayer(true);
    } else {
      setShowPlayer(false);
      pause();
    }
  }, [isLibraryRoute, setShowPlayer, pause]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }
    const audio = audioRef.current;
    audio.src = tracks[currentTrackIndex]?.src || "";
    if (isPlaying) audio.play().catch(() => {});
    return () => {
      audio.pause();
    };
  }, [currentTrackIndex, tracks]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    audio.addEventListener("timeupdate", update);
    return () => audio.removeEventListener("timeupdate", update);
  }, [setProgress]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  };

  const currentTrack = tracks[currentTrackIndex];

  if (!showPlayer) return null;

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-50 bg-ink-900/96 backdrop-blur-2xl border-t border-music-light/20 transition-all duration-300 ${isPlaying ? "shadow-music" : ""}`}
    >
      <div
        className="h-[3px] bg-white/10 cursor-pointer"
        onClick={handleProgressClick}
      >
        <div
          className="h-full bg-gradient-to-r from-music-DEFAULT to-amber-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-12 h-[68px] flex items-center gap-4 md:gap-8">
        {/* Track info */}
        <div className="flex items-center gap-3 min-w-0 flex-1 md:flex-none md:w-56">
          <div className="w-10 h-10 rounded-xl bg-music-DEFAULT/40 flex-shrink-0 flex items-center justify-center text-xl relative overflow-hidden">
            🎵
            {isPlaying && (
              <div className="absolute inset-0 flex items-end justify-center gap-px pb-1">
                {[0.4, 0.8, 0.5, 1, 0.6].map((h, i) => (
                  <div
                    key={i}
                    className="w-[3px] bg-music-light/60 rounded-full animate-music-pulse"
                    style={{
                      height: `${h * 60}%`,
                      animationDelay: `${i * 120}ms`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-bold truncate">
              {currentTrack?.title}
            </p>
            <p className="text-white/40 text-xs truncate">
              {currentTrack?.genre}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 flex-1 justify-center">
          <button
            onClick={prev}
            className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white transition-colors text-lg"
          >
            ⏮
          </button>
          <button
            onClick={toggle}
            className="w-11 h-11 rounded-full bg-amber-500 hover:bg-amber-600 flex items-center justify-center text-ink-900 text-xl shadow-amber transition-all duration-200 hover:scale-105 flex-shrink-0"
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button
            onClick={next}
            className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white transition-colors text-lg"
          >
            ⏭
          </button>
        </div>

        {/* Volume + track selector */}
        <div className="hidden md:flex items-center gap-4 w-56 justify-end">
          <span className="text-white/40 text-sm">🔊</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24 accent-music-DEFAULT"
          />
          <select
            value={currentTrackIndex}
            onChange={(e) => selectTrack(Number(e.target.value))}
            className="bg-ink-600 border border-white/10 rounded-lg text-white/60 text-xs px-2 py-1 max-w-[100px] truncate"
          >
            {tracks.map((t, i) => (
              <option key={t.id} value={i}>
                {t.title}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
