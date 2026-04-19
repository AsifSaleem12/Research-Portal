export type ResearchArea = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type Department = {
  id: string;
  name: string;
  slug: string;
  description: string;
  faculty: string;
  stats: {
    researchers: number;
    publications: number;
    projects: number;
    theses: number;
  };
};

export type ResearchGroup = {
  id: string;
  name: string;
  slug: string;
  description: string;
  departmentSlug: string;
  lead: string;
  focusAreas: string[];
  membersCount: number;
  projectsCount: number;
  publicationsCount: number;
};

export type Researcher = {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  designation: string;
  departmentSlug: string;
  faculty: string;
  expertiseSummary: string;
  biography: string;
  researchAreas: string[];
  email: string;
  featured: boolean;
  stats: {
    publications: number;
    projects: number;
    citationsLabel: string;
  };
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  abstract: string;
  departmentSlug: string;
  status: 'Proposed' | 'Active' | 'Completed';
  fundingAgency: string;
  budgetLabel: string;
  principalInvestigatorSlug: string;
  members: string[];
  researchAreas: string[];
  publicationSlugs: string[];
  startDate: string;
  endDate: string;
};

export type Publication = {
  id: string;
  slug: string;
  title: string;
  abstract: string;
  publicationType: string;
  journalOrConference: string;
  doi: string;
  publicationDate: string;
  departmentSlug: string;
  authorSlugs: string[];
  researchAreas: string[];
  openAccess: boolean;
};

export type Thesis = {
  id: string;
  slug: string;
  title: string;
  abstract: string;
  degreeLevel: string;
  studentName: string;
  supervisorSlug: string;
  departmentSlug: string;
  submissionDate: string;
  researchArea: string;
};

export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: 'News' | 'Event' | 'Activity';
  publishedAt: string;
  departmentSlug?: string;
};

export type SearchResultItem = {
  type: 'Researcher' | 'Publication' | 'Project' | 'Group' | 'Department' | 'Thesis' | 'News';
  title: string;
  href: string;
  description: string;
  meta: string;
};

export type JointArticleMapPoint = {
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
};
