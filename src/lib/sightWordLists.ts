/**
 * Sight Word Lists for Early Readers
 * Based on Dolch and Fry word lists for pre-K through 1st grade
 */

export interface SightWordLevel {
  level: number;
  name: string;
  words: string[];
}

// Pre-K / Kindergarten sight words (most common, easiest)
export const SIGHT_WORD_LEVELS: SightWordLevel[] = [
  {
    level: 1,
    name: 'First Words',
    words: ['a', 'I', 'the', 'to', 'and', 'is', 'it', 'you', 'my', 'we'],
  },
  {
    level: 2,
    name: 'Color Words',
    words: ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'black', 'white', 'brown'],
  },
  {
    level: 3,
    name: 'Action Words',
    words: ['go', 'see', 'look', 'come', 'run', 'play', 'like', 'can', 'said', 'went'],
  },
  {
    level: 4,
    name: 'People Words',
    words: ['he', 'she', 'me', 'we', 'they', 'him', 'her', 'mom', 'dad', 'friend'],
  },
  {
    level: 5,
    name: 'Question Words',
    words: ['what', 'where', 'who', 'when', 'why', 'how', 'are', 'was', 'were', 'do'],
  },
  {
    level: 6,
    name: 'Everyday Words',
    words: ['up', 'down', 'in', 'out', 'on', 'off', 'big', 'little', 'good', 'day'],
  },
  {
    level: 7,
    name: 'More Words',
    words: ['this', 'that', 'here', 'there', 'all', 'some', 'one', 'two', 'three', 'no'],
  },
  {
    level: 8,
    name: 'Story Words',
    words: ['have', 'has', 'had', 'make', 'made', 'want', 'help', 'find', 'say', 'yes'],
  },
];

// Get all words up to a certain level
export function getWordsUpToLevel(level: number): string[] {
  return SIGHT_WORD_LEVELS
    .filter((l) => l.level <= level)
    .flatMap((l) => l.words);
}

// Get words for a specific level
export function getWordsForLevel(level: number): string[] {
  const levelData = SIGHT_WORD_LEVELS.find((l) => l.level === level);
  return levelData?.words ?? [];
}

// Get level info
export function getLevelInfo(level: number): SightWordLevel | undefined {
  return SIGHT_WORD_LEVELS.find((l) => l.level === level);
}

// Get a random word from a level range
export function getRandomWord(minLevel: number = 1, maxLevel: number = 1): string {
  const words = SIGHT_WORD_LEVELS
    .filter((l) => l.level >= minLevel && l.level <= maxLevel)
    .flatMap((l) => l.words);
  return words[Math.floor(Math.random() * words.length)];
}

// Get multiple random words (without duplicates)
export function getRandomWords(count: number, minLevel: number = 1, maxLevel: number = 1): string[] {
  const words = SIGHT_WORD_LEVELS
    .filter((l) => l.level >= minLevel && l.level <= maxLevel)
    .flatMap((l) => l.words);

  const shuffled = [...words].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export const TOTAL_LEVELS = SIGHT_WORD_LEVELS.length;
