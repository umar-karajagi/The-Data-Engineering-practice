import { ResearchSource } from '@/types';

export const CURRICULUM_RESEARCH_SOURCES: Record<string, ResearchSource> = {
  iit_madras_ds: {
    researchSourceTitle: 'BS in Data Science and Applications Academic Curriculum',
    researchInstitution: 'IIT Madras',
    researchSourceType: 'university_curriculum',
    sourceUrl: 'https://study.iitm.ac.in/ds/academics.html',
    lastReviewed: '2026-03-01',
    notes: 'Public syllabus signals: Discrete Math, Python Programming, Database Management Systems, Big Data Engineering, Machine Learning Practice.',
    versionOrAcademicYear: '2024-2026 Academic Catalog'
  },
  iit_bombay_cse: {
    researchSourceTitle: 'Undergraduate Computer Science & Engineering Curriculum (CS 213, CS 317, CS 387)',
    researchInstitution: 'IIT Bombay',
    researchSourceType: 'university_curriculum',
    sourceUrl: 'https://www.cse.iitb.ac.in/academics/courses.php',
    lastReviewed: '2026-02-15',
    notes: 'Rigorous data structures, relational algebra, SQL optimization, disk storage engines, query execution trees, and distributed computing.',
    versionOrAcademicYear: 'CS213 / CS317 Syllabus'
  },
  nitk_surathkal_de: {
    researchSourceTitle: 'Department of Information Technology B.Tech & M.Tech Course Structures',
    researchInstitution: 'NITK Surathkal',
    researchSourceType: 'university_curriculum',
    sourceUrl: 'https://infotech.nitk.ac.in/curriculum',
    lastReviewed: '2026-01-20',
    notes: 'Course coverage: Advanced Database Systems, Data Warehousing, OLAP architectures, Distributed Storage Systems.',
    versionOrAcademicYear: '2024-2025 Curriculum'
  },
  nptel_dbms: {
    researchSourceTitle: 'Database Management System & Big Data Computing Syllabus',
    researchInstitution: 'NPTEL / IIT Kharagpur',
    researchSourceType: 'nptel_syllabus',
    sourceUrl: 'https://nptel.ac.in/courses/106105175',
    lastReviewed: '2026-02-10',
    notes: 'Relational calculus, B+ trees, ACID guarantees, transaction isolation, map-reduce paradigms, distributed shuffle mechanics.',
    versionOrAcademicYear: 'NPTEL Online Certification'
  },
  apache_parquet_arrow: {
    researchSourceTitle: 'Apache Parquet & Apache Arrow Open Columnar Storage Specifications',
    researchInstitution: 'Apache Software Foundation',
    researchSourceType: 'standard_rfc',
    sourceUrl: 'https://parquet.apache.org/docs/file-format/',
    lastReviewed: '2026-01-15',
    notes: 'Dremel record shredding algorithm, dictionary encoding, run-length encoding, vector memory layout.',
    versionOrAcademicYear: 'Parquet Spec v2.10'
  },
  ansi_sql_standards: {
    researchSourceTitle: 'ISO/IEC 9075:2023 Information technology - Database languages - SQL',
    researchInstitution: 'ISO / IEC / ANSI',
    researchSourceType: 'standard_rfc',
    sourceUrl: 'https://www.iso.org/standard/76583.html',
    lastReviewed: '2025-12-01',
    notes: 'SQL window functions, CTE semantics, grouping sets, transaction isolation boundaries, recursive relations.',
    versionOrAcademicYear: 'ISO/IEC 9075:2023'
  }
};
