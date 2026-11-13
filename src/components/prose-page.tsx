/** Layout for plain text pages (privacy, terms). */
export function ProsePage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <article className="max-w-2xl">
      <h1 className="text-4xl font-extrabold leading-[1.02] tracking-tight [font-variation-settings:'wdth'_78] sm:text-5xl">
        {title}
      </h1>
      <p className="mt-3 text-sm text-haze">
        Last updated <time dateTime={updated}>{new Date(updated).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</time>
      </p>
      <div className="mt-8 space-y-5 text-lg leading-relaxed text-paper/90 [&_a]:font-semibold [&_a]:text-paper [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-blush [&_h2]:pt-4 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:tracking-tight [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
        {children}
      </div>
    </article>
  );
}
