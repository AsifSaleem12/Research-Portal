import { PageIntro } from '../../components/shared/page-intro';

export default function HelpPage() {
  return (
    <div className="container-shell space-y-8 pb-8">
      <PageIntro
        eyebrow="Help"
        title="Portal Guide"
        description="Use search and category pages to locate people, outputs, and academic units."
        searchScope="all"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="surface p-6">
          <h2 className="font-serif text-2xl text-ink">Researchers</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Researcher pages list expertise, affiliations, projects, and publications.
          </p>
        </div>
        <div className="surface p-6">
          <h2 className="font-serif text-2xl text-ink">Outputs</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Publication and thesis records connect outputs to authors, supervisors, and research areas.
          </p>
        </div>
        <div className="surface p-6">
          <h2 className="font-serif text-2xl text-ink">Academic Units</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Department and research group pages show where research activity is organized.
          </p>
        </div>
      </div>
    </div>
  );
}
