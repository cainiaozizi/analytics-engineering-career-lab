import { useGetHomepageData, useGetStats, useSearchContent, getSearchContentQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ArrowRight, Folder, FileText } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { formatDate } from "@/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  project: "project",
  post: "guide",
  note: "interview prep",
};

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: home, isLoading: homeLoading } = useGetHomepageData();
  
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  const { data: searchResults, isLoading: searchLoading } = useSearchContent(
    { q: debouncedSearch },
    { query: { enabled: debouncedSearch.length > 2, queryKey: getSearchContentQueryKey({ q: debouncedSearch }) } }
  );

  return (
    <div className="space-y-10">
      {/* Intro */}
      <section className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Zi's Analytics Engineering Lab</h1>
        <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">A working knowledge base and public portfolio — where I document what I build, what I know, and what I'm learning.</p>
        <Link href="/about" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          About me <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
      {/* Search */}
      <section className="relative z-10 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, guides, interview prep..." 
            className="pl-10 h-12 text-base rounded-xl bg-card border-2 border-border shadow-sm focus-visible:ring-primary"
          />
        </div>
        
        {debouncedSearch.length > 2 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-xl shadow-xl overflow-hidden max-h-96 overflow-y-auto">
            {searchLoading ? (
              <div className="p-4 space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : searchResults?.results?.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No results found for "{debouncedSearch}"</div>
            ) : (
              <div className="flex flex-col">
                {searchResults?.results?.map((result) => {
                  const itemHref =
                    result.type === 'project' ? `/projects/${result.id}` :
                    result.type === 'post' ? `/guides/${result.id}` :
                    `/interview-prep/${result.id}`;
                  const sectionHref =
                    result.type === 'project' ? '/projects' :
                    result.type === 'post' ? '/guides' :
                    '/interview-prep';
                  return (
                    <div
                      key={`${result.type}-${result.id}`}
                      className="flex flex-col p-4 border-b last:border-0 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Link href={itemHref} className="font-medium hover:text-primary transition-colors">
                          {result.title}
                        </Link>
                        <Link
                          href={sectionHref}
                          className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {TYPE_LABELS[result.type] ?? result.type}
                        </Link>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{result.excerpt}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>
      {/* Stats Bar */}
      <section>
        <div className="grid grid-cols-2 gap-4">
          {statsLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)
          ) : stats ? (
            <>
              <StatCard icon={Folder}   label="Projects" value={stats.publicProjects} />
              <StatCard icon={FileText} label="Guides"   value={stats.publicPosts} />
            </>
          ) : null}
        </div>
      </section>
      {/* Content Grids */}
      {homeLoading ? (
        <div className="space-y-8">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : home ? (
        <div className="space-y-10">
          {/* Featured Projects */}
          {home.featuredProjects.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold tracking-tight">Featured Projects</h2>
                <Link href="/projects" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {home.featuredProjects.map(project => (
                  <Link key={project.id} href={`/projects/${project.id}`} className="group h-full">
                    <Card className="h-full flex flex-col transition-all hover:border-primary/50 hover:shadow-md">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <CardTitle className="group-hover:text-primary transition-colors">{project.title}</CardTitle>
                          <Badge variant={project.visibility as any}>{project.visibility}</Badge>
                        </div>
                        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="mt-auto pt-0 flex flex-wrap gap-2">
                        {project.techStack?.slice(0, 3).map(tech => (
                          <span key={tech} className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded-md">
                            {tech}
                          </span>
                        ))}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Guides */}
            {home.featuredKnowledge.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold tracking-tight">Guides</h2>
                  <Link href="/guides" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                    All guides <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {home.featuredKnowledge.map(post => (
                    <Link key={post.id} href={`/guides/${post.id}`} className="group block">
                      <div className="p-4 rounded-xl border border-transparent hover:border-border hover:bg-card transition-all">
                        <div className="flex items-baseline justify-between mb-1">
                          <h3 className="font-semibold group-hover:text-primary transition-colors">{post.title}</h3>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{formatDate(post.createdAt)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{post.summary}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Interview Prep */}
            {home.recentNotes.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold tracking-tight">Interview Prep</h2>
                  <Link href="/interview-prep" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                    All entries <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {home.recentNotes.map(note => (
                    <Link key={note.id} href={`/interview-prep/${note.id}`} className="group block">
                      <div className="p-4 rounded-xl border border-transparent hover:border-border hover:bg-card transition-all">
                        <div className="flex items-baseline justify-between mb-1">
                          <h3 className="font-semibold group-hover:text-primary transition-colors">{note.title}</h3>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{formatDate(note.createdAt)}</span>
                        </div>
                        {note.tags && note.tags.length > 0 && (
                          <p className="text-sm text-muted-foreground">{note.tags.slice(0, 3).join(" · ")}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any, label: string, value: number }) {
  return (
    <Card className="bg-card border-border shadow-sm">
      <CardContent className="p-4 md:p-6 flex flex-col items-center justify-center text-center space-y-2">
        <Icon className="w-5 h-5 text-primary mb-1 md:mb-2" />
        <p className="text-2xl md:text-3xl font-bold font-mono">{value}</p>
        <p className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
      </CardContent>
    </Card>
  );
}
