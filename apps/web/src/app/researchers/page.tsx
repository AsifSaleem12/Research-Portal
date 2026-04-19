import { EntityCard } from '../../components/shared/entity-card';
import { EmptyState } from '../../components/shared/empty-state';
import { PageIntro } from '../../components/shared/page-intro';
import { getResearchers } from '../../lib/portal-data';

export default function ResearchersPage() {
  const items = getResearchers();

  return (
    <div className="container-shell space-y-8 pb-8">
      <PageIntro
        eyebrow="Researchers"
        title="Researchers"
        description="Faculty profiles with expertise, affiliations, and linked research records."
        searchScope="researchers"
      />

      {items.length ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {items.map((researcher) => (
            <EntityCard
              key={researcher.id}
              href={`/researchers/${researcher.slug}`}
              eyebrow={researcher.designation}
              title={`${researcher.firstName} ${researcher.lastName}`}
              description={researcher.expertiseSummary}
              meta={researcher.faculty}
              tags={researcher.researchAreas}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No researchers available"
          description="Try the search bar to find a researcher by name or topic."
        />
      )}
    </div>
  );
}
