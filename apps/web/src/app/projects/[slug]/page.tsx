import { DetailHero } from '../../../components/shared/detail-hero';
import { DetailSection } from '../../../components/shared/detail-section';
import { EntityCard } from '../../../components/shared/entity-card';
import { getProjectBySlug } from '../../../lib/portal-data';

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const { project, pi, members, department, linkedPublications, relatedProjects } =
    getProjectBySlug(params.slug);

  return (
    <div className="container-shell space-y-8 pb-8">
      <DetailHero
        eyebrow={project.status}
        title={project.title}
        description={project.abstract}
        meta={[
          department?.name ?? 'Department not assigned',
          `Funding agency: ${project.fundingAgency}`,
          `Budget: ${project.budgetLabel}`,
          `Timeline: ${project.startDate} to ${project.endDate}`,
          `Lead: ${pi ? `${pi.firstName} ${pi.lastName}` : 'Pending assignment'}`,
        ]}
        searchScope="projects"
      />

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <DetailSection title="Project Team">
          <div className="space-y-4">
            {pi ? (
              <div>
                <div className="font-semibold text-ink">Principal Investigator</div>
                <div>{pi.firstName} {pi.lastName}</div>
              </div>
            ) : null}
            {members.map((member) => (
              <div key={member.id}>
                <div className="font-semibold text-ink">
                  {member.firstName} {member.lastName}
                </div>
                <div>{member.designation}</div>
              </div>
            ))}
          </div>
        </DetailSection>

        <DetailSection title="Project Summary">
          <p>{project.abstract}</p>
        </DetailSection>
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <DetailSection title="Linked Publications">
          <div className="grid gap-4">
            {linkedPublications.map((publication) => (
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

        <DetailSection title="Related Projects">
          <div className="grid gap-4">
            {relatedProjects.map((item) => (
              <EntityCard
                key={item.id}
                href={`/projects/${item.slug}`}
                eyebrow={item.status}
                title={item.title}
                description={item.abstract}
                meta={item.fundingAgency}
              />
            ))}
          </div>
        </DetailSection>
      </div>
    </div>
  );
}
