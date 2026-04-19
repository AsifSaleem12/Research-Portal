import { DetailHero } from '../../../components/shared/detail-hero';
import { DetailSection } from '../../../components/shared/detail-section';
import { EntityCard } from '../../../components/shared/entity-card';
import { getPublicationBySlug } from '../../../lib/portal-data';

export default function PublicationDetailPage({ params }: { params: { slug: string } }) {
  const { publication, authors, department, relatedProjects, relatedPublications } =
    getPublicationBySlug(params.slug);

  return (
    <div className="container-shell space-y-8 pb-8">
      <DetailHero
        eyebrow={publication.publicationType}
        title={publication.title}
        description={publication.abstract}
        meta={[
          publication.journalOrConference,
          `Published ${publication.publicationDate}`,
          `DOI ${publication.doi}`,
          department?.name ?? 'Department not assigned',
          publication.openAccess ? 'Open access' : 'Restricted access',
        ]}
        tags={publication.researchAreas}
        searchScope="publications"
      />

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <DetailSection title="Authors">
          <div className="space-y-3">
            {authors.map((author) => (
              <div key={author.id}>
                <div className="font-semibold text-ink">
                  {author.firstName} {author.lastName}
                </div>
                <div>{author.designation}</div>
              </div>
            ))}
          </div>
        </DetailSection>

        <DetailSection title="Publication Abstract">
          <p>{publication.abstract}</p>
        </DetailSection>
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <DetailSection title="Related Projects">
          <div className="grid gap-4">
            {relatedProjects.map((project) => (
              <EntityCard
                key={project.id}
                href={`/projects/${project.slug}`}
                eyebrow={project.status}
                title={project.title}
                description={project.abstract}
                meta={project.fundingAgency}
              />
            ))}
          </div>
        </DetailSection>

        <DetailSection title="Similar Publications">
          <div className="grid gap-4">
            {relatedPublications.map((item) => (
              <EntityCard
                key={item.id}
                href={`/publications/${item.slug}`}
                eyebrow={item.publicationType}
                title={item.title}
                description={item.abstract}
                meta={item.journalOrConference}
                tags={item.researchAreas}
              />
            ))}
          </div>
        </DetailSection>
      </div>
    </div>
  );
}
