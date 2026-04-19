import { DetailHero } from '../../../components/shared/detail-hero';
import { DetailSection } from '../../../components/shared/detail-section';
import { EntityCard } from '../../../components/shared/entity-card';
import { getResearcherBySlug } from '../../../lib/portal-data';

export default function ResearcherDetailPage({ params }: { params: { slug: string } }) {
  const { researcher, department, relatedProjects, relatedPublications, relatedGroups, sameDepartment } =
    getResearcherBySlug(params.slug);

  return (
    <div className="container-shell space-y-8 pb-8">
      <DetailHero
        eyebrow={researcher.designation}
        title={`${researcher.firstName} ${researcher.lastName}`}
        description={researcher.biography}
        meta={[
          department?.name ?? 'Department not assigned',
          researcher.email,
          `${researcher.stats.publications} publications`,
          `${researcher.stats.projects} active and completed projects`,
          researcher.stats.citationsLabel,
        ]}
        tags={researcher.researchAreas}
        searchScope="researchers"
      />

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <DetailSection title="Research Overview">
          <p>{researcher.expertiseSummary}</p>
        </DetailSection>

        <DetailSection title="Profile Context">
          <p>{researcher.faculty}</p>
          <p className="mt-3">{department?.description}</p>
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

        <DetailSection title="Selected Publications">
          <div className="grid gap-4">
            {relatedPublications.map((publication) => (
              <EntityCard
                key={publication.id}
                href={`/publications/${publication.slug}`}
                eyebrow={publication.publicationType}
                title={publication.title}
                description={publication.abstract}
                meta={publication.journalOrConference}
                tags={publication.researchAreas}
              />
            ))}
          </div>
        </DetailSection>
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <DetailSection title="Research Groups">
          <div className="grid gap-4">
            {relatedGroups.map((group) => (
              <EntityCard
                key={group.id}
                href={`/groups/${group.slug}`}
                eyebrow="Research Group"
                title={group.name}
                description={group.description}
                meta={`${group.membersCount} members`}
                tags={group.focusAreas}
              />
            ))}
          </div>
        </DetailSection>

        <DetailSection title="Same Department">
          <div className="grid gap-4">
            {sameDepartment.map((peer) => (
              <EntityCard
                key={peer.id}
                href={`/researchers/${peer.slug}`}
                eyebrow={peer.designation}
                title={`${peer.firstName} ${peer.lastName}`}
                description={peer.expertiseSummary}
                meta={peer.faculty}
                tags={peer.researchAreas}
              />
            ))}
          </div>
        </DetailSection>
      </div>
    </div>
  );
}
