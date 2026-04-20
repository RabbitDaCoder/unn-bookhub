export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  src: string;
  color: string;
}

export const musicTracks: MusicTrack[] = [
  { id: 'ambient-1', title: 'Quiet Library', artist: 'Ambient Sounds', genre: 'Ambient', duration: 'loop', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', color: '#7c3aed' },
  { id: 'ambient-2', title: 'Rain on Campus', artist: 'Nature Sounds', genre: 'Nature', duration: 'loop', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', color: '#0891b2' },
  { id: 'jazz-1', title: 'Study Jazz', artist: 'Lo-fi Collective', genre: 'Jazz', duration: 'loop', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', color: '#d97706' },
  { id: 'classical-1', title: 'Piano Focus', artist: 'Classical Winds', genre: 'Classical', duration: 'loop', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', color: '#059669' },
  { id: 'nature-1', title: 'Forest Morning', artist: 'Nature Sounds', genre: 'Nature', duration: 'loop', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', color: '#16a34a' },
  { id: 'lofi-1', title: 'Late Night Study', artist: 'Lo-fi Beats', genre: 'Lo-fi', duration: 'loop', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', color: '#9333ea' },
];
