'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { AnalyticsPoint } from '../../types/admin';
import { AdminPanelCard } from './admin-panel-card';

type AdminChartsProps = {
  recordCollections: AnalyticsPoint[];
  publicationsByYear: AnalyticsPoint[];
  publicationsByDepartment: AnalyticsPoint[];
  projectsByFundingAgency: AnalyticsPoint[];
  thesesByYear: AnalyticsPoint[];
};

export function AdminCharts({
  recordCollections,
  publicationsByYear,
  publicationsByDepartment,
  projectsByFundingAgency,
  thesesByYear,
}: AdminChartsProps) {
  return (
    <AdminPanelCard
      title="Analytics Overview"
      description="Core record, publication, project, and thesis charts grouped into a single analytics card."
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[22px] border border-line bg-slate-50 p-4">
          <div className="mb-4 font-medium text-ink">Records by Module</div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recordCollections}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d7dfeb" />
                <XAxis dataKey="label" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="value" fill="#16212f" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[22px] border border-line bg-slate-50 p-4">
          <div className="mb-4 font-medium text-ink">Publications by Year</div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={publicationsByYear}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d7dfeb" />
                <XAxis dataKey="label" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="value" fill="#0d6b66" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[22px] border border-line bg-slate-50 p-4">
          <div className="mb-4 font-medium text-ink">Publications by Department</div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={publicationsByDepartment}
                  dataKey="value"
                  nameKey="label"
                  outerRadius={72}
                  fill="#0d6b66"
                  label
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[22px] border border-line bg-slate-50 p-4">
          <div className="mb-4 font-medium text-ink">Projects by Funding Agency</div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectsByFundingAgency} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#d7dfeb" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="label" type="category" width={140} stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="value" fill="#b7713b" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[22px] border border-line bg-slate-50 p-4">
          <div className="mb-4 font-medium text-ink">Thesis Submissions by Year</div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={thesesByYear}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d7dfeb" />
                <XAxis dataKey="label" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="value" fill="#16212f" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminPanelCard>
  );
}
