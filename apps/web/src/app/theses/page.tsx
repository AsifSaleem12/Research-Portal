import { EntityCard } from '../../components/shared/entity-card';
import { EmptyState } from '../../components/shared/empty-state';
import { PageIntro } from '../../components/shared/page-intro';
import { getTheses } from '../../lib/portal-data';

export default function ThesesPage() {
  const items = getTheses();

  return (
    <div className="container-shell space-y-8 pb-8">
      <PageIntro
        eyebrow="Theses"
        title="Theses"
        description="Graduate research records linked to supervisors, departments, and subjects."
        searchScope="theses"
      />

      {items.length ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {items.map((thesis) => (
            <EntityCard
              key={thesis.id}
              href={`/theses/${thesis.slug}`}
              eyebrow={thesis.degreeLevel}
              title={thesis.title}
              description={thesis.abstract}
              meta={`${thesis.studentName} • ${thesis.submissionDate}`}
              tags={[thesis.researchArea]}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No theses available"
          description="Try the search bar to find a thesis by title, student, or subject."
        />
      )}
    </div>
  );
}
