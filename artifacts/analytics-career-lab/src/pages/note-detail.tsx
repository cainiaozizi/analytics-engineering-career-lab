import { useState } from "react";
import { useGetNote, getGetNoteQueryKey } from "@workspace/api-client-react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Markdown } from "@/components/markdown";
import { EditNote } from "@/components/edit-note";
import { ArrowLeft, Calendar, Hash, Pencil } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function NoteDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const [editOpen, setEditOpen] = useState(false);
  
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
    return (
      <div className="max-w-2xl space-y-4">
        <Link href="/notes" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Notes
        </Link>
        <div className="border border-dashed rounded-xl p-12 text-center space-y-2">
          <p className="text-lg font-medium">Note not found</p>
          <p className="text-sm text-muted-foreground">This note may have been removed or the link is incorrect.</p>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-2xl space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/notes" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Notes
        </Link>
        <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
          <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
        </Button>
      </div>

      <EditNote note={note} open={editOpen} onOpenChange={setEditOpen} />

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <header className="p-6 border-b bg-muted/20">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <time dateTime={note.createdAt}>{formatDate(note.createdAt)}</time>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{note.title}</h1>
        </header>

        <div className="p-6">
          <Markdown className="prose-sm">{note.body}</Markdown>
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
