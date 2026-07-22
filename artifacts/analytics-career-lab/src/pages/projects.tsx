import { useState } from "react";
import { useListProjects } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { UploadProject } from "@/components/upload-project";
import { Github, ExternalLink, Calendar, Upload } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function Projects() {
  const { data: projects, isLoading } = useListProjects();
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-2">What you've built.</p>
        </div>
        <Button variant="outline" className="shrink-0" onClick={() => setUploadOpen(true)}>
          <Upload className="w-4 h-4 mr-2" /> Upload .md
        </Button>
      </div>

      <UploadProject open={uploadOpen} onOpenChange={setUploadOpen} />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : projects?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-xl border-dashed">
          No projects found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects?.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`} className="group h-full block">
              <Card className="h-full flex flex-col transition-all hover:border-primary/50 hover:shadow-md overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="group-hover:text-primary transition-colors text-xl leading-tight">
                      {project.title}
                    </CardTitle>
                    <Badge variant={project.visibility as any} className="shrink-0">{project.visibility}</Badge>
                  </div>
                  <CardDescription className="line-clamp-3 text-base">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-0 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.techStack?.map(tech => (
                      <span key={tech} className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded-md">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(project.createdAt)}
                    </div>
                    <div className="flex items-center gap-3">
                      {project.githubUrl && (
                        <div className="flex items-center gap-1 hover:text-foreground transition-colors">
                          <Github className="w-3.5 h-3.5" /> Code
                        </div>
                      )}
                      {project.liveUrl && (
                        <div className="flex items-center gap-1 hover:text-foreground transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" /> Live
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
