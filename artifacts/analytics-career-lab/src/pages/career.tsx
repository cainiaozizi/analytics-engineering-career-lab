import { useMemo, useState } from "react";
import { useListNotes } from "@workspace/api-client-react";
import { useAuth } from "@/context/auth";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CreateNote } from "@/components/create-note";
import { formatDate } from "@/lib/utils";
import { Hash, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Career() {
  const { data: notes, isLoading } = useListNotes();
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { isOwner } = useAuth();

  // Collect unique tags from notes that actually exist, in alphabetical order
  const availableTags = useMemo(() => {
    if (!notes) return [];
    const set = new Set<string>();
    notes.forEach((note) => {
      note.tags?.forEach((tag) => set.add(tag));
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [notes]);

  const filteredNotes = useMemo(() => {
    if (!notes) return [];
    if (selectedTags.length === 0) return notes;
    // Show notes that contain ALL of the selected tags (AND narrowing)
    return notes.filter((note) =>
      selectedTags.every((tag) => note.tags?.includes(tag))
    );
  }, [notes, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Career</h1>
          <p className="text-lg text-muted-foreground">Resources I have curated to help myself and others.</p>
        </div>
        {isOwner && (
          <Button onClick={() => setCreateOpen(true)} className="shrink-0">
            <Plus className="w-4 h-4 mr-1.5" /> New note
          </Button>
        )}
      </header>
      {isOwner && <CreateNote open={createOpen} onOpenChange={setCreateOpen} />}
      {!isLoading && availableTags.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">
              Filter by tag{selectedTags.length > 0 && " (narrowing)"}
            </span>
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const isActive = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "inline-flex items-center gap-1 text-xs uppercase font-semibold px-2 py-1 rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "text-muted-foreground bg-accent hover:bg-accent/70"
                  )}
                >
                  <Hash className="w-3 h-3" /> {tag}
                </button>
              );
            })}
          </div>
          {selectedTags.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {filteredNotes.length} {filteredNotes.length === 1 ? "note matches" : "notes match"} your selection
            </p>
          )}
        </div>
      )}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-xl border-dashed">
          {selectedTags.length > 0
            ? "No notes match the selected tags."
            : "No notes found."}
        </div>
      ) : (
        <div className="flex flex-col border rounded-xl overflow-hidden bg-card">
          {filteredNotes.map((note) => (
            <Link
              key={note.id}
              href={`/career/${note.id}`}
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
