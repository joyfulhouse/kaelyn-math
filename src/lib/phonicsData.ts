/**
 * Phonics curriculum data and utilities
 * Covers: letter sounds, CVC words, blends, digraphs, and word families
 */

// Phoneme classification for color-coding
export type PhonemeType = 'consonant' | 'vowel' | 'blend' | 'digraph';

// Individual phoneme definition
export interface Phoneme {
  symbol: string; // 'b', 'sh', 'bl', etc.
  sound: string; // Phonetic pronunciation for TTS
  type: PhonemeType;
  exampleWord: string;
}

// Word with phoneme breakdown for blending practice
export interface PhonicsWord {
  word: string;
  phonemes: string[]; // References to phoneme symbols
  category: string; // 'short-a', '-at family', etc.
}

// Unit type determines content structure
export type UnitType =
  | 'letter-sounds'
  | 'cvc-words'
  | 'blends'
  | 'digraphs'
  | 'word-families';

// Curriculum unit structure
export interface PhonicsUnit {
  unit: number;
  name: string;
  description: string;
  type: UnitType;
  phonemes?: Phoneme[]; // For letter-sounds, blends, digraphs
  words?: PhonicsWord[]; // For CVC words and word families
  familyPattern?: string; // For word families: '-at', '-ig', etc.
}

// Color mapping for phoneme types
export const PHONEME_COLORS: Record<PhonemeType, string> = {
  consonant: 'bg-sky',
  vowel: 'bg-coral',
  blend: 'bg-sage',
  digraph: 'bg-yellow',
};

export const PHONEME_TEXT_COLORS: Record<PhonemeType, string> = {
  consonant: 'text-sky',
  vowel: 'text-coral',
  blend: 'text-sage',
  digraph: 'text-yellow',
};

// All phonemes for lookup
const PHONEME_MAP = new Map<string, Phoneme>();

// Unit 1: Consonant Sounds
const CONSONANT_PHONEMES: Phoneme[] = [
  { symbol: 'b', sound: 'buh', type: 'consonant', exampleWord: 'ball' },
  { symbol: 'c', sound: 'kuh', type: 'consonant', exampleWord: 'cat' },
  { symbol: 'd', sound: 'duh', type: 'consonant', exampleWord: 'dog' },
  { symbol: 'f', sound: 'fff', type: 'consonant', exampleWord: 'fish' },
  { symbol: 'g', sound: 'guh', type: 'consonant', exampleWord: 'goat' },
  { symbol: 'h', sound: 'huh', type: 'consonant', exampleWord: 'hat' },
  { symbol: 'j', sound: 'juh', type: 'consonant', exampleWord: 'jam' },
  { symbol: 'k', sound: 'kuh', type: 'consonant', exampleWord: 'kite' },
  { symbol: 'l', sound: 'lll', type: 'consonant', exampleWord: 'lamp' },
  { symbol: 'm', sound: 'mmm', type: 'consonant', exampleWord: 'moon' },
  { symbol: 'n', sound: 'nnn', type: 'consonant', exampleWord: 'nest' },
  { symbol: 'p', sound: 'puh', type: 'consonant', exampleWord: 'pig' },
  { symbol: 'q', sound: 'kwuh', type: 'consonant', exampleWord: 'queen' },
  { symbol: 'r', sound: 'rrr', type: 'consonant', exampleWord: 'rain' },
  { symbol: 's', sound: 'sss', type: 'consonant', exampleWord: 'sun' },
  { symbol: 't', sound: 'tuh', type: 'consonant', exampleWord: 'top' },
  { symbol: 'v', sound: 'vvv', type: 'consonant', exampleWord: 'van' },
  { symbol: 'w', sound: 'wuh', type: 'consonant', exampleWord: 'web' },
  { symbol: 'x', sound: 'ks', type: 'consonant', exampleWord: 'box' },
  { symbol: 'y', sound: 'yuh', type: 'consonant', exampleWord: 'yes' },
  { symbol: 'z', sound: 'zzz', type: 'consonant', exampleWord: 'zoo' },
];

