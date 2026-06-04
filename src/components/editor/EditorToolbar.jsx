import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Eye, Globe, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EditorToolbar({
  newspaper,
  isEditingTitle,
  setIsEditingTitle,
  onTitleChange,
  onTogglePublish,
  onNewArticle,
}) {
  const [titleValue, setTitleValue] = useState(newspaper.title);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>

        <div className="flex-1 min-w-0">
          {isEditingTitle ? (
            <Input
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={() => onTitleChange(titleValue)}
              onKeyDown={(e) => e.key === "Enter" && onTitleChange(titleValue)}
              className="font-heading text-lg font-bold"
              autoFocus
            />
          ) : (
            <h1
              className="font-heading text-lg font-bold truncate cursor-pointer hover:text-muted-foreground transition-colors"
              onClick={() => setIsEditingTitle(true)}
            >
              {newspaper.title}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {newspaper.published && (
            <Link to={`/view/${newspaper.publish_id}`} target="_blank">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">Ansehen</span>
              </Button>
            </Link>
          )}
          <Button
            variant={newspaper.published ? "outline" : "default"}
            size="sm"
            onClick={onTogglePublish}
          >
            {newspaper.published ? (
              <>
                <EyeOff className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">Entfernen</span>
              </>
            ) : (
              <>
                <Globe className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">Veröffentlichen</span>
              </>
            )}
          </Button>
          <Button
            onClick={onNewArticle}
            size="sm"
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span className="hidden sm:inline">Artikel</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
