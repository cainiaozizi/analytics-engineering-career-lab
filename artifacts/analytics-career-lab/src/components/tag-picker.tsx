import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TAXONOMY } from "@/lib/taxonomy";
import { X, ChevronDown, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── TagPicker ────────────────────────────────────────────────────────────────
// Reusable tag picker backed by the canonical taxonomy.
// Props:
//   value    — controlled array of selected tag strings
//   onChange — called with the new array whenever selection changes
//   max      — optional cap on how many tags can be selected (default: unlimited)

interface TagPickerProps {
  value: string[];
  onChange: (tags: string[]) => void;
  max?: number;
  className?: string;
}

export function TagPicker({ value, onChange, max, className }: TagPickerProps) {
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const selected = new Set(value);

  function toggle(tag: string) {
    if (selected.has(tag)) {
      onChange(value.filter(t => t !== tag));
    } else {
      if (max !== undefined && value.length >= max) return;
      onChange([...value, tag]);
    }
  }

  function remove(tag: string) {
    onChange(value.filter(t => t !== tag));
  }

  function toggleCollapse(label: string) {
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));
  }

  const trimmed = search.trim();
  const query = trimmed.toLowerCase();

  // Filter taxonomy to categories that have matching tags
  const filtered = TAXONOMY.map(cat => ({
    ...cat,
    tags: cat.tags.filter(t => !query || t.toLowerCase().includes(query)),
  })).filter(cat => cat.tags.length > 0);

  // Show "Add" option when the typed text isn't already in the taxonomy or selected
  const allTaxonomyTags = TAXONOMY.flatMap(c => c.tags).map(t => t.toLowerCase());
  const canAddCustom =
    trimmed.length > 0 &&
    !allTaxonomyTags.includes(query) &&
    !selected.has(trimmed) &&
    !(max !== undefined && value.length >= max);

  function addCustomTag() {
    if (!canAddCustom) return;
    onChange([...value, trimmed]);
    setSearch("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomTag();
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Selected pills */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map(tag => (
            <Badge
              key={tag}
              variant="secondary"
              className="flex items-center gap-1 pr-1 text-xs font-normal"
            >
              {tag}
              <button
                type="button"
                onClick={() => remove(tag)}
                className="ml-0.5 rounded-sm opacity-60 hover:opacity-100 transition-opacity"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors self-center"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Search */}
      <Input
        value={search}
        onChange={e => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search or type a new tag…"
        className="h-8 text-sm"
      />

      {/* Taxonomy groups */}
      <div className="border rounded-lg divide-y max-h-72 overflow-y-auto">
        {filtered.length === 0 && !canAddCustom && (
          <p className="px-3 py-4 text-sm text-muted-foreground text-center">
            No tags match "{search}"
          </p>
        )}

        {canAddCustom && (
          <button
            type="button"
            onClick={addCustomTag}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-muted/50 transition-colors text-left"
          >
            <Plus className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span>Add <span className="font-medium">"{trimmed}"</span></span>
            <span className="ml-auto text-xs text-muted-foreground">↵ Enter</span>
          </button>
        )}

        {filtered.map(cat => {
          const isCollapsed = collapsed[cat.label] ?? false;
          const selectedInCat = cat.tags.filter(t => selected.has(t)).length;

          return (
            <div key={cat.label}>
              {/* Category header */}
              <button
                type="button"
                onClick={() => toggleCollapse(cat.label)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                  {selectedInCat > 0 && (
                    <Badge variant="secondary" className="text-xs h-4 px-1.5 font-normal">
                      {selectedInCat}
                    </Badge>
                  )}
                </span>
                {isCollapsed
                  ? <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                }
              </button>

              {/* Tags */}
              {!isCollapsed && (
                <div className="px-3 pb-2.5 pt-1 flex flex-wrap gap-1.5">
                  {cat.tags.map(tag => {
                    const active = selected.has(tag);
                    const atMax = max !== undefined && value.length >= max && !active;
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggle(tag)}
                        disabled={atMax}
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs border transition-colors",
                          active
                            ? "bg-foreground text-background border-foreground"
                            : "bg-background text-foreground border-border hover:border-foreground/50",
                          atMax && "opacity-40 cursor-not-allowed"
                        )}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {max !== undefined && (
        <p className="text-xs text-muted-foreground">
          {value.length}/{max} tags selected
        </p>
      )}
    </div>
  );
}
