export type WorkflowState =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Approved'
  | 'Rejected'
  | 'Published'
  | 'Archived';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Invited' | 'Suspended';
  department?: string;
};

export type AdminRecord = {
  id: string;
  title: string;
  slug?: string;
  summary?: string;
  department?: string;
  owner?: string;
  type?: string;
  workflow: WorkflowState;
  updatedAt: string;
};

export type AdminSettingsSection = {
  id: string;
  title: string;
  description: string;
  fields: {
    id: string;
    label: string;
    value: string;
  }[];
};

export type AnalyticsPoint = {
  label: string;
  value: number;
};
