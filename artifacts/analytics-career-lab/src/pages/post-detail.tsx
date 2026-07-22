import { useState } from "react";
import { useGetPost, useDeletePost, getGetPostQueryKey, getListPostsQueryKey } from "@workspace/api-client-react";
import { Link, useParams, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Markdown } from "@/components/markdown";
import { EditPost } from "@/components/edit-post";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Calendar, Clock, Tag, Pencil, Trash2, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function PostDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const [, navigate] = useLocation();
  const [editOpen, setEditOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: post, isLoading } = useGetPost(id, {
    query: { enabled: !!id, queryKey: getGetPostQueryKey(id) }
  });

  const { mutate: deletePost, isPending: isDeleting } = useDeletePost({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
        navigate("/guides");
      },
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-24" />
        <div className="space-y-4 pt-8">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
        </div>
        <Skeleton className="h-96 w-full mt-12" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl space-y-4">
        <Link href="/guides" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Guides
        </Link>
        <div className="border border-dashed rounded-xl p-12 text-center space-y-2">
          <p className="text-lg font-medium">Post not found</p>
          <p className="text-sm text-muted-foreground">This post may have been removed or the link is incorrect.</p>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto space-y-12">
      <div className="flex items-center justify-between">
        <Link href="/guides" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Guides
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete post?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete "{post.title}". This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deletePost({ id })}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isDeleting}
                >
                  {isDeleting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Deleting…</> : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <EditPost post={post} open={editOpen} onOpenChange={setEditOpen} />

      <header className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">{post.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-y py-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formatDate(post.createdAt)}
          </div>
          {post.readingTimeMinutes && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readingTimeMinutes} min read
            </div>
          )}
          {post.visibility !== "public" && (
            <Badge variant={post.visibility as any} className="ml-auto">{post.visibility}</Badge>
          )}
        </div>
      </header>

      {post.body && (
        <section>
          <Markdown className="prose-lg">{post.body}</Markdown>
        </section>
      )}

      {post.tags && post.tags.length > 0 && (
        <footer className="pt-8 border-t flex items-center gap-3 flex-wrap mt-16">
          <Tag className="w-4 h-4 text-muted-foreground" />
          {post.tags.map(tag => (
            <span key={tag} className="text-sm font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
              {tag}
            </span>
          ))}
        </footer>
      )}
    </article>
  );
}