// Unit 2: Short Vowel Sounds
const VOWEL_PHONEMES: Phoneme[] = [
  { symbol: 'a', sound: 'ah', type: 'vowel', exampleWord: 'apple' },
  { symbol: 'e', sound: 'eh', type: 'vowel', exampleWord: 'egg' },
  { symbol: 'i', sound: 'ih', type: 'vowel', exampleWord: 'igloo' },
  { symbol: 'o', sound: 'ah', type: 'vowel', exampleWord: 'octopus' },
  { symbol: 'u', sound: 'uh', type: 'vowel', exampleWord: 'umbrella' },
];

// Unit 8: Consonant Blends
const BLEND_PHONEMES: Phoneme[] = [
  { symbol: 'bl', sound: 'bluh', type: 'blend', exampleWord: 'blue' },
  { symbol: 'br', sound: 'bruh', type: 'blend', exampleWord: 'brown' },
  { symbol: 'cl', sound: 'kluh', type: 'blend', exampleWord: 'clap' },
  { symbol: 'cr', sound: 'kruh', type: 'blend', exampleWord: 'crab' },
  { symbol: 'dr', sound: 'druh', type: 'blend', exampleWord: 'drum' },
  { symbol: 'fl', sound: 'fluh', type: 'blend', exampleWord: 'flag' },
  { symbol: 'fr', sound: 'fruh', type: 'blend', exampleWord: 'frog' },
  { symbol: 'gl', sound: 'gluh', type: 'blend', exampleWord: 'glass' },
  { symbol: 'gr', sound: 'gruh', type: 'blend', exampleWord: 'green' },
  { symbol: 'pl', sound: 'pluh', type: 'blend', exampleWord: 'play' },
  { symbol: 'pr', sound: 'pruh', type: 'blend', exampleWord: 'pretty' },
  { symbol: 'sl', sound: 'sluh', type: 'blend', exampleWord: 'slide' },
  { symbol: 'sm', sound: 'smuh', type: 'blend', exampleWord: 'smile' },
  { symbol: 'sn', sound: 'snuh', type: 'blend', exampleWord: 'snake' },
  { symbol: 'sp', sound: 'spuh', type: 'blend', exampleWord: 'spot' },
  { symbol: 'st', sound: 'stuh', type: 'blend', exampleWord: 'star' },
  { symbol: 'sw', sound: 'swuh', type: 'blend', exampleWord: 'swim' },
  { symbol: 'tr', sound: 'truh', type: 'blend', exampleWord: 'tree' },
];

// Unit 9: Digraphs (two letters, one sound)
const DIGRAPH_PHONEMES: Phoneme[] = [
  { symbol: 'ch', sound: 'chuh', type: 'digraph', exampleWord: 'chip' },
  { symbol: 'sh', sound: 'shh', type: 'digraph', exampleWord: 'ship' },
  { symbol: 'th', sound: 'thh', type: 'digraph', exampleWord: 'think' },
  { symbol: 'wh', sound: 'wuh', type: 'digraph', exampleWord: 'whale' },
  { symbol: 'ph', sound: 'fff', type: 'digraph', exampleWord: 'phone' },
  { symbol: 'ck', sound: 'kuh', type: 'digraph', exampleWord: 'duck' },
  { symbol: 'ng', sound: 'ng', type: 'digraph', exampleWord: 'sing' },
];

