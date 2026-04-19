import { PageIntro } from '../../components/shared/page-intro';

export default function AboutPage() {
  return (
    <div className="container-shell space-y-8 pb-8">
      <PageIntro
        eyebrow="About"
        title="About the Portal"
        description="The portal provides a structured view of LGU researchers, outputs, projects, and academic units."
        searchScope="all"
      />

      <div className="surface grid gap-6 p-8 lg:grid-cols-3">
        <div>
          <h2 className="font-serif text-2xl text-ink">Unified Access</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Search and browse tools provide access to researchers, publications, projects, and theses.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-2xl text-ink">Academic Context</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Records are connected to departments, research groups, and subject areas.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-2xl text-ink">Institutional Record</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            The portal supports public visibility of institutional research activity and output.
          </p>
        </div>
      </div>
    </div>
  );
}
