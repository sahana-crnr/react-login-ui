import Link from "next/link";

const features = [
  {
    title: "App Router",
    description: "Use `app/` for layouts, pages, and route-aware composition.",
  },
  {
    title: "TypeScript",
    description: "Start with typed components and a predictable project shape.",
  },
  {
    title: "Tailwind CSS",
    description: "Build the UI with utility classes and a small custom theme.",
  },
  {
    title: "Production-ready base",
    description: "Add routes, components, and data fetching without changing the scaffold.",
  },
];

const steps = [
  "Edit `app/page.tsx` to replace this landing page.",
  "Add reusable UI under `components/` as the app grows.",
  "Create route folders inside `app/` for pages like `/login` or `/dashboard`.",
  "Run `npm run dev` and iterate locally.",
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.24),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.16),_transparent_26%),linear-gradient(to_bottom,_#070b17,_#0b1020_36%,_#050816)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">
              Next.js Starter
            </p>
            <h1 className="mt-2 text-lg font-semibold text-white">
              Clean, typed, and ready to build on.
            </h1>
          </div>
          <Link
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noreferrer"
          >
            Next docs
          </Link>
        </header>

        <section className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
              Starter scaffold for your next product
            </div>

            <div className="space-y-5">
              <h2 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                A sharp Next.js base that is easy to extend.
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                This project gives you the App Router, TypeScript, and Tailwind out of the box.
                Swap the demo content for your real pages, then keep building from a simple, clean
                baseline.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                className="rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                href="/"
              >
                View starter
              </Link>
              <Link
                className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                href="https://nextjs.org/docs/app/getting-started"
                target="_blank"
                rel="noreferrer"
              >
                Build your app
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.22)] backdrop-blur-sm"
                >
                  <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-cyan-400/20 blur-3xl" />
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Project shape</p>
                  <p className="mt-1 text-sm text-slate-200">What this starter gives you</p>
                </div>
                <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-300">
                  Ready
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4 font-mono text-xs leading-6 text-slate-300">
                <p className="text-cyan-300">app/</p>
                <p className="pl-4">layout.tsx</p>
                <p className="pl-4">page.tsx</p>
                <p className="pl-4">globals.css</p>
                <p className="mt-3 text-cyan-300">public/</p>
                <p className="pl-4">static assets</p>
                <p className="mt-3 text-cyan-300">future/</p>
                <p className="pl-4">components/</p>
                <p className="pl-4">features/</p>
                <p className="pl-4">routes/</p>
              </div>

              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Next steps
                </h3>
                <ol className="space-y-3 text-sm leading-6 text-slate-300">
                  {steps.map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