// Word family endings as special phonemes
const WORD_FAMILY_PHONEMES: Phoneme[] = [
  { symbol: 'at', sound: 'at', type: 'vowel', exampleWord: 'cat' },
  { symbol: 'an', sound: 'an', type: 'vowel', exampleWord: 'can' },
  { symbol: 'ap', sound: 'ap', type: 'vowel', exampleWord: 'cap' },
  { symbol: 'ad', sound: 'ad', type: 'vowel', exampleWord: 'dad' },
  { symbol: 'ig', sound: 'ig', type: 'vowel', exampleWord: 'pig' },
  { symbol: 'in', sound: 'in', type: 'vowel', exampleWord: 'pin' },
  { symbol: 'it', sound: 'it', type: 'vowel', exampleWord: 'sit' },
  { symbol: 'ip', sound: 'ip', type: 'vowel', exampleWord: 'tip' },
  { symbol: 'op', sound: 'op', type: 'vowel', exampleWord: 'hop' },
  { symbol: 'ot', sound: 'ot', type: 'vowel', exampleWord: 'hot' },
  { symbol: 'og', sound: 'og', type: 'vowel', exampleWord: 'dog' },
  { symbol: 'ug', sound: 'ug', type: 'vowel', exampleWord: 'bug' },
  { symbol: 'un', sound: 'un', type: 'vowel', exampleWord: 'sun' },
  { symbol: 'ut', sound: 'ut', type: 'vowel', exampleWord: 'cut' },
  { symbol: 'et', sound: 'et', type: 'vowel', exampleWord: 'pet' },
  { symbol: 'en', sound: 'en', type: 'vowel', exampleWord: 'hen' },
];

// Initialize phoneme map
function initPhonemeMap() {
  if (PHONEME_MAP.size > 0) return;
  [
    ...CONSONANT_PHONEMES,
    ...VOWEL_PHONEMES,
    ...BLEND_PHONEMES,
    ...DIGRAPH_PHONEMES,
    ...WORD_FAMILY_PHONEMES,
  ].forEach((p) => PHONEME_MAP.set(p.symbol, p));
}

