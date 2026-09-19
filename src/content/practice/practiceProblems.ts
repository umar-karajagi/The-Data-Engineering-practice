import { 
  PracticeProblem, 
  PracticeCategory, 
  PracticeModeNumber, 
  PracticeModeName, 
  PracticeDifficulty, 
  TopicStarTier, 
  STAR_TIERS, 
  MODE_CONFIG 
} from './types';

import { SQL_PRACTICE_PROBLEMS } from './questions/sqlQuestions';
import { PYTHON_PRACTICE_PROBLEMS } from './questions/pythonQuestions';
import { DSA_PRACTICE_PROBLEMS } from './questions/dsaQuestions';
import { PYSPARK_PRACTICE_PROBLEMS } from './questions/pysparkQuestions';
import { DATA_MODELING_PRACTICE_PROBLEMS } from './questions/dataModelingQuestions';

// Export types for seamless consumption across components
export * from './types';
export { SQL_PRACTICE_PROBLEMS } from './questions/sqlQuestions';
export { PYTHON_PRACTICE_PROBLEMS } from './questions/pythonQuestions';
export { DSA_PRACTICE_PROBLEMS } from './questions/dsaQuestions';
export { PYSPARK_PRACTICE_PROBLEMS } from './questions/pysparkQuestions';
export { DATA_MODELING_PRACTICE_PROBLEMS } from './questions/dataModelingQuestions';

// Aggregated Master List of 500 Questions (100 per topic x 5 topics, 20 per mode)
export const PRACTICE_PROBLEMS: PracticeProblem[] = [
  ...SQL_PRACTICE_PROBLEMS,
  ...PYTHON_PRACTICE_PROBLEMS,
  ...DSA_PRACTICE_PROBLEMS,
  ...PYSPARK_PRACTICE_PROBLEMS,
  ...DATA_MODELING_PRACTICE_PROBLEMS
];

/**
 * Filter problems by category (100 problems per topic)
 */
export function getProblemsByCategory(category: PracticeCategory): PracticeProblem[] {
  return PRACTICE_PROBLEMS.filter(p => p.category === category);
}

/**
 * Filter problems by category and mode (20 problems per mode)
 */
export function getProblemsByCategoryAndMode(
  category: PracticeCategory, 
  mode: PracticeModeNumber
): PracticeProblem[] {
  return PRACTICE_PROBLEMS.filter(p => p.category === category && p.mode === mode);
}

/**
 * Calculate user's score, star tier, and progress for a specific topic
 */
export function getTopicStats(category: PracticeCategory, solvedIds: Set<string> | string[]) {
  const solvedSet = solvedIds instanceof Set ? solvedIds : new Set(solvedIds);
  const topicProblems = getProblemsByCategory(category);
  
  let totalScore = 0;
  let solvedCount = 0;
  
  for (const prob of topicProblems) {
    if (solvedSet.has(prob.id)) {
      totalScore += prob.marks;
      solvedCount++;
    }
  }

  // Calculate Star Rating (1 to 5 Stars) based on points
  let currentStars = 0;
  let currentTier: TopicStarTier | null = null;
  let nextTier: TopicStarTier | null = STAR_TIERS[0];

  for (let i = STAR_TIERS.length - 1; i >= 0; i--) {
    if (totalScore >= STAR_TIERS[i].minScore) {
      currentStars = STAR_TIERS[i].stars;
      currentTier = STAR_TIERS[i];
      nextTier = i < STAR_TIERS.length - 1 ? STAR_TIERS[i + 1] : null;
      break;
    }
  }

  // Max score across all 5 modes = 20*10 + 20*20 + 20*30 + 20*40 + 20*50 = 3,000 points
  const maxPossibleScore = 3000;
  const diamondScore = 1000; // 5-Star Diamond threshold
  const progressToNext = nextTier 
    ? Math.min(100, Math.round(((totalScore - (currentTier ? currentTier.minScore : 0)) / ((nextTier.minScore - (currentTier ? currentTier.minScore : 0)) || 1)) * 100))
    : 100;

  return {
    category,
    totalScore,
    maxPossibleScore,
    diamondScore,
    solvedCount,
    totalCount: topicProblems.length,
    stars: currentStars,
    currentTier,
    nextTier,
    progressToNext,
    isDiamondMaster: currentStars === 5
  };
}

/**
 * Calculate grand stats across all 5 topics
 */
export function getGrandStats(solvedIds: Set<string> | string[]) {
  const categories: PracticeCategory[] = ['SQL', 'Python', 'DSA', 'PySpark', 'Data Modeling'];
  const topicStats = categories.map(cat => getTopicStats(cat, solvedIds));
  
  const totalScore = topicStats.reduce((sum, t) => sum + t.totalScore, 0);
  const totalSolved = topicStats.reduce((sum, t) => sum + t.solvedCount, 0);
  const totalStars = topicStats.reduce((sum, t) => sum + t.stars, 0);
  const maxPossibleScore = topicStats.reduce((sum, t) => sum + t.maxPossibleScore, 0);

  return {
    totalScore,
    maxPossibleScore,
    totalSolved,
    totalProblems: PRACTICE_PROBLEMS.length, // 500
    totalStars,
    maxPossibleStars: categories.length * 5, // 25
    topicStats
  };
}
