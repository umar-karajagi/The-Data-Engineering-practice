import { SkillCourse, CareerPath } from '@/types';
import { DEEP_SKILL_COURSES } from './skillCoursesDeep';
import { REST_SKILL_COURSES } from './skillCoursesRest';
import { ALL_CAREER_PATHS } from './paths';

// Combine and sort all 25 skill courses by course ID (SF-01 to SF-25)
export const ALL_SKILL_COURSES: SkillCourse[] = [...DEEP_SKILL_COURSES, ...REST_SKILL_COURSES].sort((a, b) => {
  const numA = parseInt(a.id.replace('SF-', ''), 10);
  const numB = parseInt(b.id.replace('SF-', ''), 10);
  return numA - numB;
});

export { ALL_CAREER_PATHS };

export function getSkillCourseById(id: string): SkillCourse | undefined {
  return ALL_SKILL_COURSES.find(c => c.id.toLowerCase() === id.toLowerCase());
}

export function getCareerPathById(id: string): CareerPath | undefined {
  return ALL_CAREER_PATHS.find(p => p.id.toLowerCase() === id.toLowerCase());
}

export function getSkillCourseBySlug(slug: string): SkillCourse | undefined {
  return ALL_SKILL_COURSES.find(c => c.slug.toLowerCase() === slug.toLowerCase());
}

export function getCareerPathBySlug(slug: string): CareerPath | undefined {
  return ALL_CAREER_PATHS.find(p => p.slug.toLowerCase() === slug.toLowerCase());
}

export function getProductById(id: string): { type: 'skill' | 'path'; item: SkillCourse | CareerPath } | undefined {
  const course = getSkillCourseById(id);
  if (course) return { type: 'skill', item: course };
  const path = getCareerPathById(id);
  if (path) return { type: 'path', item: path };
  return undefined;
}

export function getAllProducts(): { courses: SkillCourse[]; paths: CareerPath[]; totalCount: number } {
  return {
    courses: ALL_SKILL_COURSES,
    paths: ALL_CAREER_PATHS,
    totalCount: ALL_SKILL_COURSES.length + ALL_CAREER_PATHS.length
  };
}

export function getCoursesForCareerPath(pathId: string): SkillCourse[] {
  const path = getCareerPathById(pathId);
  if (!path) return [];
  return path.orderedCourseIds
    .map(id => getSkillCourseById(id))
    .filter((c): c is SkillCourse => c !== undefined);
}

export function getCareerPathsReferencingCourse(courseId: string): CareerPath[] {
  return ALL_CAREER_PATHS.filter(p => p.orderedCourseIds.includes(courseId));
}
