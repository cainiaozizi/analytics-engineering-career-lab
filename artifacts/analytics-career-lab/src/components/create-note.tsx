import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/auth";
import {
  useCreateNote, useFormatBody,
  getListNotesQueryKey,
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
import { Loader2, Wand2 } from "lucide-react";

interface CreateNoteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (id: number) => void;
}

const defaultFields = {
  title: "",
  body: "",
  tags: [] as string[],
  visibility: "draft" as "public" | "private" | "draft",
};

export function CreateNote({ open, onOpenChange, onCreated }: CreateNoteProps) {
  const { isOwner } = useAuth();
  const [fields, setFields] = useState({ ...defaultFields });

  if (!isOwner) return null;

  const queryClient = useQueryClient();

  const { mutate: createNote, isPending } = useCreateNote({
    mutation: {
      onSuccess: (note) => {
        queryClient.invalidateQueries({ queryKey: getListNotesQueryKey() });
        onOpenChange(false);
        setFields({ ...defaultFields });
        onCreated?.(note.id);
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
  }

  function handleSubmit() {
    createNote({
      data: {
        title: fields.title,
        body: fields.body || undefined,
        tags: fields.tags,
        visibility: fields.visibility,
      },
    });
  }

  function handleClose() {
    onOpenChange(false);
    setTimeout(() => setFields({ ...defaultFields }), 300);
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>New Note</SheetTitle>
          <SheetDescription>Create a new note. Fill in the details below and click Create note.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={fields.title} onChange={e => set("title", e.target.value)} placeholder="Note title" />
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

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Body</Label>
              <button
                type="button"
                onClick={() => formatBody({ data: { body: fields.body, title: fields.title, context: "note" } })}
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

        <div className="px-6 py-4 border-t flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isPending || !fields.title.trim()}>
            {isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Creating…</> : "Create note"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
