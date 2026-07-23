import { useState } from "react";
import { useGetNote, useDeleteNote, getGetNoteQueryKey, getListNotesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Markdown } from "@/components/markdown";
import { EditNote } from "@/components/edit-note";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Calendar, Hash, Pencil, Trash2, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function NoteDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const [, navigate] = useLocation();
  const [editOpen, setEditOpen] = useState(false);

  const queryClient = useQueryClient();
  
  const { data: note, isLoading } = useGetNote(id, {
    query: { enabled: !!id, queryKey: getGetNoteQueryKey(id) }
  });

  const { mutate: deleteNote, isPending: isDeleting } = useDeleteNote({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListNotesQueryKey() });
        navigate("/interview-prep");
      },
    },
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
        <Link href="/interview-prep" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Interview Prep
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
        <Link href="/interview-prep" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Interview Prep
        </Link>
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" disabled={isDeleting}>
                {isDeleting
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Trash2 className="w-3.5 h-3.5" />}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete note?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete "{note.title}". This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => deleteNote({ id })}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
          </Button>
        </div>
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