// Full curriculum
export const PHONICS_UNITS: PhonicsUnit[] = [
  // Unit 1: Consonant Sounds
  {
    unit: 1,
    name: 'Consonant Sounds',
    description: 'Learn the sounds that consonants make',
    type: 'letter-sounds',
    phonemes: CONSONANT_PHONEMES,
  },

  // Unit 2: Short Vowel Sounds
  {
    unit: 2,
    name: 'Vowel Sounds',
    description: 'Learn the short sounds of vowels',
    type: 'letter-sounds',
    phonemes: VOWEL_PHONEMES,
  },

  // Unit 3: Short A Words
  {
    unit: 3,
    name: 'Short A Words',
    description: 'Sound out words with short A',
    type: 'cvc-words',
    words: [
      { word: 'cat', phonemes: ['c', 'a', 't'], category: 'short-a' },
      { word: 'hat', phonemes: ['h', 'a', 't'], category: 'short-a' },
      { word: 'bat', phonemes: ['b', 'a', 't'], category: 'short-a' },
      { word: 'map', phonemes: ['m', 'a', 'p'], category: 'short-a' },
      { word: 'cap', phonemes: ['c', 'a', 'p'], category: 'short-a' },
      { word: 'sad', phonemes: ['s', 'a', 'd'], category: 'short-a' },
      { word: 'dad', phonemes: ['d', 'a', 'd'], category: 'short-a' },
      { word: 'pan', phonemes: ['p', 'a', 'n'], category: 'short-a' },
      { word: 'can', phonemes: ['c', 'a', 'n'], category: 'short-a' },
      { word: 'man', phonemes: ['m', 'a', 'n'], category: 'short-a' },
    ],
  },

  // Unit 4: Short E Words
  {
    unit: 4,
    name: 'Short E Words',
    description: 'Sound out words with short E',
    type: 'cvc-words',
    words: [
      { word: 'bed', phonemes: ['b', 'e', 'd'], category: 'short-e' },
      { word: 'red', phonemes: ['r', 'e', 'd'], category: 'short-e' },
      { word: 'pen', phonemes: ['p', 'e', 'n'], category: 'short-e' },
      { word: 'hen', phonemes: ['h', 'e', 'n'], category: 'short-e' },
      { word: 'ten', phonemes: ['t', 'e', 'n'], category: 'short-e' },
      { word: 'pet', phonemes: ['p', 'e', 't'], category: 'short-e' },
      { word: 'wet', phonemes: ['w', 'e', 't'], category: 'short-e' },
      { word: 'jet', phonemes: ['j', 'e', 't'], category: 'short-e' },
      { word: 'get', phonemes: ['g', 'e', 't'], category: 'short-e' },
      { word: 'leg', phonemes: ['l', 'e', 'g'], category: 'short-e' },
    ],
  },

  // Unit 5: Short I Words
  {
    unit: 5,
    name: 'Short I Words',
    description: 'Sound out words with short I',
    type: 'cvc-words',
    words: [
      { word: 'pig', phonemes: ['p', 'i', 'g'], category: 'short-i' },
      { word: 'big', phonemes: ['b', 'i', 'g'], category: 'short-i' },
      { word: 'dig', phonemes: ['d', 'i', 'g'], category: 'short-i' },
      { word: 'pin', phonemes: ['p', 'i', 'n'], category: 'short-i' },
      { word: 'win', phonemes: ['w', 'i', 'n'], category: 'short-i' },
      { word: 'sit', phonemes: ['s', 'i', 't'], category: 'short-i' },
      { word: 'hit', phonemes: ['h', 'i', 't'], category: 'short-i' },
      { word: 'bit', phonemes: ['b', 'i', 't'], category: 'short-i' },
      { word: 'tip', phonemes: ['t', 'i', 'p'], category: 'short-i' },
      { word: 'rip', phonemes: ['r', 'i', 'p'], category: 'short-i' },
    ],
  },

  // Unit 6: Short O Words
  {
    unit: 6,
    name: 'Short O Words',
    description: 'Sound out words with short O',
    type: 'cvc-words',
    words: [
      { word: 'dog', phonemes: ['d', 'o', 'g'], category: 'short-o' },
      { word: 'log', phonemes: ['l', 'o', 'g'], category: 'short-o' },
      { word: 'fog', phonemes: ['f', 'o', 'g'], category: 'short-o' },
      { word: 'hop', phonemes: ['h', 'o', 'p'], category: 'short-o' },
      { word: 'top', phonemes: ['t', 'o', 'p'], category: 'short-o' },
      { word: 'mop', phonemes: ['m', 'o', 'p'], category: 'short-o' },
      { word: 'pot', phonemes: ['p', 'o', 't'], category: 'short-o' },
      { word: 'hot', phonemes: ['h', 'o', 't'], category: 'short-o' },
      { word: 'not', phonemes: ['n', 'o', 't'], category: 'short-o' },
      { word: 'cot', phonemes: ['c', 'o', 't'], category: 'short-o' },
    ],
  },

  // Unit 7: Short U Words
  {
    unit: 7,
    name: 'Short U Words',
    description: 'Sound out words with short U',
    type: 'cvc-words',
    words: [
      { word: 'bug', phonemes: ['b', 'u', 'g'], category: 'short-u' },
      { word: 'hug', phonemes: ['h', 'u', 'g'], category: 'short-u' },
      { word: 'rug', phonemes: ['r', 'u', 'g'], category: 'short-u' },
      { word: 'sun', phonemes: ['s', 'u', 'n'], category: 'short-u' },
      { word: 'run', phonemes: ['r', 'u', 'n'], category: 'short-u' },
      { word: 'fun', phonemes: ['f', 'u', 'n'], category: 'short-u' },
      { word: 'cup', phonemes: ['c', 'u', 'p'], category: 'short-u' },
      { word: 'cut', phonemes: ['c', 'u', 't'], category: 'short-u' },
      { word: 'nut', phonemes: ['n', 'u', 't'], category: 'short-u' },
      { word: 'but', phonemes: ['b', 'u', 't'], category: 'short-u' },
    ],
  },

  // Unit 8: Consonant Blends
  {
    unit: 8,
    name: 'Consonant Blends',
    description: 'Two consonants that blend together',
    type: 'blends',
    phonemes: BLEND_PHONEMES,
  },

  // Unit 9: Digraphs
  {
    unit: 9,
    name: 'Digraphs',
    description: 'Two letters that make one sound',
    type: 'digraphs',
    phonemes: DIGRAPH_PHONEMES,
  },

  // Unit 10: -at Family
  {
    unit: 10,
    name: '-at Family',
    description: 'Words that rhyme with cat',
    type: 'word-families',
    familyPattern: '-at',
    words: [
      { word: 'cat', phonemes: ['c', 'at'], category: '-at family' },
      { word: 'bat', phonemes: ['b', 'at'], category: '-at family' },
      { word: 'hat', phonemes: ['h', 'at'], category: '-at family' },
      { word: 'mat', phonemes: ['m', 'at'], category: '-at family' },
      { word: 'rat', phonemes: ['r', 'at'], category: '-at family' },
      { word: 'sat', phonemes: ['s', 'at'], category: '-at family' },
      { word: 'flat', phonemes: ['fl', 'at'], category: '-at family' },
      { word: 'that', phonemes: ['th', 'at'], category: '-at family' },
    ],
  },

  // Unit 11: -ig Family
  {
    unit: 11,
    name: '-ig Family',
    description: 'Words that rhyme with pig',
    type: 'word-families',
    familyPattern: '-ig',
    words: [
      { word: 'pig', phonemes: ['p', 'ig'], category: '-ig family' },
      { word: 'big', phonemes: ['b', 'ig'], category: '-ig family' },
      { word: 'dig', phonemes: ['d', 'ig'], category: '-ig family' },
      { word: 'fig', phonemes: ['f', 'ig'], category: '-ig family' },
      { word: 'wig', phonemes: ['w', 'ig'], category: '-ig family' },
      { word: 'jig', phonemes: ['j', 'ig'], category: '-ig family' },
      { word: 'twig', phonemes: ['tw', 'ig'], category: '-ig family' },
    ],
  },

  // Unit 12: -op Family
  {
    unit: 12,
    name: '-op Family',
    description: 'Words that rhyme with hop',
    type: 'word-families',
    familyPattern: '-op',
    words: [
      { word: 'hop', phonemes: ['h', 'op'], category: '-op family' },
      { word: 'top', phonemes: ['t', 'op'], category: '-op family' },
      { word: 'mop', phonemes: ['m', 'op'], category: '-op family' },
      { word: 'pop', phonemes: ['p', 'op'], category: '-op family' },
      { word: 'stop', phonemes: ['st', 'op'], category: '-op family' },
      { word: 'shop', phonemes: ['sh', 'op'], category: '-op family' },
      { word: 'chop', phonemes: ['ch', 'op'], category: '-op family' },
      { word: 'drop', phonemes: ['dr', 'op'], category: '-op family' },
    ],
  },

  // Unit 13: -un Family
  {
    unit: 13,
    name: '-un Family',
    description: 'Words that rhyme with sun',
    type: 'word-families',
    familyPattern: '-un',
    words: [
      { word: 'sun', phonemes: ['s', 'un'], category: '-un family' },
      { word: 'run', phonemes: ['r', 'un'], category: '-un family' },
      { word: 'fun', phonemes: ['f', 'un'], category: '-un family' },
      { word: 'bun', phonemes: ['b', 'un'], category: '-un family' },
      { word: 'gun', phonemes: ['g', 'un'], category: '-un family' },
      { word: 'spun', phonemes: ['sp', 'un'], category: '-un family' },
      { word: 'stun', phonemes: ['st', 'un'], category: '-un family' },
    ],
  },

  // Unit 14: Blend Words Practice
  {
    unit: 14,
    name: 'Blend Words',
    description: 'Practice words with blends',
    type: 'cvc-words',
    words: [
      { word: 'stop', phonemes: ['st', 'o', 'p'], category: 'blends' },
      { word: 'clap', phonemes: ['cl', 'a', 'p'], category: 'blends' },
      { word: 'frog', phonemes: ['fr', 'o', 'g'], category: 'blends' },
      { word: 'drum', phonemes: ['dr', 'u', 'm'], category: 'blends' },
      { word: 'swim', phonemes: ['sw', 'i', 'm'], category: 'blends' },
      { word: 'flag', phonemes: ['fl', 'a', 'g'], category: 'blends' },
      { word: 'glad', phonemes: ['gl', 'a', 'd'], category: 'blends' },
      { word: 'trip', phonemes: ['tr', 'i', 'p'], category: 'blends' },
      { word: 'snap', phonemes: ['sn', 'a', 'p'], category: 'blends' },
      { word: 'plan', phonemes: ['pl', 'a', 'n'], category: 'blends' },
    ],
  },

  // Unit 15: Digraph Words Practice
  {
    unit: 15,
    name: 'Digraph Words',
    description: 'Practice words with digraphs',
    type: 'cvc-words',
    words: [
      { word: 'ship', phonemes: ['sh', 'i', 'p'], category: 'digraphs' },
      { word: 'chip', phonemes: ['ch', 'i', 'p'], category: 'digraphs' },
      { word: 'thin', phonemes: ['th', 'i', 'n'], category: 'digraphs' },
      { word: 'shop', phonemes: ['sh', 'o', 'p'], category: 'digraphs' },
      { word: 'chop', phonemes: ['ch', 'o', 'p'], category: 'digraphs' },
      { word: 'that', phonemes: ['th', 'a', 't'], category: 'digraphs' },
      { word: 'whip', phonemes: ['wh', 'i', 'p'], category: 'digraphs' },
      { word: 'when', phonemes: ['wh', 'e', 'n'], category: 'digraphs' },
      { word: 'duck', phonemes: ['d', 'u', 'ck'], category: 'digraphs' },
      { word: 'back', phonemes: ['b', 'a', 'ck'], category: 'digraphs' },
    ],
  },
];

