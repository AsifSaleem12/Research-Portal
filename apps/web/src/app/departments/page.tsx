import { EntityCard } from '../../components/shared/entity-card';
import { PageIntro } from '../../components/shared/page-intro';
import { getDepartments } from '../../lib/portal-data';

export default function DepartmentsPage() {
  const items = getDepartments();

  return (
    <div className="container-shell space-y-8 pb-8">
      <PageIntro
        eyebrow="Departments"
        title="Departments"
        description="Academic departments with linked researchers, projects, and publications."
        searchScope="departments"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {items.map((department) => (
          <EntityCard
            key={department.id}
            href={`/departments/${department.slug}`}
            eyebrow={department.faculty}
            title={department.name}
            description={department.description}
            meta={`${department.stats.researchers} researchers • ${department.stats.publications} publications`}
          />
        ))}
      </div>
    </div>
  );
}
