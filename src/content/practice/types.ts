export type PracticeCategory = 'SQL' | 'Python' | 'DSA' | 'PySpark' | 'Data Modeling';

export type PracticeModeNumber = 1 | 2 | 3 | 4 | 5;

export type PracticeModeName = 'Fundamental' | 'Core' | 'Advanced' | 'Expert' | 'Master';

export type PracticeDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface PracticeProblem {
  id: string;
  title: string;
  category: PracticeCategory;
  mode: PracticeModeNumber; // 1 to 5
  modeName: PracticeModeName;
  difficulty: PracticeDifficulty;
  marks: number; // 10, 20, 30, 40, 50
  company: string;
  acceptanceRate: string;
  submissionsCount: string;
  tags: string[];
  description: string;
  sampleInput: string;
  sampleOutput: string;
  starterCode: string;
  solutionCode: string;
  explanation: string;
}

export interface TopicStarTier {
  stars: number; // 1 to 5
  minScore: number;
  badgeName: string;
  badgeColor: string;
}

export const STAR_TIERS: TopicStarTier[] = [
  { stars: 1, minScore: 100, badgeName: 'Bronze Apprentice', badgeColor: 'text-amber-700 bg-amber-100 border-amber-300' },
  { stars: 2, minScore: 250, badgeName: 'Silver Practitioner', badgeColor: 'text-slate-700 bg-slate-200 border-slate-400' },
  { stars: 3, minScore: 450, badgeName: 'Gold Specialist', badgeColor: 'text-amber-500 bg-amber-50 border-amber-300' },
  { stars: 4, minScore: 700, badgeName: 'Platinum Expert', badgeColor: 'text-cyan-500 bg-cyan-50 border-cyan-300' },
  { stars: 5, minScore: 1000, badgeName: 'Diamond Master', badgeColor: 'text-purple-600 bg-purple-50 border-purple-300' }
];

export const MODE_CONFIG: Record<PracticeModeNumber, { name: PracticeModeName; marks: number; difficulty: PracticeDifficulty; description: string }> = {
  1: { name: 'Fundamental', marks: 10, difficulty: 'Easy', description: 'Core syntax, baseline operations & warmup problems' },
  2: { name: 'Core', marks: 20, difficulty: 'Easy', description: 'Real-world data manipulation, joins & key idioms' },
  3: { name: 'Advanced', marks: 30, difficulty: 'Medium', description: 'Complex aggregations, windowing, OOP & algorithms' },
  4: { name: 'Expert', marks: 40, difficulty: 'Medium', description: 'System performance, memory tuning, edge cases & indexing' },
  5: { name: 'Master', marks: 50, difficulty: 'Hard', description: 'Staff architect challenges, skew optimization & concurrency' }
};