// Add 'tw' blend for twig
PHONEME_MAP.set('tw', {
  symbol: 'tw',
  sound: 'twuh',
  type: 'blend',
  exampleWord: 'twin',
});

// Initialize on module load
initPhonemeMap();

// ============ Utility Functions ============

/**
 * Get all phonemes as a Map for lookup
 */
export function getAllPhonemes(): Map<string, Phoneme> {
  initPhonemeMap();
  return PHONEME_MAP;
}

/**
 * Get a single phoneme by symbol
 */
export function getPhoneme(symbol: string): Phoneme | undefined {
  initPhonemeMap();
  return PHONEME_MAP.get(symbol);
}

/**
 * Get a phonics unit by number
 */
export function getPhonicsUnit(unit: number): PhonicsUnit | undefined {
  return PHONICS_UNITS.find((u) => u.unit === unit);
}

/**
 * Get total number of units
 */
export function getTotalUnits(): number {
  return PHONICS_UNITS.length;
}

/**
 * Check if a unit has phonemes (letter-sounds, blends, digraphs)
 */
export function isPhonemeUnit(unit: PhonicsUnit): boolean {
  return (
    unit.type === 'letter-sounds' ||
    unit.type === 'blends' ||
    unit.type === 'digraphs'
  );
}

/**
 * Check if a unit has words (CVC words, word families)
 */
