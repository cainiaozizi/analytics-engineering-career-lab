import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useUpdatePost, useFormatBody,
  getListPostsQueryKey, getGetPostQueryKey,
} from "@workspace/api-client-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Markdown } from "@/components/markdown";
import { TagPicker } from "@/components/tag-picker";
import { Loader2, Wand2, CheckCircle2 } from "lucide-react";

interface Post {
  id: number;
  title: string;
  summary: string;
  body: string;
  tags?: string[] | null;
  visibility: "public" | "private" | "draft";
}

interface EditPostProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPost({ post, open, onOpenChange }: EditPostProps) {
  const [fields, setFields] = useState({ ...post, tags: post.tags ?? [] });
  const [saved, setSaved] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // Reset fields whenever the post prop changes (e.g. navigating between posts)
  useState(() => { setFields({ ...post, tags: post.tags ?? [] }); });

  const queryClient = useQueryClient();

  const { mutate: updatePost, isPending } = useUpdatePost({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetPostQueryKey(post.id) });
        setSaved(true);
      },
    },
  });

  const { mutate: formatBody, isPending: isFormatting } = useFormatBody({
    mutation: {
      onSuccess: (result) => set("body", result.body),
    },
  });

  function set<K extends keyof typeof fields>(key: K, value: (typeof fields)[K]) {
    setFields(f => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    updatePost({
      id: post.id,
      data: {
        title: fields.title,
        summary: fields.summary,
        body: fields.body || undefined,
        tags: fields.tags,
        visibility: fields.visibility,
      },
    });
  }

  function handleClose() {
    onOpenChange(false);
    setTimeout(() => setSaved(false), 300);
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>Edit Post</SheetTitle>
          <SheetDescription>Update your post. Changes are saved immediately on click.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={fields.title} onChange={e => set("title", e.target.value)} placeholder="Post title" />
          </div>

          <div className="space-y-1.5">
            <Label>Summary</Label>
            <Textarea
              value={fields.summary}
              onChange={e => set("summary", e.target.value)}
              placeholder="One or two sentences shown in the post list"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Visibility</Label>
              <Select value={fields.visibility} onValueChange={v => set("visibility", v as typeof fields.visibility)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Tags</Label>
            <TagPicker value={fields.tags} onChange={tags => set("tags", tags)} />
          </div>

          {/* Body with preview tabs */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Body</Label>
              <button
                type="button"
                onClick={() => formatBody({ data: { body: fields.body, title: fields.title, context: "post" } })}
                disabled={isFormatting || !fields.body}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {isFormatting
                  ? <><Loader2 className="h-3 w-3 animate-spin" /> Fixing…</>
                  : <><Wand2 className="h-3 w-3" /> Fix format</>}
              </button>
            </div>
            <Tabs defaultValue="edit">
              <TabsList className="w-full mb-2">
                <TabsTrigger value="edit" className="flex-1">Edit</TabsTrigger>
                <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="edit">
                <Textarea
                  ref={bodyRef}
                  value={fields.body}
                  onChange={e => set("body", e.target.value)}
                  placeholder="Write in Markdown…"
                  rows={18}
                  className="font-mono text-sm"
                />
              </TabsContent>
              <TabsContent value="preview">
                {fields.body
                  ? <div className="border rounded-xl p-6"><Markdown>{fields.body}</Markdown></div>
                  : <div className="border border-dashed rounded-xl p-8 text-center text-sm text-muted-foreground">Nothing to preview yet.</div>
                }
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="px-6 py-4 border-t flex items-center justify-between gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" /> Saved
            </span>
          )}
          <div className="flex gap-3 ml-auto">
            <Button variant="ghost" onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving…</> : "Save changes"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
