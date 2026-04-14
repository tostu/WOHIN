export function Footer() {
  return (
    <footer className="relative z-10 mx-auto w-full max-w-6xl px-6 py-16">
      <div className="flex flex-col items-start gap-6 border-t border-ink/10 pt-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-2xl font-black tracking-tight text-ink">
            wohin.
          </p>
          <p className="mt-1 text-xs font-semibold tracking-widest text-muted uppercase">
            The Radiant Curator
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-4 text-xs font-bold tracking-widest text-muted uppercase">
          <a href="/home" className="transition-colors hover:text-ink">
            Discover
          </a>
          <a href="/submit" className="transition-colors hover:text-ink">
            Submit
          </a>
          <a href="/map" className="transition-colors hover:text-ink">
            Map
          </a>
        </nav>

        <div className="flex items-center gap-3 text-xs font-semibold text-muted">
          <a
            href="/"
            className="rounded-full border border-ink/10 px-3 py-1 tracking-wider uppercase transition-colors hover:border-ink hover:text-ink"
          >
            en
          </a>
          <a
            href="/de"
            className="rounded-full border border-ink/10 px-3 py-1 tracking-wider uppercase transition-colors hover:border-ink hover:text-ink"
          >
            de
          </a>
        </div>
      </div>

      <p className="mt-8 text-xs font-medium text-muted">
        © {new Date().getFullYear()} Wohin. Sun-drenched social edition.
      </p>
    </footer>
  );
}