export function isWordUnit(unit: PhonicsUnit): boolean {
  return unit.type === 'cvc-words' || unit.type === 'word-families';
}

/**
 * Get the color class for a phoneme type
 */
export function getPhonemeColor(type: PhonemeType): string {
  return PHONEME_COLORS[type];
}

/**
 * Get the text color class for a phoneme type
 */
export function getPhonemeTextColor(type: PhonemeType): string {
  return PHONEME_TEXT_COLORS[type];
}

/**
 * Segment a word into displayable phoneme parts with colors
 */
export interface WordSegment {
  segment: string;
  phoneme: Phoneme;
  color: string;
}

export function segmentWord(word: PhonicsWord): WordSegment[] {
  initPhonemeMap();
  return word.phonemes.map((symbol) => {
    const phoneme = PHONEME_MAP.get(symbol);
    if (!phoneme) {
      // Fallback for unknown symbols
      return {
        segment: symbol,
        phoneme: {
          symbol,
          sound: symbol,
          type: 'consonant' as PhonemeType,
          exampleWord: '',
        },
        color: PHONEME_COLORS.consonant,
      };
    }
    return {
      segment: symbol,
      phoneme,
      color: PHONEME_COLORS[phoneme.type],
    };
  });
}

/**
 * Generate a quiz for sound recognition
 * Returns the target phoneme and 3 distractors
 */
