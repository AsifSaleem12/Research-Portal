import { EntityCard } from '../../components/shared/entity-card';
import { EmptyState } from '../../components/shared/empty-state';
import { PageIntro } from '../../components/shared/page-intro';
import { getProjects } from '../../lib/portal-data';

export default function ProjectsPage() {
  const items = getProjects();

  return (
    <div className="container-shell space-y-8 pb-8">
      <PageIntro
        eyebrow="Projects"
        title="Projects"
        description="Funded and active research projects with related investigators and outputs."
        searchScope="projects"
      />

      {items.length ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {items.map((project) => (
            <EntityCard
              key={project.id}
              href={`/projects/${project.slug}`}
              eyebrow={project.status}
              title={project.title}
              description={project.abstract}
              meta={`${project.fundingAgency} • ${project.budgetLabel}`}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No projects available"
          description="Try the search bar to find a project by title, investigator, or keyword."
        />
      )}
    </div>
  );
}
