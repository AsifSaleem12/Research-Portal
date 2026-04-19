import { PortalSearchBar } from './portal-search-bar';

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  searchScope?: string;
  showSearchBar?: boolean;
};

export function PageIntro({
  eyebrow,
  title,
  description,
  searchScope,
  showSearchBar = true,
}: PageIntroProps) {
  return (
    <section className="container-shell pt-10 sm:pt-12">
      <div className="space-y-4">
        <p className="muted-label">{eyebrow}</p>
        <h1 className="headline-balance max-w-4xl font-serif text-[2.4rem] text-ink sm:text-[3.1rem]">
          {title}
        </h1>
        <p className="max-w-3xl text-[15px] leading-7 text-slate-600">{description}</p>
        {showSearchBar ? <PortalSearchBar scope={searchScope} className="max-w-3xl" /> : null}
      </div>
    </section>
  );
}
