/**
 * DATAVEDA MASTER QA AUTOMATED TEST RUNNER
 * Principal SDET Automated Verification Suite
 * Executes rigorous mathematical and structural assertions across all 8 core domains.
 */

import { MASTER_CURRICULUM, TRACK_ROLES } from '../src/content/curriculum/masterCurriculum';
import { PRACTICE_PROBLEMS, STAR_TIERS, MODE_CONFIG, PracticeCategory, PracticeModeNumber } from '../src/content/practice/practiceProblems';
import { FOUNDATIONAL_BOOKS } from '../src/content/books';
import { PORTFOLIO_PROJECTS } from '../src/content/projects/portfolio';
import { TRACKER_TOPICS } from '../src/content/tracker/topics';

interface TestResult {
  suite: string;
  testId: string;
  name: string;
  status: 'PASSED' | 'FAILED';
  durationMs: number;
  details?: string;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

function runTest(suite: string, testId: string, name: string, fn: () => void) {
  const start = performance.now();
  try {
    fn();
    const durationMs = Math.round((performance.now() - start) * 100) / 100;
    results.push({ suite, testId, name, status: 'PASSED', durationMs });
    console.log(`  \x1b[32m✓\x1b[0m [${testId}] ${name} (${durationMs}ms)`);
  } catch (err: any) {
    const durationMs = Math.round((performance.now() - start) * 100) / 100;
    results.push({ suite, testId, name, status: 'FAILED', durationMs, error: err.message });
    console.error(`  \x1b[31m✗\x1b[0m [${testId}] ${name} (${durationMs}ms) -> ${err.message}`);
  }
}

console.log('\n========================================================================');
console.log('🧪 DATAVEDA MASTER QA SUITE: PRINCIPAL SDET VERIFICATION');
console.log('========================================================================\n');

// -----------------------------------------------------------------------------
// SUITE 2.1: Navigation & Roles
// -----------------------------------------------------------------------------
console.log('\x1b[36m▶ SUITE 2.1: Navigation & Role Shell Architecture\x1b[0m');

runTest('2.1 Navigation & Shell', 'NAV-01', 'Verify 3 primary track roles exist with valid target stages', () => {
  const roles = Object.keys(TRACK_ROLES);
  assert(roles.includes('engineer'), 'engineer role missing');
  assert(roles.includes('analyst'), 'analyst role missing');
  assert(roles.includes('scientist'), 'scientist role missing');

  assert(TRACK_ROLES.engineer.targetStages.length === 9, 'Senior Data Engineer track must target all 9 stages');
  assert(TRACK_ROLES.analyst.targetStages.length === 4, 'Data Analyst track must target 4 specific stages [1, 3, 6, 7]');
  assert(TRACK_ROLES.scientist.targetStages.length === 5, 'Data Scientist track must target 5 specific stages [1, 2, 3, 5, 7]');
});

// -----------------------------------------------------------------------------
// SUITE 2.2: Curriculum & Tracks (Mathematical Audit)
// -----------------------------------------------------------------------------
console.log('\n\x1b[36m▶ SUITE 2.2: Curriculum & 9 Terraces Mathematical Audit\x1b[0m');

runTest('2.2 Curriculum & Tracks', 'CURR-01', 'Assert exact 9 curriculum stages exist', () => {
  assert(MASTER_CURRICULUM.length === 9, `Expected 9 stages, found ${MASTER_CURRICULUM.length}`);
  MASTER_CURRICULUM.forEach((stage, idx) => {
    assert(stage.stageNumber === idx + 1, `Stage index mismatch: expected ${idx + 1}, got ${stage.stageNumber}`);
    assert(stage.milestone === `Stage 0${idx + 1}`, `Milestone label mismatch for stage ${idx + 1}`);
  });
});

runTest('2.2 Curriculum & Tracks', 'CURR-02', 'Assert exact 61 total curriculum videos across all stages', () => {
  const totalEpisodes = MASTER_CURRICULUM.reduce((sum, s) => sum + s.playlist.episodes.length, 0);
  assert(totalEpisodes === 61, `Expected exactly 61 episodes across curriculum, found ${totalEpisodes}`);
});

runTest('2.2 Curriculum & Tracks', 'CURR-03', 'Mathematical assertion: Sum of all 61 episode minutes = exactly 10,055 (167.6 Hours)', () => {
  let totalMinutes = 0;
  MASTER_CURRICULUM.forEach(stage => {
    stage.playlist.episodes.forEach(ep => {
      totalMinutes += ep.durationMinutes;
    });
  });

  const expectedMinutes = 10055;
  const expectedHours = (expectedMinutes / 60).toFixed(1); // 167.6
  const actualHours = (totalMinutes / 60).toFixed(1);

  assert(
    totalMinutes === expectedMinutes,
    `Total minute assertion failed: Expected ${expectedMinutes} min (${expectedHours}h), got ${totalMinutes} min (${actualHours}h)`
  );
});

runTest('2.2 Curriculum & Tracks', 'CURR-04', 'Assert all 61 episode YouTube IDs are non-empty and valid', () => {
  let checkedCount = 0;
  MASTER_CURRICULUM.forEach(stage => {
    stage.playlist.episodes.forEach(ep => {
      assert(typeof ep.youtubeId === 'string' && ep.youtubeId.trim().length >= 8, `Invalid YouTube ID in episode ${ep.id}: ${ep.youtubeId}`);
      assert(ep.youtubeUrl.includes(ep.youtubeId), `YouTube URL does not contain ID in episode ${ep.id}`);
      checkedCount++;
    });
  });
  assert(checkedCount === 61, `Verified only ${checkedCount}/61 video IDs`);
});

runTest('2.2 Curriculum & Tracks', 'CURR-05', 'Assert each stage contains topics and revision checklist criteria', () => {
  MASTER_CURRICULUM.forEach(stage => {
    assert(Array.isArray(stage.topics) && stage.topics.length >= 3, `Stage ${stage.milestone} has insufficient topics`);
    assert(Array.isArray(stage.revisionChecklist) && stage.revisionChecklist.length >= 2, `Stage ${stage.milestone} has insufficient revision items`);
  });
});

// -----------------------------------------------------------------------------
// SUITE 2.4: Practice Arena (500 Questions Audit)
// -----------------------------------------------------------------------------
console.log('\n\x1b[36m▶ SUITE 2.4: Practice Arena 500-Question Matrix Audit\x1b[0m');

runTest('2.4 Practice Arena', 'PRAC-01', 'Assert exactly 500 practice problems exist in total', () => {
  assert(PRACTICE_PROBLEMS.length === 500, `Expected exactly 500 practice problems, found ${PRACTICE_PROBLEMS.length}`);
});

runTest('2.4 Practice Arena', 'PRAC-02', 'Assert zero duplicate problem IDs across all 500 questions', () => {
  const seenIds = new Set<string>();
  const duplicates: string[] = [];
  PRACTICE_PROBLEMS.forEach(p => {
    if (seenIds.has(p.id)) {
      duplicates.push(p.id);
    }
    seenIds.add(p.id);
  });
  assert(duplicates.length === 0, `Found duplicate problem IDs: ${duplicates.join(', ')}`);
});

runTest('2.4 Practice Arena', 'PRAC-03', 'Assert exactly 100 questions per category across all 5 topic pillars', () => {
  const expectedCategories: PracticeCategory[] = ['SQL', 'Python', 'DSA', 'PySpark', 'Data Modeling'];
  expectedCategories.forEach(cat => {
    const count = PRACTICE_PROBLEMS.filter(p => p.category === cat).length;
    assert(count === 100, `Category ${cat} expected 100 problems, found ${count}`);
  });
});

runTest('2.4 Practice Arena', 'PRAC-04', 'Assert exactly 20 questions per mode ring (all 25 matrix cells = 20)', () => {
  const categories: PracticeCategory[] = ['SQL', 'Python', 'DSA', 'PySpark', 'Data Modeling'];
  const modes: PracticeModeNumber[] = [1, 2, 3, 4, 5];

  categories.forEach(cat => {
    modes.forEach(modeNum => {
      const cellProblems = PRACTICE_PROBLEMS.filter(p => p.category === cat && p.mode === modeNum);
      assert(cellProblems.length === 20, `Matrix Cell [${cat} x Mode ${modeNum}] expected 20 problems, found ${cellProblems.length}`);
    });
  });
});

runTest('2.4 Practice Arena', 'PRAC-05', 'Assert all 500 questions possess non-empty starterCode and solutionCode', () => {
  let checked = 0;
  PRACTICE_PROBLEMS.forEach(p => {
    assert(Boolean(p.starterCode && p.starterCode.trim().length > 5), `Problem ${p.id} missing valid starterCode`);
    assert(Boolean(p.solutionCode && p.solutionCode.trim().length > 5), `Problem ${p.id} missing valid solutionCode`);
    assert(Boolean(p.sampleOutput && p.sampleOutput.trim().length > 0), `Problem ${p.id} missing valid sampleOutput`);
    checked++;
  });
  assert(checked === 500, `Verified only ${checked}/500 questions`);
});

// -----------------------------------------------------------------------------
// SUITE 2.5: Star Scoreboard Thresholds
// -----------------------------------------------------------------------------
console.log('\n\x1b[36m▶ SUITE 2.5: Star Scoreboard Boundary & Tier Audit\x1b[0m');

runTest('2.5 Star Scoreboard', 'STAR-01', 'Verify 5 star tiers thresholds (100, 250, 450, 700, 1000)', () => {
  assert(STAR_TIERS.length === 5, `Expected 5 star tiers, found ${STAR_TIERS.length}`);
  const thresholds = STAR_TIERS.map(t => t.minScore);
  assert(thresholds[0] === 100, 'Tier 1 must unlock at 100 marks');
  assert(thresholds[1] === 250, 'Tier 2 must unlock at 250 marks');
  assert(thresholds[2] === 450, 'Tier 3 must unlock at 450 marks');
  assert(thresholds[3] === 700, 'Tier 4 must unlock at 700 marks');
  assert(thresholds[4] === 1000, 'Tier 5 must unlock at 1000 marks');
});

runTest('2.5 Star Scoreboard', 'STAR-02', 'Verify 5 mode configs with correct marks (10, 20, 30, 40, 50)', () => {
  assert(MODE_CONFIG[1].marks === 10, 'Mode 1 must award 10 marks');
  assert(MODE_CONFIG[2].marks === 20, 'Mode 2 must award 20 marks');
  assert(MODE_CONFIG[3].marks === 30, 'Mode 3 must award 30 marks');
  assert(MODE_CONFIG[4].marks === 40, 'Mode 4 must award 40 marks');
  assert(MODE_CONFIG[5].marks === 50, 'Mode 5 must award 50 marks');
});

// -----------------------------------------------------------------------------
// SUITE 2.6: Production Capstones
// -----------------------------------------------------------------------------
console.log('\n\x1b[36m▶ SUITE 2.6: Production Capstones Audit\x1b[0m');

runTest('2.6 Projects', 'PROJ-01', 'Verify production portfolio projects exist with complete architecture DAGs', () => {
  assert(PORTFOLIO_PROJECTS.length >= 3, `Expected at least 3 portfolio projects, found ${PORTFOLIO_PROJECTS.length}`);
  PORTFOLIO_PROJECTS.forEach(proj => {
    assert(Boolean(proj.title && proj.title.length > 5), `Project ${proj.id} has invalid title`);
    assert(Array.isArray(proj.technologies) && proj.technologies.length >= 3, `Project ${proj.id} has insufficient technologies`);
    assert(Array.isArray(proj.pipelineArchitecture) && proj.pipelineArchitecture.length >= 3, `Project ${proj.id} has insufficient architecture steps`);
  });
});

// -----------------------------------------------------------------------------
// SUITE 2.7: Library Vault (16 Items)
// -----------------------------------------------------------------------------
console.log('\n\x1b[36m▶ SUITE 2.7: Library 16-Item Vault Audit\x1b[0m');

runTest('2.7 Library Vault', 'LIB-01', 'Assert exactly 16 library items exist (14 books + prep guide + notebook)', () => {
  assert(FOUNDATIONAL_BOOKS.length === 16, `Expected exactly 16 library items, found ${FOUNDATIONAL_BOOKS.length}`);
  const seenIds = new Set<string>();
  FOUNDATIONAL_BOOKS.forEach(b => {
    assert(!seenIds.has(b.id), `Duplicate book ID found: ${b.id}`);
    seenIds.add(b.id);
    assert(Boolean(b.title && b.title.length > 3), `Book ${b.id} missing title`);
    assert(Boolean(b.author && b.author.length > 2), `Book ${b.id} missing author`);
  });
});

// -----------------------------------------------------------------------------
// SUITE 2.8: Interview Question Bank & Stage 09 Final Boss
// -----------------------------------------------------------------------------
console.log('\n\x1b[36m▶ SUITE 2.8: Interview Question Bank & Final Boss Topics\x1b[0m');

runTest('2.8 Final Boss Bank', 'BOSS-01', 'Assert high-stakes interview question bank contains topics with key interview questions', () => {
  assert(TRACKER_TOPICS.length >= 10, `Expected extensive topic list, found ${TRACKER_TOPICS.length}`);
  const staffQuestions = TRACKER_TOPICS.filter(t => t.difficulty === 'Staff DE' || t.priority === 'High');
  assert(staffQuestions.length >= 5, `Expected at least 5 Staff DE scenarios for Final Boss Gate, found ${staffQuestions.length}`);
  staffQuestions.forEach(q => {
    assert(Boolean(q.keyInterviewQuestions && q.keyInterviewQuestions.length > 0), `Topic ${q.id} missing key interview questions`);
  });
});

// -----------------------------------------------------------------------------
// SUMMARY & TRIAGE
// -----------------------------------------------------------------------------
console.log('\n========================================================================');
const passedCount = results.filter(r => r.status === 'PASSED').length;
const failedCount = results.filter(r => r.status === 'FAILED').length;
const totalDuration = Math.round(results.reduce((acc, r) => acc + r.durationMs, 0) * 100) / 100;

console.log(`📊 MASTER QA EXECUTION SUMMARY:`);
console.log(`   TOTAL TESTS: ${results.length}`);
console.log(`   \x1b[32mPASSED:      ${passedCount}\x1b[0m`);
console.log(`   \x1b[31mFAILED:      ${failedCount}\x1b[0m`);
console.log(`   TOTAL TIME:  ${totalDuration}ms`);
console.log('========================================================================\n');

if (failedCount > 0) {
  console.error('\x1b[31m🚨 BUILD BLOCKED: Failures detected in Master QA test plan.\x1b[0m');
  process.exit(1);
} else {
  console.log('\x1b[32m🎉 100% PASS: All principal-grade assertions satisfied. Verified for PROD/MASTER.\x1b[0m\n');
  process.exit(0);
}
