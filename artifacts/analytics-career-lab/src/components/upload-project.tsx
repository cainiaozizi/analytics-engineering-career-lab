import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateProject, getListProjectsQueryKey } from "@workspace/api-client-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Markdown } from "@/components/markdown";
import { Upload, FileText, CheckCircle2 } from "lucide-react";

interface ParsedProject {
  title: string;
  description: string;
  body: string;
  tags: string;
  techStack: string;
  githubUrl: string;
  liveUrl: string;
  visibility: "public" | "private" | "draft";
  featured: boolean;
}

function parseFrontmatter(raw: string): ParsedProject {
  const defaults: ParsedProject = {
    title: "", description: "", body: "", tags: "", techStack: "",
    githubUrl: "", liveUrl: "", visibility: "draft", featured: false,
  };

  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { ...defaults, body: raw.trim() };

  const [, frontmatter, body] = match;
  const result = { ...defaults, body: body.trim() };

  for (const line of frontmatter.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    if (!value) continue;

    switch (key) {
      case "title":       result.title = value; break;
      case "description": result.description = value; break;
      case "tags":        result.tags = value; break;
      case "techStack":   result.techStack = value; break;
      case "githubUrl":   result.githubUrl = value; break;
      case "liveUrl":     result.liveUrl = value; break;
      case "visibility":
        if (value === "public" || value === "private" || value === "draft")
          result.visibility = value;
        break;
      case "featured":    result.featured = value === "true"; break;
    }
  }

  return result;
}

function toArray(csv: string): string[] {
  return csv.split(",").map(s => s.trim()).filter(Boolean);
}

interface UploadProjectProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadProject({ open, onOpenChange }: UploadProjectProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [fields, setFields] = useState<ParsedProject | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const queryClient = useQueryClient();
  const { mutate: createProject, isPending } = useCreateProject({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        setSubmitted(true);
      },
    },
  });

  function handleFile(file: File) {
    if (!file.name.endsWith(".md")) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      setFields(parseFrontmatter(text));
      setSubmitted(false);
    };
    reader.readAsText(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function set(key: keyof ParsedProject, value: string | boolean) {
    setFields(f => f ? { ...f, [key]: value } : f);
  }

  function handleSubmit(visibility: "public" | "draft") {
    if (!fields) return;
    createProject({
      data: {
        title: fields.title,
        description: fields.description,
        body: fields.body || undefined,
        tags: toArray(fields.tags),
        techStack: toArray(fields.techStack),
        githubUrl: fields.githubUrl || undefined,
        liveUrl: fields.liveUrl || undefined,
        visibility,
        featured: fields.featured,
      },
    });
  }

  function handleClose() {
    onOpenChange(false);
    setTimeout(() => {
      setFields(null);
      setFileName("");
      setSubmitted(false);
    }, 300);
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>Upload Project</SheetTitle>
          <SheetDescription>
            Upload a <code className="text-xs bg-muted px-1 py-0.5 rounded">.md</code> file
            using the project template. Review the fields, then publish or save as draft.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
              ${fileName ? "border-primary/40 bg-primary/5" : "border-muted-foreground/25 hover:border-primary/40 hover:bg-muted/50"}`}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".md"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
            {fileName ? (
              <div className="flex flex-col items-center gap-2">
                <FileText className="w-8 h-8 text-primary" />
                <p className="text-sm font-medium">{fileName}</p>
                <p className="text-xs text-muted-foreground">Click to replace</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm font-medium">Drop your .md file here</p>
                <p className="text-xs text-muted-foreground">or click to browse</p>
              </div>
            )}
          </div>

          {/* Success state */}
          {submitted && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Project saved</p>
                <p className="text-xs opacity-75">It will appear in your Projects list now.</p>
              </div>
            </div>
          )}

          {/* Fields */}
          {fields && !submitted && (
            <Tabs defaultValue="fields">
              <TabsList className="w-full">
                <TabsTrigger value="fields" className="flex-1">Fields</TabsTrigger>
                <TabsTrigger value="preview" className="flex-1">Body Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="fields" className="space-y-4 mt-4">
                <div className="space-y-1.5">
                  <Label>Title <span className="text-destructive">*</span></Label>
                  <Input value={fields.title} onChange={e => set("title", e.target.value)} placeholder="Project name" />
                </div>

                <div className="space-y-1.5">
                  <Label>Description <span className="text-destructive">*</span></Label>
                  <Textarea
                    value={fields.description}
                    onChange={e => set("description", e.target.value)}
                    placeholder="One or two sentences for the project card"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Visibility</Label>
                    <Select value={fields.visibility} onValueChange={v => set("visibility", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Featured on homepage</Label>
                    <Select value={fields.featured ? "true" : "false"} onValueChange={v => set("featured", v === "true")}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">No</SelectItem>
                        <SelectItem value="true">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Tech Stack</Label>
                  <Input
                    value={fields.techStack}
                    onChange={e => set("techStack", e.target.value)}
                    placeholder="Python, dbt, BigQuery"
                  />
                  <p className="text-xs text-muted-foreground">Comma-separated</p>
                </div>

                <div className="space-y-1.5">
                  <Label>Tags</Label>
                  <Input
                    value={fields.tags}
                    onChange={e => set("tags", e.target.value)}
                    placeholder="dbt, data-modeling, python"
                  />
                  <p className="text-xs text-muted-foreground">Comma-separated, lowercase</p>
                </div>

                <div className="space-y-1.5">
                  <Label>GitHub URL</Label>
                  <Input value={fields.githubUrl} onChange={e => set("githubUrl", e.target.value)} placeholder="https://github.com/you/repo" />
                </div>

                <div className="space-y-1.5">
                  <Label>Live URL</Label>
                  <Input value={fields.liveUrl} onChange={e => set("liveUrl", e.target.value)} placeholder="https://yourproject.com" />
                </div>

                <div className="space-y-1.5">
                  <Label>Body</Label>
                  <Textarea
                    value={fields.body}
                    onChange={e => set("body", e.target.value)}
                    placeholder="Full project write-up in Markdown..."
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>
              </TabsContent>

              <TabsContent value="preview" className="mt-4">
                {fields.body ? (
                  <div className="border rounded-xl p-6">
                    <Markdown>{fields.body}</Markdown>
                  </div>
                ) : (
                  <div className="border border-dashed rounded-xl p-8 text-center text-sm text-muted-foreground">
                    No body content yet — add it in the Fields tab.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>

        {/* Footer actions */}
        {fields && !submitted && (
          <div className="px-6 py-4 border-t flex items-center justify-between gap-3 bg-background">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={!fields.title || isPending}
                onClick={() => handleSubmit("draft")}
              >
                Save as Draft
              </Button>
              <Button
                disabled={!fields.title || isPending}
                onClick={() => handleSubmit("public")}
              >
                {isPending ? "Publishing…" : "Publish"}
              </Button>
            </div>
          </div>
        )}

        {submitted && (
          <div className="px-6 py-4 border-t flex justify-end gap-3 bg-background">
            <Button variant="outline" onClick={() => { setFields(null); setFileName(""); setSubmitted(false); }}>
              Upload another
            </Button>
            <Button onClick={handleClose}>Done</Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
