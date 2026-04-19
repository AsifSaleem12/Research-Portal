import { EntityCard } from '../../components/shared/entity-card';
import { EmptyState } from '../../components/shared/empty-state';
import { PageIntro } from '../../components/shared/page-intro';
import { getPublications } from '../../lib/portal-data';

export default function PublicationsPage() {
  const items = getPublications();

  return (
    <div className="container-shell space-y-8 pb-8">
      <PageIntro
        eyebrow="Publications"
        title="Publications"
        description="Journal articles, conference papers, and other research outputs from LGU."
        searchScope="publications"
      />

      {items.length ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {items.map((publication) => (
            <EntityCard
              key={publication.id}
              href={`/publications/${publication.slug}`}
              eyebrow={publication.publicationType}
              title={publication.title}
              description={publication.abstract}
              meta={`${publication.journalOrConference} • ${publication.publicationDate}`}
              tags={publication.researchAreas}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No publications available"
          description="Try the search bar to find a publication by title, author, or subject."
        />
      )}
    </div>
  );
}
