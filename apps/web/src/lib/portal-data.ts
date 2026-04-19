import { notFound } from 'next/navigation';
import { getApiBaseUrl } from './admin-auth';
import {
  departments,
  groups,
  joinResearchOpportunities,
  jointArticleMapPoints,
  newsItems,
  projects,
  publications,
  researchers,
  researchAreas,
  theses,
} from './mock-data';
import { SearchResultItem } from '../types/portal';

type JointCountryMapApiResponse = {
  data?: {
    id: string;
    country: string;
    x: number;
    y: number;
    articleTitle: string;
    href: string;
    articleType: string;
    partnerInstitution: string;
    year: string;
    summary: string;
  }[];
};

export async function getHomePageData() {
  const liveJointMapPoints = await fetch(`${getApiBaseUrl()}/analytics/joint-country-map`, {
    cache: 'no-store',
  })
    .then(async (response) => {
      if (!response.ok) {
        return null;
      }

      const payload = (await response.json()) as JointCountryMapApiResponse;
      return payload.data ?? null;
    })
    .catch(() => null);

  return {
    featuredResearchers: researchers.filter((item) => item.featured).slice(0, 3),
    featuredGroups: groups.slice(0, 3),
    recentPublications: [...publications]
      .sort((a, b) => +new Date(b.publicationDate) - +new Date(a.publicationDate))
      .slice(0, 3),
    ongoingProjects: projects.filter((item) => item.status === 'Active').slice(0, 3),
    statistics: [
      { label: 'Researchers', value: '50+' },
      { label: 'Publications', value: '275+' },
      { label: 'Active projects', value: '32' },
      { label: 'Theses archived', value: '80+' },
    ],
    departments,
    news: newsItems.slice(0, 3),
    opportunities: joinResearchOpportunities,
    jointArticleMapPoints: liveJointMapPoints?.length ? liveJointMapPoints : jointArticleMapPoints,
  };
}

export function getResearchers(filter?: { q?: string; department?: string; area?: string }) {
  return researchers.filter((researcher) => {
    const matchesSearch =
      !filter?.q ||
      `${researcher.firstName} ${researcher.lastName} ${researcher.expertiseSummary}`
        .toLowerCase()
        .includes(filter.q.toLowerCase());
    const matchesDepartment =
      !filter?.department || researcher.departmentSlug === filter.department;
    const matchesArea =
      !filter?.area || researcher.researchAreas.includes(filter.area);
    return matchesSearch && matchesDepartment && matchesArea;
  });
}

export function getResearcherBySlug(slug: string) {
  const researcher = researchers.find((item) => item.slug === slug);
  if (!researcher) notFound();

  return {
    researcher,
    department: departments.find((item) => item.slug === researcher.departmentSlug),
    relatedProjects: projects.filter(
      (item) =>
        item.principalInvestigatorSlug === researcher.slug ||
        item.members.includes(researcher.slug),
    ),
    relatedPublications: publications.filter((item) =>
      item.authorSlugs.includes(researcher.slug),
    ),
    relatedGroups: groups.filter((item) => item.lead === researcher.slug),
    sameDepartment: researchers.filter(
      (item) => item.departmentSlug === researcher.departmentSlug && item.slug !== researcher.slug,
    ),
  };
}

export function getPublications(filter?: { q?: string; department?: string; type?: string }) {
  return publications.filter((publication) => {
    const matchesSearch =
      !filter?.q ||
      `${publication.title} ${publication.abstract} ${publication.doi}`
        .toLowerCase()
        .includes(filter.q.toLowerCase());
    const matchesDepartment =
      !filter?.department || publication.departmentSlug === filter.department;
    const matchesType = !filter?.type || publication.publicationType === filter.type;
    return matchesSearch && matchesDepartment && matchesType;
  });
}

export function getPublicationBySlug(slug: string) {
  const publication = publications.find((item) => item.slug === slug);
  if (!publication) notFound();

  return {
    publication,
    authors: researchers.filter((researcher) =>
      publication.authorSlugs.includes(researcher.slug),
    ),
    department: departments.find((item) => item.slug === publication.departmentSlug),
    relatedProjects: projects.filter((project) =>
      project.publicationSlugs.includes(publication.slug),
    ),
    relatedPublications: publications.filter(
      (item) =>
        item.slug !== publication.slug &&
        item.researchAreas.some((area) => publication.researchAreas.includes(area)),
    ),
  };
}

export function getProjects(filter?: { q?: string; department?: string; status?: string }) {
  return projects.filter((project) => {
    const matchesSearch =
      !filter?.q ||
      `${project.title} ${project.abstract} ${project.fundingAgency}`
        .toLowerCase()
        .includes(filter.q.toLowerCase());
    const matchesDepartment =
      !filter?.department || project.departmentSlug === filter.department;
    const matchesStatus = !filter?.status || project.status === filter.status;
    return matchesSearch && matchesDepartment && matchesStatus;
  });
}

export function getProjectBySlug(slug: string) {
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  return {
    project,
    pi: researchers.find((item) => item.slug === project.principalInvestigatorSlug),
    members: researchers.filter((item) => project.members.includes(item.slug)),
    department: departments.find((item) => item.slug === project.departmentSlug),
    linkedPublications: publications.filter((item) =>
      project.publicationSlugs.includes(item.slug),
    ),
    relatedProjects: projects.filter(
      (item) =>
        item.slug !== project.slug &&
        item.researchAreas.some((area) => project.researchAreas.includes(area)),
    ),
  };
}

export function getGroups() {
  return groups;
}

