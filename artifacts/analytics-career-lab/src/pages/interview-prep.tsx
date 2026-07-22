import { useState } from "react";
import { useListNotes } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CreateNote } from "@/components/create-note";
import { formatDate } from "@/lib/utils";
import { Hash, Plus } from "lucide-react";

export default function Notes() {
  const { data: notes, isLoading } = useListNotes();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-8 max-w-3xl">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Engineering Notes</h1>
          <p className="text-lg text-muted-foreground">Short snippets, reference materials, and half-baked ideas.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="shrink-0">
          <Plus className="w-4 h-4 mr-1.5" /> New note
        </Button>
      </header>

      <CreateNote open={createOpen} onOpenChange={setCreateOpen} />

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : notes?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-xl border-dashed">
          No notes found.
        </div>
      ) : (
        <div className="flex flex-col border rounded-xl overflow-hidden bg-card">
          {notes?.map((note) => (
            <Link 
              key={note.id} 
              href={`/notes/${note.id}`} 
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-4 border-b last:border-0 hover:bg-muted/50 transition-colors group"
            >
              <div className="flex-shrink-0 flex flex-row sm:flex-col justify-between sm:justify-start sm:w-28 gap-1">
                <span className="text-xs text-muted-foreground tabular-nums">{formatDate(note.createdAt)}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium group-hover:text-primary transition-colors truncate">
                  {note.title}
                </h3>
              </div>

              {note.tags && note.tags.length > 0 && (
                <div className="flex gap-2 flex-shrink-0">
                  {note.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 text-[10px] uppercase font-semibold text-muted-foreground bg-accent px-1.5 py-0.5 rounded">
                      <Hash className="w-3 h-3" /> {tag}
                    </span>
                  ))}
                  {note.tags.length > 2 && (
                    <span className="text-[10px] text-muted-foreground">+{note.tags.length - 2}</span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
