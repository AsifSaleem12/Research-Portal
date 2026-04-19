import { EntityCard } from '../../components/shared/entity-card';
import { PageIntro } from '../../components/shared/page-intro';
import { getGroups } from '../../lib/portal-data';

export default function GroupsPage() {
  const items = getGroups();

  return (
    <div className="container-shell space-y-8 pb-8">
      <PageIntro
        eyebrow="Research Groups"
        title="Research Groups"
        description="Research labs and groups across the university."
        searchScope="groups"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {items.map((group) => (
          <EntityCard
            key={group.id}
            href={`/groups/${group.slug}`}
            eyebrow="Research Group"
            title={group.name}
            description={group.description}
            meta={`${group.membersCount} members • ${group.publicationsCount} publications`}
            tags={group.focusAreas}
          />
        ))}
      </div>
    </div>
  );
}
