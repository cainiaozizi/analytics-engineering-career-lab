import { Mail, Github, Linkedin, Twitter } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-3xl space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">About Me</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          I build data products, infrastructure, and the tools that connect them.
        </p>
      </header>
      <div className="prose prose-slate dark:prose-invert prose-lg max-w-none text-muted-foreground leading-relaxed">
        <p>
          I’m an Analytics Engineering leader with a background spanning finance, analytics, and data engineering — from starting my career as a CPA to leading analytics teams and serving as a technical lead across SaaS and financial services.
        </p>
        <p>
          Much of my work sits at the intersection of business context and data architecture: revenue and consumption analytics, cost attribution, semantic layers, and governed data platforms built with dbt and Snowflake. More recently, I’ve been exploring how AI can make analytics engineering workflows faster and smarter without sacrificing trust and governance.
        </p>
        <p>
          This Career Lab is where I document projects, technical patterns, and things I learn along the way.
        </p>
        <p>
          Outside of work, I’m usually exploring new theater shows or learning something new—currently, the flute and ukulele.
        </p>
      </div>
      <section className="space-y-6 pt-8 border-t">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Core Competencies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">Data Architecture</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Data Warehouse Design (Snowflake, BigQuery)</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Data Modeling (dbt, Kimball, Data Vault)</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Orchestration (Airflow, Dagster, Prefect)</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Streaming & Event Tracking (Kafka, Snowplow)</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">Software Engineering</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Python (FastAPI, Pandas, PySpark)</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> TypeScript & React (Internal Tools, Dashboards)</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> CI/CD (GitHub Actions, GitLab CI)</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Infrastructure as Code (Terraform)</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="space-y-6 pt-8 border-t">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Contact</h2>
        <p className="text-muted-foreground">
          I'm always open to discussing data engineering, infrastructure, or interesting problems.
          Feel free to reach out.
        </p>
        <div className="flex flex-wrap gap-4">
          <a href="mailto:hello@example.com" className="inline-flex items-center gap-2 px-4 py-2 bg-card border rounded-lg hover:border-primary hover:text-primary transition-colors text-sm font-medium">
            <Mail className="w-4 h-4" /> hello@example.com
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-card border rounded-lg hover:border-primary hover:text-primary transition-colors text-sm font-medium">
            <Github className="w-4 h-4" /> GitHub
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-card border rounded-lg hover:border-primary hover:text-primary transition-colors text-sm font-medium">
            <Linkedin className="w-4 h-4" /> LinkedIn
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-card border rounded-lg hover:border-primary hover:text-primary transition-colors text-sm font-medium">
            <Twitter className="w-4 h-4" /> Twitter
          </a>
        </div>
      </section>
    </div>
  );
}
