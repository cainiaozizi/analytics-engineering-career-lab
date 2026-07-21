import { useGetPost, getGetPostQueryKey } from "@workspace/api-client-react";
import { Link, useParams } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function PostDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  
  const { data: post, isLoading } = useGetPost(id, {
    query: { enabled: !!id, queryKey: getGetPostQueryKey(id) }
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
    return <div>Post not found.</div>;
  }

  return (
    <article className="max-w-3xl mx-auto space-y-12">
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Writing
      </Link>

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
        <section className="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-semibold prose-a:text-primary">
          {/* Simulated markdown rendering */}
          {post.body.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('# ')) return <h1 key={idx}>{paragraph.replace('# ', '')}</h1>;
            if (paragraph.startsWith('## ')) return <h2 key={idx}>{paragraph.replace('## ', '')}</h2>;
            if (paragraph.startsWith('### ')) return <h3 key={idx}>{paragraph.replace('### ', '')}</h3>;
            return <p key={idx}>{paragraph}</p>;
          })}
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