export interface SoundQuiz {
  target: Phoneme;
  options: Phoneme[];
  correctIndex: number;
}

export function generateSoundQuiz(
  targetPhoneme: Phoneme,
  pool: Phoneme[]
): SoundQuiz {
  // Get 3 random distractors from the same type
  const distractors = pool
    .filter((p) => p.symbol !== targetPhoneme.symbol)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  // If not enough distractors of same type, pad with others
  if (distractors.length < 3) {
    const allPhonemes = [...PHONEME_MAP.values()];
    const extras = allPhonemes
      .filter(
        (p) =>
          p.symbol !== targetPhoneme.symbol &&
          !distractors.some((d) => d.symbol === p.symbol)
      )
      .sort(() => Math.random() - 0.5)
      .slice(0, 3 - distractors.length);
    distractors.push(...extras);
  }

  // Combine and shuffle
  const options = [targetPhoneme, ...distractors].sort(
    () => Math.random() - 0.5
  );
  const correctIndex = options.findIndex(
    (o) => o.symbol === targetPhoneme.symbol
  );

  return { target: targetPhoneme, options, correctIndex };
}

/**
 * Generate a word blending quiz
 * Returns a random word from the unit
 */
export function getRandomWord(unit: PhonicsUnit): PhonicsWord | undefined {
  if (!unit.words || unit.words.length === 0) return undefined;
  const idx = Math.floor(Math.random() * unit.words.length);
  return unit.words[idx];
}

/**
 * Get a random phoneme from a unit
 */
export function getRandomPhoneme(unit: PhonicsUnit): Phoneme | undefined {
  if (!unit.phonemes || unit.phonemes.length === 0) return undefined;
  const idx = Math.floor(Math.random() * unit.phonemes.length);
  return unit.phonemes[idx];
}

/**
 * Get a random fallback word from any word unit except the specified one
 */
export function getRandomFallbackWord(
  excludeUnitNumber: number
): PhonicsWord | undefined {
  const wordUnits = PHONICS_UNITS.filter(
    (u) => isWordUnit(u) && u.unit !== excludeUnitNumber
  );
  if (wordUnits.length === 0) return undefined;
  const randomUnit = wordUnits[Math.floor(Math.random() * wordUnits.length)];
  return getRandomWord(randomUnit);
}

/**
 * Get word distractors for quiz (words from same unit, excluding target)
 */
export function getWordDistractors(
  unit: PhonicsUnit,
  targetWord: string,
  count: number
): PhonicsWord[] {
  if (!unit.words) return [];
  const available = unit.words.filter((w) => w.word !== targetWord);
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get units grouped by type for navigation
 */
export interface UnitGroup {
  type: UnitType;
  label: string;
  units: PhonicsUnit[];
}

export function getUnitGroups(): UnitGroup[] {
  return [
    {
      type: 'letter-sounds',
      label: 'Letter Sounds',
      units: PHONICS_UNITS.filter((u) => u.type === 'letter-sounds'),
    },
    {
      type: 'cvc-words',
      label: 'CVC Words',
      units: PHONICS_UNITS.filter((u) => u.type === 'cvc-words'),
    },
    {
      type: 'blends',
      label: 'Blends',
      units: PHONICS_UNITS.filter((u) => u.type === 'blends'),
    },
    {
      type: 'digraphs',
      label: 'Digraphs',
      units: PHONICS_UNITS.filter((u) => u.type === 'digraphs'),
    },
    {
      type: 'word-families',
      label: 'Word Families',
      units: PHONICS_UNITS.filter((u) => u.type === 'word-families'),
    },
  ];
}

/**
 * Shuffle an array of words (Fisher-Yates algorithm)
 * Use this utility instead of inline Math.random() to satisfy React Compiler
 */
export function shuffleWords(words: PhonicsWord[]): PhonicsWord[] {
  const shuffled = [...words];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
