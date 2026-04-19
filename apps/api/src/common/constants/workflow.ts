export const WORKFLOW_STATUSES = [
  'DRAFT',
  'SUBMITTED',
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED',
  'PUBLISHED',
  'ARCHIVED',
] as const;

export const PROJECT_LIFECYCLE_STATUSES = [
  'PROPOSED',
  'ACTIVE',
  'ON_HOLD',
  'COMPLETED',
  'CANCELLED',
] as const;

export const PUBLICATION_TYPES = [
  'JOURNAL_ARTICLE',
  'CONFERENCE_PAPER',
  'PROCEEDING',
  'BOOK',
  'BOOK_CHAPTER',
  'REPORT',
  'PATENT',
  'DATASET',
  'OTHER',
] as const;

export const THESIS_DEGREE_LEVELS = ['BS', 'MS', 'MPHIL', 'PHD', 'OTHER'] as const;

export const USER_STATUSES = ['ACTIVE', 'INVITED', 'SUSPENDED', 'INACTIVE'] as const;

export const NEWS_CATEGORIES = ['NEWS', 'EVENT', 'ACTIVITY', 'ANNOUNCEMENT'] as const;

export const FILE_ASSET_KINDS = [
  'PROFILE_PHOTO',
  'PUBLICATION_PDF',
  'THESIS_PDF',
  'NEWS_IMAGE',
  'DATASET_FILE',
  'DOCUMENT',
  'OTHER',
] as const;

export type WorkflowStatusValue = (typeof WORKFLOW_STATUSES)[number];
export type ProjectLifecycleStatusValue = (typeof PROJECT_LIFECYCLE_STATUSES)[number];
export type PublicationTypeValue = (typeof PUBLICATION_TYPES)[number];
export type ThesisDegreeLevelValue = (typeof THESIS_DEGREE_LEVELS)[number];
export type UserStatusValue = (typeof USER_STATUSES)[number];
export type FileAssetKindValue = (typeof FILE_ASSET_KINDS)[number];
export type NewsCategoryValue = (typeof NEWS_CATEGORIES)[number];
