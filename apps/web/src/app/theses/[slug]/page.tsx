import { DetailHero } from '../../../components/shared/detail-hero';
import { DetailSection } from '../../../components/shared/detail-section';
import { EntityCard } from '../../../components/shared/entity-card';
import { getThesisBySlug } from '../../../lib/portal-data';

export default function ThesisDetailPage({ params }: { params: { slug: string } }) {
  const { thesis, department, supervisor, relatedTheses } = getThesisBySlug(params.slug);

  return (
    <div className="container-shell space-y-8 pb-8">
      <DetailHero
        eyebrow={thesis.degreeLevel}
        title={thesis.title}
        description={thesis.abstract}
        meta={[
          `Student: ${thesis.studentName}`,
          `Supervisor: ${supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : 'Pending assignment'}`,
          department?.name ?? 'Department not assigned',
          `Submitted ${thesis.submissionDate}`,
        ]}
        tags={[thesis.researchArea]}
        searchScope="theses"
      />

      <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <DetailSection title="Repository Abstract">
          <p>{thesis.abstract}</p>
        </DetailSection>

        <DetailSection title="Related Theses">
          <div className="grid gap-4">
            {relatedTheses.map((item) => (
              <EntityCard
                key={item.id}
                href={`/theses/${item.slug}`}
                eyebrow={item.degreeLevel}
                title={item.title}
                description={item.abstract}
                meta={`${item.studentName} • ${item.submissionDate}`}
                tags={[item.researchArea]}
              />
            ))}
          </div>
        </DetailSection>
      </div>
    </div>
  );
}
