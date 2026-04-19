import { DetailHero } from '../../../components/shared/detail-hero';
import { DetailSection } from '../../../components/shared/detail-section';
import { EntityCard } from '../../../components/shared/entity-card';
import { getDepartmentBySlug } from '../../../lib/portal-data';

export default function DepartmentDetailPage({ params }: { params: { slug: string } }) {
  const { department, researchers, groups, projects, publications, theses } =
    getDepartmentBySlug(params.slug);

  return (
    <div className="container-shell space-y-8 pb-8">
      <DetailHero
        eyebrow={department.faculty}
        title={department.name}
        description={department.description}
        meta={[
          `${department.stats.researchers} researchers`,
          `${department.stats.publications} publications`,
          `${department.stats.projects} projects`,
          `${department.stats.theses} theses`,
        ]}
        searchScope="departments"
      />

      <div className="grid gap-8 xl:grid-cols-2">
        <DetailSection title="Researchers">
          <div className="grid gap-4">
            {researchers.map((researcher) => (
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
        </DetailSection>

        <DetailSection title="Research Groups">
          <div className="grid gap-4">
            {groups.map((group) => (
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
      </div>

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

        <DetailSection title="Publications and Theses">
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
            {theses.map((thesis) => (
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
        </DetailSection>
      </div>
    </div>
  );
}
