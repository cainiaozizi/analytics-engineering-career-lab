import { useState } from "react";
import { useListPosts } from "@workspace/api-client-react";
import { useAuth } from "@/context/auth";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, PenLine } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreatePost } from "@/components/create-post";

export default function Blog() {
  const { data: posts, isLoading } = useListPosts();
  const [createOpen, setCreateOpen] = useState(false);
  const { isOwner } = useAuth();

  return (
    <div className="space-y-10 max-w-3xl">
      <header className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Writings</h1>
            <p className="text-lg text-muted-foreground">What I know.</p>
          </div>
          {isOwner && (
            <Button size="sm" onClick={() => setCreateOpen(true)} className="shrink-0 mt-1">
              <PenLine className="w-3.5 h-3.5 mr-1.5" /> New post
            </Button>
          )}
        </div>
      </header>
      {isOwner && <CreatePost open={createOpen} onOpenChange={setCreateOpen} />}
      {isLoading ? (
        <div className="space-y-8">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : posts?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-xl border-dashed">
          No posts yet.
        </div>
      ) : (
        <div className="space-y-8">
          {posts?.map((post) => (
            <article key={post.id} className="group relative flex flex-col items-start justify-between">
              <div className="flex items-center gap-x-4 text-xs mb-3">
                <time dateTime={post.createdAt} className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(post.createdAt)}
                </time>
                {post.readingTimeMinutes && (
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readingTimeMinutes} min read
                  </span>
                )}
                {post.visibility !== "public" && (
                  <Badge variant={post.visibility as any} className="text-[10px] h-5 py-0">{post.visibility}</Badge>
                )}
              </div>
              <div className="group relative w-full">
                <h3 className="mt-3 text-2xl font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                  <Link href={`/writings/${post.id}`}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-4 line-clamp-3 text-base leading-relaxed text-muted-foreground">
                  {post.summary}
                </p>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 relative z-10">
                  {post.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/80 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
