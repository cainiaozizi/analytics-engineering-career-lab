import { useState } from "react";
import { useGetProject, getGetProjectQueryKey } from "@workspace/api-client-react";
import { Link, useParams } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Markdown } from "@/components/markdown";
import { UploadProject } from "@/components/upload-project";
import { ArrowLeft, Github, ExternalLink, Calendar, Tag, Pencil } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ProjectDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const [editOpen, setEditOpen] = useState(false);
  
  const { data: project, isLoading } = useGetProject(id, {
    query: { enabled: !!id, queryKey: getGetProjectQueryKey(id) }
  });

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-3xl">
        <Skeleton className="h-8 w-24" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-3xl space-y-4">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>
        <div className="border border-dashed rounded-xl p-12 text-center space-y-2">
          <p className="text-lg font-medium">Project not found</p>
          <p className="text-sm text-muted-foreground">This project may have been removed or the link is incorrect.</p>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-3xl space-y-10">
      <div className="flex items-center justify-between">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>
        <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
          <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
        </Button>
      </div>

      {project && (
        <UploadProject open={editOpen} onOpenChange={setEditOpen} initialData={project} />
      )}

      <header className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant={project.visibility as any}>{project.visibility}</Badge>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {formatDate(project.createdAt)}
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{project.title}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">{project.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-4">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors bg-muted px-3 py-1.5 rounded-lg">
              <Github className="w-4 h-4" /> Repository
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors bg-primary/10 text-primary px-3 py-1.5 rounded-lg">
              <ExternalLink className="w-4 h-4" /> Live Demo
            </a>
          )}
        </div>
      </header>

      {project.techStack && project.techStack.length > 0 && (
        <section className="bg-card border rounded-xl p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map(tech => (
              <span key={tech} className="text-sm font-mono bg-muted px-2.5 py-1 rounded-md border">
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      {project.body && (
        <section>
          <Markdown>{project.body}</Markdown>
        </section>
      )}

      {project.tags && project.tags.length > 0 && (
        <footer className="pt-8 border-t flex items-center gap-3 flex-wrap">
          <Tag className="w-4 h-4 text-muted-foreground" />
          {project.tags.map(tag => (
            <span key={tag} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              #{tag}
            </span>
          ))}
        </footer>
      )}
    </article>
  );
}
