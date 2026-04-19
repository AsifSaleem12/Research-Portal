import { EntityCard } from '../components/shared/entity-card';
import { JointArticlesMap } from '../components/shared/joint-articles-map';
import { SearchHero } from '../components/shared/search-hero';
import { SectionHeading } from '../components/shared/section-heading';
import { getHomePageData } from '../lib/portal-data';

export default async function HomePage() {
  const data = await getHomePageData();

  return (
    <div className="pb-8">
      <SearchHero
        title="Research discovery for Lahore Garrison University"
        description="Access researchers, publications, projects, research groups, departments, and theses from a single institutional portal."
        stats={data.statistics}
      />

      <section className="container-shell mt-14 space-y-6 sm:mt-16">
        <SectionHeading
          eyebrow="Featured Researchers"
          title="Researcher Profiles"
          description="Selected faculty profiles and current areas of expertise."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {data.featuredResearchers.map((researcher) => (
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
      </section>

      <section className="container-shell mt-14 grid gap-8 sm:mt-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Research Groups"
            title="Research Groups"
            description="Labs and units with linked members, projects, and publications."
          />
          <div className="grid gap-6">
            {data.featuredGroups.map((group) => (
              <EntityCard
                key={group.id}
                href={`/groups/${group.slug}`}
                eyebrow="Research Group"
                title={group.name}
                description={group.description}
                meta={`${group.membersCount} members • ${group.projectsCount} projects`}
                tags={group.focusAreas}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <SectionHeading
            eyebrow="Recent Publications"
            title="Recent Publications"
          />
          <div className="grid gap-6">
            {data.recentPublications.map((publication) => (
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
        </div>
      </section>

      <section className="container-shell mt-12 space-y-6 sm:mt-14">
        <SectionHeading
          eyebrow="Global Joint Articles"
          title="International Research Collaboration"
          description="Selected joint publications by partner country."
        />
        <div className="surface p-6 sm:p-8">
          <JointArticlesMap points={data.jointArticleMapPoints} />
        </div>
      </section>
    </div>
  );
}
