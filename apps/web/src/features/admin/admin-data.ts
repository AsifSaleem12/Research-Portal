import {
  departments,
  groups,
  newsItems,
  projects,
  publications,
  researchers,
  researchAreas,
  theses,
} from '../../lib/mock-data';
import type {
  AdminRecord,
  AdminSettingsSection,
  AdminUser,
  AnalyticsPoint,
} from '../../types/admin';

export const adminUsers: AdminUser[] = [
  {
    id: 'user-super-admin',
    name: 'Areeba Ahmed',
    email: 'areeba.ahmed@lgu.edu.pk',
    role: 'Super Admin',
    status: 'Active',
  },
  {
    id: 'user-oric',
    name: 'Bilal Raza',
    email: 'bilal.raza@lgu.edu.pk',
    role: 'ORIC Staff',
    status: 'Active',
  },
  {
    id: 'user-coordinator',
    name: 'Maham Siddiqui',
    email: 'maham.siddiqui@lgu.edu.pk',
    role: 'Department Coordinator',
    status: 'Active',
    department: 'Computer Science',
  },
  {
    id: 'user-researcher',
    name: 'Dr. Sara Khalid',
    email: 'sara.khalid@lgu.edu.pk',
    role: 'Researcher',
    status: 'Active',
    department: 'Computer Science',
  },
];

export const researcherRecords: AdminRecord[] = researchers.map((researcher, index) => ({
  id: researcher.id,
  title: `${researcher.firstName} ${researcher.lastName}`,
  slug: researcher.slug,
  summary: researcher.expertiseSummary,
  department: researcher.departmentSlug.replace('-', ' '),
  owner: researcher.email,
  type: 'Researcher Profile',
  workflow: index === 0 ? 'Published' : index === 1 ? 'Approved' : 'Under Review',
  updatedAt: `2026-04-${String(index + 8).padStart(2, '0')}`,
}));

export const publicationRecords: AdminRecord[] = publications.map((publication, index) => ({
  id: publication.id,
  title: publication.title,
  slug: publication.slug,
  summary: publication.abstract,
  department: publication.departmentSlug.replace('-', ' '),
  owner: publication.authorSlugs[0],
  type: publication.publicationType,
  workflow: index === 0 ? 'Published' : index === 1 ? 'Under Review' : 'Submitted',
  updatedAt: publication.publicationDate,
}));

export const projectRecords: AdminRecord[] = projects.map((project, index) => ({
  id: project.id,
  title: project.title,
  slug: project.slug,
  summary: project.abstract,
  department: project.departmentSlug.replace('-', ' '),
  owner: project.principalInvestigatorSlug,
  type: project.status,
  workflow: index === 0 ? 'Under Review' : index === 1 ? 'Approved' : 'Published',
  updatedAt: project.endDate,
}));

export const groupRecords: AdminRecord[] = groups.map((group, index) => ({
  id: group.id,
  title: group.name,
  slug: group.slug,
  summary: group.description,
  department: group.departmentSlug.replace('-', ' '),
  owner: group.lead,
  type: 'Research Group',
  workflow: index === 2 ? 'Submitted' : 'Published',
  updatedAt: `2026-03-${String(index + 4).padStart(2, '0')}`,
}));

export const thesisRecords: AdminRecord[] = theses.map((thesis, index) => ({
  id: thesis.id,
  title: thesis.title,
  slug: thesis.slug,
  summary: thesis.abstract,
  department: thesis.departmentSlug.replace('-', ' '),
  owner: thesis.studentName,
  type: thesis.degreeLevel,
  workflow: index === 0 ? 'Submitted' : index === 1 ? 'Approved' : 'Published',
  updatedAt: thesis.submissionDate,
}));

export const newsRecords: AdminRecord[] = newsItems.map((item, index) => ({
  id: item.id,
  title: item.title,
  slug: item.slug,
  summary: item.summary,
  department: item.departmentSlug?.replace('-', ' ') ?? 'Central',
  owner: 'Communications Desk',
  type: item.category,
  workflow: index === 0 ? 'Published' : index === 1 ? 'Approved' : 'Draft',
  updatedAt: item.publishedAt,
}));

export const departmentRecords: AdminRecord[] = departments.map((department) => ({
  id: department.id,
  title: department.name,
  slug: department.slug,
  summary: department.description,
  department: department.faculty,
  owner: 'Faculty Office',
  type: 'Department',
  workflow: 'Published',
  updatedAt: '2026-03-20',
}));

export const researchAreaRecords: AdminRecord[] = researchAreas.map((area, index) => ({
  id: area.id,
  title: area.name,
  slug: area.slug,
  summary: area.description,
  department: 'Cross-faculty',
  owner: 'ORIC Taxonomy Team',
  type: 'Research Area',
  workflow: index === 3 ? 'Draft' : 'Published',
  updatedAt: `2026-02-${String(index + 3).padStart(2, '0')}`,
}));

export const adminSettings: AdminSettingsSection[] = [
  {
    id: 'general',
    title: 'Portal Identity',
    description: 'Labels and public-facing text used across the research portal.',
    fields: [
      { id: 'portal-name', label: 'Portal name', value: 'LGU Research Portal' },
      { id: 'portal-tagline', label: 'Homepage tagline', value: 'Research discovery for Lahore Garrison University' },
    ],
  },
  {
    id: 'workflow',
    title: 'Workflow Rules',
    description: 'Control review routing and publication visibility.',
    fields: [
      { id: 'publication-review', label: 'Publication review queue', value: 'ORIC Staff' },
      { id: 'thesis-review', label: 'Thesis review queue', value: 'Department Coordinator -> ORIC Staff' },
    ],
  },
  {
    id: 'search',
    title: 'Search Indexing',
    description: 'Settings related to portal indexing and discoverability.',
    fields: [
      { id: 'search-sync', label: 'Index sync mode', value: 'Incremental' },
      { id: 'search-visibility', label: 'Public search visibility', value: 'Published records only' },
    ],
  },
];

export const publicationsByYear: AnalyticsPoint[] = [
  { label: '2022', value: 42 },
  { label: '2023', value: 57 },
  { label: '2024', value: 68 },
  { label: '2025', value: 81 },
  { label: '2026', value: 27 },
];

export const publicationsByDepartment: AnalyticsPoint[] = [
  { label: 'Computer Science', value: 118 },
  { label: 'Electrical Engineering', value: 94 },
  { label: 'Management Sciences', value: 63 },
];

export const projectsByFundingAgency: AnalyticsPoint[] = [
  { label: 'LGU ORIC', value: 9 },
  { label: 'HEIF', value: 6 },
  { label: 'National Cyber Initiative', value: 4 },
  { label: 'Industry Partner', value: 3 },
];

export const thesesByYear: AnalyticsPoint[] = [
  { label: '2022', value: 12 },
  { label: '2023', value: 18 },
  { label: '2024', value: 21 },
  { label: '2025', value: 26 },
];

export const topResearchAreas: AnalyticsPoint[] = [
  { label: 'Artificial Intelligence', value: 38 },
  { label: 'Cyber Security', value: 24 },
  { label: 'Sustainable Energy Systems', value: 17 },
  { label: 'Digital Health', value: 11 },
];
