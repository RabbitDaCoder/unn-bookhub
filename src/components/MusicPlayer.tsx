import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, X, ChevronUp, ChevronDown, Repeat, Shuffle } from 'lucide-react';
import { PLAYLIST } from '../constants';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  return (
    <div className={cn(
      "fixed bottom-0 left-0 w-full z-[100] transition-all duration-500",
      isExpanded ? "h-64" : "h-20"
    )}>
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />

      <div className="absolute inset-0 bg-bg-dark/95 backdrop-blur-xl border-t border-white/10 shadow-2xl flex flex-col">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/10 cursor-pointer group relative">
          <div 
            className="h-full bg-secondary transition-all duration-300" 
            style={{ width: `${progress}%` }} 
          />
          <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity bg-white/20" />
        </div>

        <div className="flex-grow flex items-center justify-between px-6 lg:px-12">
          {/* Track Info */}
          <div className="flex items-center space-x-4 w-1/3">
            <div className={cn(
              "w-12 h-12 rounded-full border-2 border-secondary flex items-center justify-center overflow-hidden transition-transform duration-1000",
              isPlaying && "animate-[spin_4s_linear_infinite]"
            )}>
              <Music className="w-6 h-6 text-secondary" />
            </div>
            <div className="overflow-hidden">
              <h4 className="text-white font-bold text-sm truncate">{currentTrack.title}</h4>
              <p className="text-white/60 text-[10px] uppercase tracking-widest truncate">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center space-y-2 w-1/3">
            <div className="flex items-center space-x-6">
              <button onClick={handlePrev} className="text-white/60 hover:text-white transition-colors">
                <SkipBack className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 bg-secondary hover:bg-secondary/90 text-white rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>
              <button onClick={handleNext} className="text-white/60 hover:text-white transition-colors">
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
            <div className="hidden lg:flex items-center space-x-2 text-[10px] text-white/40 font-bold uppercase tracking-widest">
              <span>Now Playing in Nnamdi Azikiwe Library</span>
              <div className="flex space-x-0.5 items-end h-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ height: isPlaying ? [4, 12, 6, 10, 4] : 4 }}
                    transition={{ repeat: Infinity, duration: 0.5 + i * 0.1 }}
                    className="w-0.5 bg-secondary"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Volume & Toggle */}
          <div className="flex items-center justify-end space-x-6 w-1/3">
            <div className="hidden md:flex items-center space-x-3">
              <button onClick={() => setIsMuted(!isMuted)} className="text-white/60 hover:text-white transition-colors">
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 accent-secondary h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
              />
            </div>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all"
            >
              {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Expanded View (Playlist) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex-grow px-12 pb-8 overflow-y-auto scrollbar-hide"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PLAYLIST.map((track, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                      setCurrentTrackIndex(i);
                      setIsPlaying(true);
                    }}
                    className={cn(
                      "flex items-center space-x-4 p-3 rounded-xl transition-all text-left group",
                      currentTrackIndex === i ? "bg-secondary text-white" : "hover:bg-white/5 text-white/60"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      currentTrackIndex === i ? "bg-white/20" : "bg-white/5 group-hover:bg-white/10"
                    )}>
                      <Music className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm">{track.title}</h5>
                      <p className="text-[10px] uppercase tracking-widest opacity-60">{track.artist}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
