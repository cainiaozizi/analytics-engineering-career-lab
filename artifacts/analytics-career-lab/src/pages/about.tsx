import { Mail, Linkedin } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-3xl space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-center gap-6 pb-4">
        <img
          src={`${import.meta.env.BASE_URL}profile.jpg`}
          alt="Zi Liu"
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover ring-2 ring-primary/15 shadow-sm shrink-0"
        />
        <div className="space-y-1.5">
          <h1 className="text-4xl font-bold tracking-tight">Zi Liu</h1>
          <p className="text-base text-muted-foreground font-medium">
            Data Analytics &amp; Engineering | SaaS | Finance
          </p>
        </div>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
        <p>
          I'm an Analytics Engineering leader with a background spanning finance, analytics, and data engineering — from starting my career as a CPA to leading analytics teams and serving as a technical lead across SaaS and financial services.
        </p>
        <p>
          Much of my work sits at the intersection of business context and data architecture: revenue and consumption analytics, cost attribution, semantic layers, and governed data platforms built with dbt and Snowflake. More recently, I've been exploring how AI can make analytics engineering workflows faster and smarter without sacrificing trust and governance.
        </p>
        <p>
          This Career Lab is where I document projects, technical patterns, and things I learn along the way.
        </p>
        <p>
          Outside of work, I'm usually exploring new theater shows or learning something new—currently, the flute and ukulele.
        </p>
      </div>

      <section className="space-y-6 pt-8 border-t">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Core Competencies</h2>
          <p className="text-sm text-muted-foreground">Where I spend most of my time and energy.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">Data Analytics</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> Financial &amp; Revenue Analytics</li>
              <li className="flex items-start gap-2.5"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> Product &amp; Usage Analytics</li>
              <li className="flex items-start gap-2.5"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> Metric Design &amp; Semantic Layers</li>
              <li className="flex items-start gap-2.5"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> Cost Attribution &amp; Optimization</li>
              <li className="flex items-start gap-2.5"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> Data Governance</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">Analytics Engineering &amp; AI</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> SQL &amp; Python</li>
              <li className="flex items-start gap-2.5"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> dbt, Snowflake &amp; BigQuery</li>
              <li className="flex items-start gap-2.5"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> Data Modeling &amp; Data Pipelines</li>
              <li className="flex items-start gap-2.5"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> Git, Testing &amp; CI/CD</li>
              <li className="flex items-start gap-2.5"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> AI-Assisted &amp; Agentic Analytics Workflows</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-4 pt-8 border-t">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Contact</h2>
        <p className="text-muted-foreground">
          Always happy to connect and talk about analytics engineering, AI, or interesting data problems. Feel free to reach out!
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="mailto:jazziliu101@gmail.com" className="inline-flex items-center gap-2 px-4 py-2 bg-card border rounded-lg hover:border-primary hover:text-primary transition-colors text-sm font-medium">
            <Mail className="w-4 h-4" /> jazziliu101@gmail.com
          </a>
          <a href="https://www.linkedin.com/in/zi-liu-4877a882/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-card border rounded-lg hover:border-primary hover:text-primary transition-colors text-sm font-medium">
            <Linkedin className="w-4 h-4" /> LinkedIn
          </a>
        </div>
      </section>
    </div>
  );
}
