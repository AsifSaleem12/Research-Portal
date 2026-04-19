import { DetailHero } from '../../../components/shared/detail-hero';
import { DetailSection } from '../../../components/shared/detail-section';
import { EntityCard } from '../../../components/shared/entity-card';
import { getGroupBySlug } from '../../../lib/portal-data';

export default function GroupDetailPage({ params }: { params: { slug: string } }) {
  const { group, lead, department, projects, publications } = getGroupBySlug(params.slug);

  return (
    <div className="container-shell space-y-8 pb-8">
      <DetailHero
        eyebrow="Research Group"
        title={group.name}
        description={group.description}
        meta={[
          department?.name ?? 'Department not assigned',
          `Lead: ${lead ? `${lead.firstName} ${lead.lastName}` : 'Pending assignment'}`,
          `${group.membersCount} members`,
          `${group.projectsCount} projects`,
          `${group.publicationsCount} publications`,
        ]}
        tags={group.focusAreas}
        searchScope="groups"
      />

      <div className="grid gap-8 xl:grid-cols-2">
        <DetailSection title="Projects">
          <div className="grid gap-4">
            {projects.map((project) => (
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

        <DetailSection title="Publications">
          <div className="grid gap-4">
            {publications.map((publication) => (
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
    </div>
  );
}
