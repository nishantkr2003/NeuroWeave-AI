// import Navbar from '@/components/layout/Navbar';
// import Hero from '@/components/landing/Hero';
// import Features from '@/components/landing/Features';
// import UseCases from '@/components/landing/UseCases';

// const navItems = [
//   {
//     label: 'Capabilities',
//     bgColor: '#0d1117',
//     textColor: '#8b96a8',
//     links: [
//       { label: 'Image Analysis', href: '/auth/register', ariaLabel: 'Image analysis' },
//       { label: 'Video Intelligence', href: '/auth/register', ariaLabel: 'Video intelligence' },
//       { label: 'Audio Transcription', href: '/auth/register', ariaLabel: 'Audio transcription' },
//     ],
//   },
//   {
//     label: 'Use Cases',
//     bgColor: '#0d1117',
//     textColor: '#8b96a8',
//     links: [
//       { label: 'Document Extraction', href: '/auth/register', ariaLabel: 'Document extraction' },
//       { label: 'Meeting Analysis', href: '/auth/register', ariaLabel: 'Meeting analysis' },
//       { label: 'Multi-File Compare', href: '/auth/register', ariaLabel: 'Multi-file compare' },
//     ],
//   },
//   {
//     label: 'Get Started',
//     bgColor: '#0a1a12',
//     textColor: '#00e5a0',
//     links: [
//       { label: 'Register', href: '/auth/register', ariaLabel: 'Create account' },
//       { label: 'Login', href: '/auth/login', ariaLabel: 'Sign in' },
//     ],
//   },
// ];

// export default function LandingPage() {
//   return (
//     <main className="relative isolate min-h-screen overflow-hidden bg-(--bg-void)">
//       <div className="pointer-events-none absolute inset-0 grid-overlay opacity-30" />
//       <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_32%),radial-gradient(circle_at_20%_20%,rgba(0,229,160,0.08),transparent_22%)]" />
//       <Navbar items={navItems} />
//       <Hero />
//       <Features />
//       <UseCases />
//     </main>
//   );
// }










import Link from 'next/link';

const features = [
  {
    title: 'Unified media reasoning',
    description: 'Ask questions across images, videos, audio, and documents in one continuous conversation.',
  },
  {
    title: 'Instant insight delivery',
    description: 'Real-time summaries, structured extraction, and comparison powered by modern multimodal AI.',
  },
  {
    title: 'Secure session memory',
    description: 'Keep context from uploads, media selections and ongoing chats for faster follow-up workflows.',
  },
];

const benefits = [
  'One workspace for all media types',
  'Smart comparison across files',
  'Actionable summaries with timestamps',
  'Minimal UI and focused workflows',
];

export default function LandingPage() {
  return (
    <main
      className="relative isolate min-h-screen overflow-hidden text-white"
      style={{
        backgroundImage:
          'radial-gradient(circle at top, rgba(99,102,241,0.14), transparent 24%), radial-gradient(circle at 60% 10%, rgba(99,102,241,0.12), transparent 22%), #050507',
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08),transparent_22%)]" />

      <header className="section-shell relative z-10 flex flex-col gap-8 pt-8 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-3xl bg-white/8 px-4 py-3 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm border border-white/10">
            <span className="text-[11px] uppercase tracking-[0.35em] text-[#c7d2fe]">NeuroWeave-AI</span>
          </div>
          <div className="space-y-1 text-sm text-(--text-secondary)">
            <p className="font-semibold text-white">A new era of multimodal intelligence</p>
            <p className="text-xs uppercase tracking-[0.28em] text-(--text-muted)">Upload once. Ask anything.</p>
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-3 text-sm text-(--text-secondary)">
          <Link href="/auth/register" className="rounded-full border border-white/10 bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-500">Get Started</Link>
          <Link href="/auth/login" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-(--text-secondary) transition hover:bg-white/10">Sign In</Link>
        </nav>
      </header>

      <section className="section-shell relative z-10 grid gap-10 pb-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-8">
          <div className="max-w-3xl space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-[#c7d2fe] shadow-[0_8px_40px_rgba(99,102,241,0.12)]">
              Intelligent media synthesis
            </p>
            <h1 className="text-5xl font-semibold tracking-tighter text-white sm:text-6xl md:text-7xl">NeuroWeave-AI</h1>
            <p className="max-w-2xl text-lg leading-8 text-(--text-secondary)">
              Transform images, video, audio and documents into a single intelligent story. NeuroWeave-AI blends fast media analysis, extraction, and chat so you can discover insights instantly.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_40px_80px_rgba(0,0,0,0.3)] backdrop-blur-lg">
              <p className="text-sm uppercase tracking-[0.32em] text-[#c7d2fe]">Focused workflow</p>
              <p className="mt-4 text-base text-(--text-secondary)">A modern workspace for uploading files, exploring analysis, and chatting with context preserved across media.</p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_40px_80px_rgba(0,0,0,0.3)] backdrop-blur-lg">
              <p className="text-sm uppercase tracking-[0.32em] text-[#c7d2fe]">Instant comparisons</p>
              <p className="mt-4 text-base text-(--text-secondary)">Compare multiple media files side by side, surface the differences, and get a single synthesized answer.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link href="/auth/register" className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500">
              Start with NeuroWeave-AI
            </Link>
            <Link href="/auth/login" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm text-(--text-secondary) transition hover:bg-white/10">
              Explore the demo
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(0,229,160,0.18),transparent_32%)]" />
          <div className="relative space-y-6">
            <div className="rounded-4xl border border-white/10 bg-[#081114]/95 p-6 text-sm text-(--text-secondary) shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
              <p className="text-xs uppercase tracking-[0.3em] text-[#c7d2fe]">Live session preview</p>
              <p className="mt-4 leading-7">Upload media and keep your context alive across conversations. NeuroWeave-AI remembers selected files, transcriptions, and analysis so you can iterate faster.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map((item) => (
                <div key={item} className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-(--text-secondary)">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell grid gap-8 pb-24 md:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="rounded-4xl border border-white/10 bg-white/5 p-8 shadow-[0_40px_80px_rgba(0,0,0,0.2)] transition hover:-translate-y-1 hover:border-indigo-500/40">
            <h2 className="text-xl font-semibold text-white">{feature.title}</h2>
            <p className="mt-4 text-sm leading-7 text-(--text-secondary)">{feature.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
