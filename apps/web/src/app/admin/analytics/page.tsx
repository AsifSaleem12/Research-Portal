import { AdminCharts } from '../../../components/admin/admin-charts';
import { AdminPageHeader } from '../../../components/admin/admin-page-header';
import { AdminPanelCard } from '../../../components/admin/admin-panel-card';
import {
  groupRecords,
  projectRecords,
  projectsByFundingAgency,
  publicationRecords,
  publicationsByDepartment,
  publicationsByYear,
  researcherRecords,
  thesesByYear,
  thesisRecords,
  topResearchAreas,
} from '../../../features/admin/admin-data';

export default function AdminAnalyticsPage() {
  const recordCollections = [
    { label: 'Researchers', value: researcherRecords.length },
    { label: 'Publications', value: publicationRecords.length },
    { label: 'Projects', value: projectRecords.length },
    { label: 'Groups', value: groupRecords.length },
    { label: 'Theses', value: thesisRecords.length },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Analytics"
        title="Research performance and trend monitoring"
        description="A visual analytics workspace for record collections, outputs, department-level contribution, funding spread, and thesis throughput."
      />

      <AdminCharts
        recordCollections={recordCollections}
        publicationsByYear={publicationsByYear}
        publicationsByDepartment={publicationsByDepartment}
        projectsByFundingAgency={projectsByFundingAgency}
        thesesByYear={thesesByYear}
      />

      <AdminPanelCard
        title="Top Research Areas"
        description="High-activity themes based on people, outputs, and repository coverage."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {topResearchAreas.map((item) => (
            <div
              key={item.label}
              className="rounded-[22px] border border-line bg-slate-50 px-4 py-4"
            >
              <div className="font-medium text-ink">{item.label}</div>
              <div className="mt-1 text-sm text-slate-500">{item.value} connected records</div>
            </div>
          ))}
        </div>
      </AdminPanelCard>
    </div>
  );
}