export function getGroupBySlug(slug: string) {
  const group = groups.find((item) => item.slug === slug);
  if (!group) notFound();

  return {
    group,
    lead: researchers.find((item) => item.slug === group.lead),
    department: departments.find((item) => item.slug === group.departmentSlug),
    projects: projects.filter(
      (item) =>
        item.principalInvestigatorSlug === group.lead ||
        item.members.includes(group.lead),
    ),
    publications: publications.filter((item) => item.authorSlugs.includes(group.lead)),
  };
}

export function getDepartments() {
  return departments;
}

export function getDepartmentBySlug(slug: string) {
  const department = departments.find((item) => item.slug === slug);
  if (!department) notFound();

  return {
    department,
    researchers: researchers.filter((item) => item.departmentSlug === department.slug),
    groups: groups.filter((item) => item.departmentSlug === department.slug),
    projects: projects.filter((item) => item.departmentSlug === department.slug),
    publications: publications.filter((item) => item.departmentSlug === department.slug),
    theses: theses.filter((item) => item.departmentSlug === department.slug),
  };
}

export function getTheses(filter?: { q?: string; department?: string; degree?: string }) {
  return theses.filter((thesis) => {
    const matchesSearch =
      !filter?.q ||
      `${thesis.title} ${thesis.studentName} ${thesis.abstract}`
        .toLowerCase()
        .includes(filter.q.toLowerCase());
    const matchesDepartment =
      !filter?.department || thesis.departmentSlug === filter.department;
    const matchesDegree = !filter?.degree || thesis.degreeLevel === filter.degree;
    return matchesSearch && matchesDepartment && matchesDegree;
  });
}

export function getThesisBySlug(slug: string) {
  const thesis = theses.find((item) => item.slug === slug);
  if (!thesis) notFound();

  return {
    thesis,
    department: departments.find((item) => item.slug === thesis.departmentSlug),
    supervisor: researchers.find((item) => item.slug === thesis.supervisorSlug),
    relatedTheses: theses.filter(
      (item) => item.slug !== thesis.slug && item.researchArea === thesis.researchArea,
    ),
  };
}

export function getResearchAreas() {
  return researchAreas.map((area) => ({
    ...area,
    counts: {
      researchers: researchers.filter((item) => item.researchAreas.includes(area.name)).length,
      publications: publications.filter((item) => item.researchAreas.includes(area.name)).length,
      projects: projects.filter((item) => item.researchAreas.includes(area.name)).length,
      theses: theses.filter((item) => item.researchArea === area.name).length,
    },
  }));
}

export function getNews() {
  return newsItems;
}

export function getSearchResults(
  query: string,
  scope:
    | SearchResultItem['type']
    | 'all'
    | 'researchers'
    | 'publications'
    | 'projects'
    | 'groups'
    | 'theses'
    | 'departments'
    | 'news' = 'all',
): SearchResultItem[] {
  const q = query.toLowerCase();
  if (!q) return [];

  const results = [
    ...researchers
      .filter((item) =>
        `${item.firstName} ${item.lastName} ${item.expertiseSummary}`.toLowerCase().includes(q),
      )
      .map((item) => ({
        type: 'Researcher' as const,
        title: `${item.firstName} ${item.lastName}`,
        href: `/researchers/${item.slug}`,
        description: item.expertiseSummary,
        meta: item.designation,
      })),
    ...publications
      .filter((item) => `${item.title} ${item.abstract}`.toLowerCase().includes(q))
      .map((item) => ({
        type: 'Publication' as const,
        title: item.title,
        href: `/publications/${item.slug}`,
        description: item.abstract,
        meta: item.journalOrConference,
      })),
    ...projects
      .filter((item) => `${item.title} ${item.abstract}`.toLowerCase().includes(q))
      .map((item) => ({
        type: 'Project' as const,
        title: item.title,
        href: `/projects/${item.slug}`,
        description: item.abstract,
        meta: item.fundingAgency,
      })),
    ...groups
      .filter((item) => `${item.name} ${item.description}`.toLowerCase().includes(q))
      .map((item) => ({
        type: 'Group' as const,
        title: item.name,
        href: `/groups/${item.slug}`,
        description: item.description,
        meta: item.focusAreas.join(' • '),
      })),
    ...departments
      .filter((item) => `${item.name} ${item.description}`.toLowerCase().includes(q))
      .map((item) => ({
        type: 'Department' as const,
        title: item.name,
        href: `/departments/${item.slug}`,
        description: item.description,
        meta: item.faculty,
      })),
    ...theses
      .filter((item) => `${item.title} ${item.abstract}`.toLowerCase().includes(q))
      .map((item) => ({
        type: 'Thesis' as const,
        title: item.title,
        href: `/theses/${item.slug}`,
        description: item.abstract,
        meta: `${item.degreeLevel} • ${item.studentName}`,
      })),
    ...newsItems
      .filter((item) => `${item.title} ${item.summary}`.toLowerCase().includes(q))
      .map((item) => ({
        type: 'News' as const,
        title: item.title,
        href: '/news',
        description: item.summary,
        meta: item.category,
      })),
  ];

  const scopeMap: Record<string, SearchResultItem['type']> = {
    researchers: 'Researcher',
    publications: 'Publication',
    projects: 'Project',
    groups: 'Group',
    theses: 'Thesis',
    departments: 'Department',
    news: 'News',
  };

  if (scope === 'all') {
    return results;
  }

  const targetType = scopeMap[scope];
  return results.filter((item) => item.type === targetType);
}
