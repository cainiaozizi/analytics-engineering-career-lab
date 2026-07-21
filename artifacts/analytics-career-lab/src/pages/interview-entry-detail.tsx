import { useGetInterviewEntry, getGetInterviewEntryQueryKey } from "@workspace/api-client-react";
import { Link, useParams } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function InterviewEntryDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  
  const { data: entry, isLoading } = useGetInterviewEntry(id, {
    query: { enabled: !!id, queryKey: getGetInterviewEntryQueryKey(id) }
  });

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-3xl">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!entry) {
    return <div>Entry not found.</div>;
  }

  return (
    <article className="max-w-3xl space-y-8">
      <Link href="/interview-prep" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Interview Prep
      </Link>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <header className="p-6 md:p-8 border-b bg-muted/10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <BookOpen className="w-4 h-4" />
              {entry.topic}
            </div>
            <Badge variant={entry.difficulty} className="uppercase tracking-wider text-[10px]">{entry.difficulty}</Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight">{entry.question}</h1>
        </header>

        <div className="p-6 md:p-8 prose prose-slate dark:prose-invert max-w-none text-base leading-relaxed">
          {entry.answer.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('```')) {
              const code = paragraph.replace(/```\w*\n?/, '').replace(/```$/, '');
              return (
                <pre key={idx} className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono my-4">
                  <code>{code}</code>
                </pre>
              );
            }
            return <p key={idx}>{paragraph}</p>;
          })}
        </div>

        {entry.tags && entry.tags.length > 0 && (
          <footer className="p-6 md:px-8 md:py-6 border-t bg-muted/10 flex flex-wrap gap-2">
            {entry.tags.map(tag => (
              <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-md bg-background border text-xs font-medium text-muted-foreground">
                {tag}
              </span>
            ))}
          </footer>
        )}
      </div>
    </article>
  );
}
