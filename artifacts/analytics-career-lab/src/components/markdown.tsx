import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import "highlight.js/styles/github.css";

interface MarkdownProps {
  children: string;
  className?: string;
}

export function Markdown({ children, className }: MarkdownProps) {
  return (
    <div
      className={[
        "prose prose-slate dark:prose-invert max-w-none",
        "prose-headings:font-semibold prose-headings:tracking-tight",
        "prose-h2:text-2xl prose-h3:text-xl",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        "prose-code:before:content-none prose-code:after:content-none",
        "prose-code:bg-muted prose-code:text-foreground prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono",
        "prose-pre:bg-muted prose-pre:border prose-pre:rounded-xl prose-pre:p-0 prose-pre:overflow-hidden",
        "prose-pre:prose-code:bg-transparent prose-pre:prose-code:p-0",
        "prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground",
        "prose-th:text-left prose-th:font-semibold",
        "prose-img:rounded-xl prose-img:border",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeSlug]}
        components={{
          pre({ children, ...props }) {
            return (
              <pre {...props} className="p-4 overflow-x-auto text-sm leading-relaxed">
                {children}
              </pre>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
