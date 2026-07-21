import { useGetNote, getGetNoteQueryKey } from "@workspace/api-client-react";
import { Link, useParams } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, Hash } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function NoteDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  
  const { data: note, isLoading } = useGetNote(id, {
    query: { enabled: !!id, queryKey: getGetNoteQueryKey(id) }
  });

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-2xl">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!note) {
    return <div>Note not found.</div>;
  }

  return (
    <article className="max-w-2xl space-y-8">
      <Link href="/notes" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Notes
      </Link>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <header className="p-6 border-b bg-muted/20">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <time dateTime={note.createdAt}>{formatDate(note.createdAt)}</time>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{note.title}</h1>
        </header>

        <div className="p-6">
          <div className="prose prose-slate dark:prose-invert prose-sm max-w-none">
            {note.body.split('\n\n').map((paragraph, idx) => {
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
        </div>

        {note.tags && note.tags.length > 0 && (
          <footer className="p-4 border-t bg-muted/20 flex flex-wrap gap-2">
            {note.tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-accent px-2 py-1 rounded-md">
                <Hash className="w-3 h-3" /> {tag}
              </span>
            ))}
          </footer>
        )}
      </div>
    </article>
  );
}
