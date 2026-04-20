export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  genre: string;
  category: string;
  coverColor: string;
  wordCount: number;
  readTime: string;
  excerpt: string;
  featured: boolean;
}

export const libraryBooks: LibraryBook[] = [
  { id: 'lib-1', title: 'Things Fall Apart', author: 'Chinua Achebe', genre: 'Novels', category: 'Nigerian Literature', coverColor: '#92400e', wordCount: 58000, readTime: '4-5 hrs', excerpt: 'Okonkwo was well known throughout the nine villages and even beyond. His fame rested on solid personal achievements. As a young man of eighteen he had brought honour to his village by throwing Amalinze the Cat.', featured: true },
  { id: 'lib-2', title: 'The Lion and the Jewel', author: 'Wole Soyinka', genre: 'Poems', category: 'Nigerian Literature', coverColor: '#4338ca', wordCount: 8000, readTime: '30 min', excerpt: 'Morning. A clearing on the edge of the market, dominated by an immense odan tree.', featured: true },
  { id: 'lib-3', title: 'Purple Hibiscus', author: 'Chimamanda Adichie', genre: 'Novels', category: 'Nigerian Literature', coverColor: '#7c2d8e', wordCount: 94000, readTime: '6-7 hrs', excerpt: 'Things started to fall apart at home when my brother, Jaja, did not go to communion and Papa flung his heavy missal across the room.', featured: true },
  { id: 'lib-4', title: 'Weep Not Child', author: 'Ngugi wa Thiongo', genre: 'Novels', category: 'Classics', coverColor: '#065f46', wordCount: 40000, readTime: '3 hrs', excerpt: 'Nyokabi called him. She was a small woman who had once been beautiful.', featured: false },
  { id: 'lib-5', title: 'The Trials of Brother Jero', author: 'Wole Soyinka', genre: 'Short Stories', category: 'Nigerian Literature', coverColor: '#1e40af', wordCount: 12000, readTime: '45 min', excerpt: 'I am a Prophet. A prophet by birth and by inclination.', featured: false },
  { id: 'lib-6', title: 'Season of Anomy', author: 'Wole Soyinka', genre: 'Novels', category: 'Nigerian Literature', coverColor: '#92400e', wordCount: 70000, readTime: '5 hrs', excerpt: 'Ofeyi stirred and shifted the weight of his body against the knotted bark of the cacao tree.', featured: false },
  { id: 'lib-7', title: 'Piano and Drums', author: 'Gabriel Okara', genre: 'Poetry', category: 'Nigerian Literature', coverColor: '#1e3a5f', wordCount: 2000, readTime: '10 min', excerpt: 'When at break of day at a riverside I hear jungle drums telegraphing the mystic rhythm, urgent, raw.', featured: false },
  { id: 'lib-8', title: 'The Old Man and the Sea', author: 'Ernest Hemingway', genre: 'Classics', category: 'Classics', coverColor: '#1f3a5f', wordCount: 27000, readTime: '2 hrs', excerpt: 'He was an old man who fished alone in a skiff in the Gulf Stream and he had gone eighty-four days now without taking a fish.', featured: false },
  { id: 'lib-9', title: 'The Midnight Crisis', author: 'UNN Student', genre: 'Short Stories', category: 'Student Works', coverColor: '#4c1d95', wordCount: 4000, readTime: '20 min', excerpt: 'The night was still young, but the campus had already fallen asleep.', featured: false },
  { id: 'lib-10', title: 'Ode to the Niger River', author: 'Adichie M.', genre: 'Poetry', category: 'Nigerian Literature', coverColor: '#164e63', wordCount: 800, readTime: '5 min', excerpt: 'O great river, you who have seen the ages pass like shadows on your waters.', featured: false },
  { id: 'lib-11', title: 'Arrow of God', author: 'Chinua Achebe', genre: 'Novels', category: 'Nigerian Literature', coverColor: '#78350f', wordCount: 80000, readTime: '5-6 hrs', excerpt: 'This was the third nightfall since he began to look for signs of the new moon.', featured: false },
  { id: 'lib-12', title: 'Second-Class Citizen', author: 'Buchi Emecheta', genre: 'Novels', category: 'Nigerian Literature', coverColor: '#831843', wordCount: 55000, readTime: '4 hrs', excerpt: 'It had all started with her father. He named her Adah.', featured: false },
];

export const libraryGenres = ['All', 'Poems', 'Poetry', 'Novels', 'Short Stories', 'Classics', 'Nigerian Literature', 'Student Works'];

export function getLibraryBookById(id: string) {
  return libraryBooks.find(b => b.id === id) || null;
}

export function getLibraryBooksByGenre(genre: string) {
  if (genre === 'All') return libraryBooks;
  return libraryBooks.filter(b => b.genre === genre || b.category === genre);
}
