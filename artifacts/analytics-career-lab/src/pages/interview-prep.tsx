import { useListInterviewTopics, useListInterviewEntries, getListInterviewEntriesQueryKey } from "@workspace/api-client-react";
import { useState } from "react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export default function InterviewPrep() {
  const [activeTopic, setActiveTopic] = useState<string | undefined>(undefined);

  const { data: topics, isLoading: topicsLoading } = useListInterviewTopics();
  const { data: entries, isLoading: entriesLoading } = useListInterviewEntries(
    activeTopic ? { topic: activeTopic } : undefined,
    { query: { queryKey: getListInterviewEntriesQueryKey(activeTopic ? { topic: activeTopic } : undefined) } }
  );

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      {/* Topics Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Interview Prep</h1>
          <p className="text-sm text-muted-foreground mt-1">Study materials and Q&A.</p>
        </div>

        {topicsLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : topics && topics.length > 0 ? (
          <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            <button
              onClick={() => setActiveTopic(undefined)}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                !activeTopic ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground"
              )}
            >
              All Topics
              <span className={cn(
                "ml-2 text-[10px] px-1.5 py-0.5 rounded-md tabular-nums",
                !activeTopic ? "bg-primary-foreground/20" : "bg-muted-foreground/10"
              )}>
                {topics.reduce((acc, t) => acc + t.count, 0)}
              </span>
            </button>
            {topics.map(t => (
              <button
                key={t.topic}
                onClick={() => setActiveTopic(t.topic)}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                  activeTopic === t.topic ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground"
                )}
              >
                {t.topic}
                <span className={cn(
                  "ml-2 text-[10px] px-1.5 py-0.5 rounded-md tabular-nums",
                  activeTopic === t.topic ? "bg-primary-foreground/20" : "bg-muted-foreground/10"
                )}>
                  {t.count}
                </span>
              </button>
            ))}
          </nav>
        ) : null}
      </aside>

      {/* Entries List */}
      <main className="flex-1 w-full max-w-3xl">
        {entriesLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : entries?.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border rounded-xl border-dashed">
            No questions found for this topic.
          </div>
        ) : (
          <div className="bg-card border rounded-xl shadow-sm">
            <Accordion type="multiple" className="w-full">
              {entries?.map(entry => (
                <AccordionItem key={entry.id} value={entry.id.toString()} className="px-6 last:border-0">
                  <AccordionTrigger className="hover:no-underline text-left text-base font-semibold leading-relaxed py-5 gap-4">
                    <span className="flex-1">{entry.question}</span>
                    <Badge variant={entry.difficulty} className="capitalize text-[10px] tracking-wider shrink-0">{entry.difficulty}</Badge>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6 space-y-4">
                    <div className="prose prose-slate dark:prose-invert text-sm max-w-none">
                      {entry.answer.split('\n\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 mt-6 border-t border-border/50">
                      <div className="flex gap-2">
                        {entry.tags?.map(tag => (
                          <span key={tag} className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link href={`/interview-prep/${entry.id}`} className="text-xs font-medium text-primary hover:underline">
                        View Details →
                      </Link>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </main>
    </div>
  );
}
