import type { AdminRecord, WorkflowState } from '../../types/admin';
import type { AdminResourceName } from '../../lib/admin-resource-api';

export type AdminFieldType = 'text' | 'textarea' | 'select' | 'date' | 'number' | 'checkbox';

export type AdminFieldConfig = {
  name: string;
  label: string;
  type: AdminFieldType;
  required?: boolean;
  options?: readonly { label: string; value: string }[];
  placeholder?: string;
};

export type AdminResourceConfig = {
  resource: AdminResourceName;
  title: string;
  description: string;
  createTitleLabel: string;
  createDescriptionLabel: string;
  fields: AdminFieldConfig[];
  emptyForm: Record<string, string | number | boolean>;
  toFormValues: (item: Record<string, any>) => Record<string, string | number | boolean>;
  toPayload: (
    form: Record<string, string | number | boolean>,
  ) => Record<string, unknown>;
  toRecord: (item: Record<string, any>) => AdminRecord;
};

const workflowOptions = [
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Submitted', value: 'SUBMITTED' },
  { label: 'Under Review', value: 'UNDER_REVIEW' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Archived', value: 'ARCHIVED' },
] as const;

const publicationTypeOptions = [
  'JOURNAL_ARTICLE',
  'CONFERENCE_PAPER',
  'PROCEEDING',
  'BOOK',
  'BOOK_CHAPTER',
  'REPORT',
  'PATENT',
  'DATASET',
  'OTHER',
].map((value) => ({ value, label: formatEnum(value) }));

const projectLifecycleOptions = [
  'PROPOSED',
  'ACTIVE',
  'ON_HOLD',
  'COMPLETED',
  'CANCELLED',
].map((value) => ({ value, label: formatEnum(value) }));

const thesisDegreeOptions = ['BS', 'MS', 'MPHIL', 'PHD', 'OTHER'].map((value) => ({
  value,
  label: value,
}));

const jointCountryOptions = [
  'United Kingdom',
  'Germany',
  'Saudi Arabia',
  'China',
  'Malaysia',
].map((value) => ({
  value,
  label: value,
}));

export const adminResourceConfigs: Record<AdminResourceName, AdminResourceConfig> = {
  publications: {
    resource: 'publications',
    title: 'Publication Records',
    description: 'Create, update, publish, and delete publication records from the live API.',
    createTitleLabel: 'Publication title',
    createDescriptionLabel: 'Abstract',
    fields: [
      { name: 'title', label: 'Publication title', type: 'text', required: true },
      { name: 'abstract', label: 'Abstract', type: 'textarea' },
      { name: 'publicationType', label: 'Publication type', type: 'select', required: true, options: publicationTypeOptions },
      { name: 'status', label: 'Workflow status', type: 'select', options: workflowOptions },
      { name: 'jointCountry', label: 'Joint Country', type: 'select', options: jointCountryOptions },
      { name: 'departmentId', label: 'Department', type: 'text' },
      { name: 'publisher', label: 'Publisher', type: 'text' },
      { name: 'journalName', label: 'Journal name', type: 'text' },
      { name: 'conferenceName', label: 'Conference name', type: 'text' },
      { name: 'doi', label: 'DOI', type: 'text' },
      { name: 'publicationDate', label: 'Publication date', type: 'date' },
      { name: 'openAccess', label: 'Open access', type: 'checkbox' },
    ],
    emptyForm: {
      title: '',
      abstract: '',
      publicationType: 'JOURNAL_ARTICLE',
      status: 'DRAFT',
      jointCountry: 'United Kingdom',
      departmentId: '',
      publisher: '',
      journalName: '',
      conferenceName: '',
      doi: '',
      publicationDate: '',
      openAccess: false,
    },
    toFormValues: (item) => ({
      title: item.title ?? '',
      abstract: item.abstract ?? '',
      publicationType: item.publicationType ?? 'JOURNAL_ARTICLE',
      status: item.status ?? 'DRAFT',
      jointCountry: item.jointCountry ?? 'United Kingdom',
      departmentId: item.departmentId ?? '',
      publisher: item.publisher ?? '',
      journalName: item.journalName ?? '',
      conferenceName: item.conferenceName ?? '',
      doi: item.doi ?? '',
      publicationDate: toDateInput(item.publicationDate),
      openAccess: Boolean(item.openAccess),
    }),
    toPayload: (form) => cleanPayload(form),
    toRecord: (item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      summary: item.abstract ?? '',
      department: item.department?.name ?? 'Central',
      owner:
        item.authors?.[0]?.researcher
          ? `${item.authors[0].researcher.firstName} ${item.authors[0].researcher.lastName}`
          : item.authors?.[0]?.externalAuthorName ?? 'Unassigned',
      type: formatEnum(item.publicationType ?? 'OTHER'),
      workflow: toWorkflowState(item.status),
      updatedAt: toDisplayDate(item.updatedAt ?? item.publicationDate),
    }),
  },
  projects: {
    resource: 'projects',
    title: 'Project Records',
    description: 'Manage real project records and lifecycle metadata from the live API.',
    createTitleLabel: 'Project title',
    createDescriptionLabel: 'Project abstract',
    fields: [
      { name: 'title', label: 'Project title', type: 'text', required: true },
      { name: 'abstract', label: 'Abstract', type: 'textarea' },
      { name: 'status', label: 'Workflow status', type: 'select', options: workflowOptions },
      { name: 'lifecycleStatus', label: 'Lifecycle status', type: 'select', options: projectLifecycleOptions },
      { name: 'jointCountry', label: 'Joint Country', type: 'select', options: jointCountryOptions },
      { name: 'departmentId', label: 'Department', type: 'text' },
      { name: 'principalInvestigatorId', label: 'Principal investigator', type: 'text' },
      { name: 'fundingAgency', label: 'Funding agency', type: 'text' },
      { name: 'budget', label: 'Budget', type: 'number' },
      { name: 'startDate', label: 'Start date', type: 'date' },
      { name: 'endDate', label: 'End date', type: 'date' },
    ],
    emptyForm: {
      title: '',
      abstract: '',
      status: 'DRAFT',
      lifecycleStatus: 'PROPOSED',
      jointCountry: 'United Kingdom',
      departmentId: '',
      principalInvestigatorId: '',
      fundingAgency: '',
      budget: '',
      startDate: '',
      endDate: '',
    },
    toFormValues: (item) => ({
      title: item.title ?? '',
      abstract: item.abstract ?? '',
      status: item.status ?? 'DRAFT',
      lifecycleStatus: item.lifecycleStatus ?? 'PROPOSED',
      jointCountry: item.jointCountry ?? 'United Kingdom',
      departmentId: item.departmentId ?? '',
      principalInvestigatorId: item.principalInvestigatorId ?? '',
      fundingAgency: item.fundingAgency ?? '',
      budget: item.budget?.toString?.() ?? '',
      startDate: toDateInput(item.startDate),
      endDate: toDateInput(item.endDate),
    }),
    toPayload: (form) =>
      cleanPayload({
        ...form,
        budget: form.budget === '' ? undefined : Number(form.budget),
      }),
    toRecord: (item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      summary: item.abstract ?? '',
      department: item.department?.name ?? 'Central',
      owner: item.principalInvestigator
        ? `${item.principalInvestigator.firstName} ${item.principalInvestigator.lastName}`
        : 'Unassigned',
      type: formatEnum(item.lifecycleStatus ?? 'PROPOSED'),
      workflow: toWorkflowState(item.status),
      updatedAt: toDisplayDate(item.updatedAt ?? item.endDate),
    }),
  },
  theses: {
    resource: 'theses',
    title: 'Thesis Records',
    description: 'Maintain real thesis submissions, supervisors, and workflow state from the live API.',
    createTitleLabel: 'Thesis title',
    createDescriptionLabel: 'Abstract',
    fields: [
      { name: 'title', label: 'Thesis title', type: 'text', required: true },
      { name: 'abstract', label: 'Abstract', type: 'textarea' },
      { name: 'degreeLevel', label: 'Degree level', type: 'select', required: true, options: thesisDegreeOptions },
      { name: 'studentName', label: 'Student name', type: 'text', required: true },
      { name: 'status', label: 'Workflow status', type: 'select', options: workflowOptions },
      { name: 'departmentId', label: 'Department', type: 'text' },
      { name: 'supervisorId', label: 'Supervisor', type: 'text' },
      { name: 'coSupervisorId', label: 'Co-supervisor', type: 'text' },
      { name: 'submissionDate', label: 'Submission date', type: 'date' },
      { name: 'fileUrl', label: 'File URL', type: 'text' },
    ],
    emptyForm: {
      title: '',
      abstract: '',
      degreeLevel: 'MS',
      studentName: '',
      status: 'DRAFT',
      departmentId: '',
      supervisorId: '',
      coSupervisorId: '',
      submissionDate: '',
      fileUrl: '',
    },
    toFormValues: (item) => ({
      title: item.title ?? '',
      abstract: item.abstract ?? '',
      degreeLevel: item.degreeLevel ?? 'MS',
      studentName: item.studentName ?? '',
      status: item.status ?? 'DRAFT',
      departmentId: item.departmentId ?? '',
      supervisorId: item.supervisorId ?? '',
      coSupervisorId: item.coSupervisorId ?? '',
      submissionDate: toDateInput(item.submissionDate),
      fileUrl: item.fileUrl ?? '',
    }),
    toPayload: (form) => cleanPayload(form),
    toRecord: (item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      summary: item.abstract ?? '',
      department: item.department?.name ?? 'Central',
      owner: item.studentName ?? 'Unassigned',
      type: item.degreeLevel ?? 'OTHER',
      workflow: toWorkflowState(item.status),
      updatedAt: toDisplayDate(item.updatedAt ?? item.submissionDate),
    }),
  },
  researchers: {
    resource: 'researchers',
    title: 'Researcher Profiles',
    description: 'Update real researcher profiles tied to user accounts and live portal metadata.',
    createTitleLabel: 'Researcher name',
    createDescriptionLabel: 'Expertise summary',
    fields: [
      { name: 'employeeId', label: 'User ID', type: 'text' },
      { name: 'firstName', label: 'First name', type: 'text', required: true },
      { name: 'lastName', label: 'Last name', type: 'text', required: true },
      { name: 'designation', label: 'Designation', type: 'text' },
      { name: 'expertiseSummary', label: 'Expertise summary', type: 'textarea' },
      { name: 'biography', label: 'Biography', type: 'textarea' },
      { name: 'departmentId', label: 'Department', type: 'text' },
      { name: 'facultyId', label: 'Faculty', type: 'text' },
    ],
    emptyForm: {
      userId: '',
      employeeId: '',
      firstName: '',
      lastName: '',
      designation: '',
      expertiseSummary: '',
      biography: '',
      departmentId: '',
      facultyId: '',
    },
    toFormValues: (item) => ({
      userId: item.userId ?? '',
      employeeId: item.employeeId ?? '',
      firstName: item.firstName ?? '',
      lastName: item.lastName ?? '',
      designation: item.designation ?? '',
      expertiseSummary: item.expertiseSummary ?? '',
      biography: item.biography ?? '',
      departmentId: item.departmentId ?? '',
      facultyId: item.facultyId ?? '',
    }),
    toPayload: (form) => cleanPayload(form),
    toRecord: (item) => ({
      id: item.id,
      title: `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim(),
      slug: item.slug,
      summary: item.expertiseSummary ?? '',
      department: item.department?.name ?? 'Unassigned',
      owner: item.designation ?? 'Researcher',
      type: 'Researcher Profile',
      workflow: 'Published',
      updatedAt: toDisplayDate(item.updatedAt),
    }),
  },
  departments: {
    resource: 'departments',
    title: 'Department Records',
    description: 'Create and maintain live department pages and institutional metadata.',
    createTitleLabel: 'Department name',
    createDescriptionLabel: 'Description',
    fields: [
      { name: 'name', label: 'Department name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'facultyId', label: 'Faculty ID', type: 'text' },
    ],
    emptyForm: {
      name: '',
      description: '',
      facultyId: '',
    },
    toFormValues: (item) => ({
      name: item.name ?? '',
      description: item.description ?? '',
      facultyId: item.facultyId ?? '',
    }),
    toPayload: (form) => cleanPayload(form),
    toRecord: (item) => ({
      id: item.id,
      title: item.name,
      slug: item.slug,
      summary: item.description ?? '',
      department: item.faculty?.name ?? 'No faculty assigned',
      owner: `${item._count?.researchers ?? 0} researchers`,
      type: 'Department',
      workflow: 'Published',
      updatedAt: toDisplayDate(item.updatedAt),
    }),
  },
  groups: {
    resource: 'groups',
    title: 'Group Records',
    description: 'Create and maintain live research groups and lab profiles.',
    createTitleLabel: 'Group name',
    createDescriptionLabel: 'Group description',
    fields: [
      { name: 'name', label: 'Group name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'jointCountry', label: 'Joint Country', type: 'select', options: jointCountryOptions },
      { name: 'departmentId', label: 'Department Name', type: 'text' },
      { name: 'facultyId', label: 'Faculty', type: 'text' },
      { name: 'leadResearcherId', label: 'Lead researcher', type: 'text' },
    ],
    emptyForm: {
      name: '',
      description: '',
      jointCountry: 'United Kingdom',
      departmentId: '',
      facultyId: '',
      leadResearcherId: '',
    },
    toFormValues: (item) => ({
      name: item.name ?? '',
      description: item.description ?? '',
      jointCountry: item.jointCountry ?? 'United Kingdom',
      departmentId: item.departmentId ?? '',
      facultyId: item.facultyId ?? '',
      leadResearcherId: item.leadResearcherId ?? '',
    }),
    toPayload: (form) => cleanPayload(form),
    toRecord: (item) => ({
      id: item.id,
      title: item.name,
      slug: item.slug,
      summary: item.description ?? '',
      department: item.department?.name ?? 'No department assigned',
      owner: item.leadResearcher
        ? `${item.leadResearcher.firstName} ${item.leadResearcher.lastName}`
        : 'Unassigned',
      type: 'Research Group',
      workflow: 'Published',
      updatedAt: toDisplayDate(item.updatedAt),
    }),
  },
  news: {
    resource: 'news',
    title: 'News Records',
    description: 'Manage live news, event, and activity items through the backend API.',
    createTitleLabel: 'News title',
    createDescriptionLabel: 'Summary',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'summary', label: 'Summary', type: 'textarea' },
      { name: 'content', label: 'Content', type: 'textarea', required: true },
      {
        name: 'category',
        label: 'Category',
        type: 'select',
        options: ['NEWS', 'EVENT', 'ACTIVITY', 'ANNOUNCEMENT'].map((value) => ({
          value,
          label: formatEnum(value),
        })),
      },
      { name: 'status', label: 'Workflow status', type: 'select', options: workflowOptions },
      { name: 'departmentId', label: 'Department', type: 'text' },
      { name: 'publishedAt', label: 'Publish date', type: 'date' },
      { name: 'featuredImage', label: 'Featured image URL', type: 'text' },
    ],
    emptyForm: {
      title: '',
      summary: '',
      content: '',
      category: 'NEWS',
      status: 'DRAFT',
      departmentId: '',
      publishedAt: '',
      featuredImage: '',
    },
    toFormValues: (item) => ({
      title: item.title ?? '',
      summary: item.summary ?? '',
      content: item.content ?? '',
      category: item.category ?? 'NEWS',
      status: item.status ?? 'DRAFT',
      departmentId: item.departmentId ?? '',
      publishedAt: toDateInput(item.publishedAt),
      featuredImage: item.featuredImage ?? '',
    }),
    toPayload: (form) => cleanPayload(form),
    toRecord: (item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      summary: item.summary ?? '',
      department: item.department?.name ?? 'Central',
      owner: formatEnum(item.category ?? 'NEWS'),
      type: 'News Item',
      workflow: toWorkflowState(item.status),
      updatedAt: toDisplayDate(item.updatedAt ?? item.publishedAt),
    }),
  },
  'research-areas': {
    resource: 'research-areas',
    title: 'Research Area Records',
    description: 'Manage the live taxonomy used across portal filtering and discovery.',
    createTitleLabel: 'Research area name',
    createDescriptionLabel: 'Description',
    fields: [
      { name: 'name', label: 'Research area name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
    emptyForm: {
      name: '',
      description: '',
    },
    toFormValues: (item) => ({
      name: item.name ?? '',
      description: item.description ?? '',
    }),
    toPayload: (form) => cleanPayload(form),
    toRecord: (item) => ({
      id: item.id,
      title: item.name,
      slug: item.slug,
      summary: item.description ?? '',
      department: 'Cross-faculty',
      owner: 'Taxonomy',
      type: 'Research Area',
      workflow: 'Published',
      updatedAt: toDisplayDate(item.updatedAt),
    }),
  },
};

export function toWorkflowState(value?: string | null): WorkflowState {
  switch (value) {
    case 'DRAFT':
      return 'Draft';
    case 'SUBMITTED':
      return 'Submitted';
    case 'UNDER_REVIEW':
      return 'Under Review';
    case 'APPROVED':
      return 'Approved';
    case 'REJECTED':
      return 'Rejected';
    case 'ARCHIVED':
      return 'Archived';
    case 'PUBLISHED':
    default:
      return 'Published';
  }
}

function cleanPayload(
  form: Record<string, string | number | boolean | undefined>,
) {
  return Object.fromEntries(
    Object.entries(form).flatMap(([key, value]) => {
      if (value === '' || typeof value === 'undefined') {
        return [];
      }

      return [[key, value]];
    }),
  );
}

function toDateInput(value?: string | null) {
  return value ? String(value).slice(0, 10) : '';
}

function toDisplayDate(value?: string | null) {
  return value ? String(value).slice(0, 10) : '-';
}

function formatEnum(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
