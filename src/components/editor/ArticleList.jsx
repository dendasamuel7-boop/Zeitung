import React from "react";
import { Plus, FileText, Trash2, Edit, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CATEGORY_LABELS = {
  nachrichten: "Nachrichten",
  politik: "Politik",
  wirtschaft: "Wirtschaft",
  sport: "Sport",
  kultur: "Kultur",
  wissenschaft: "Wissenschaft",
  meinung: "Meinung",
  unterhaltung: "Unterhaltung",
};

const SIZE_LABELS = {
  full: "Volle Breite",
  half: "Halbe Breite",
  third: "Drittel",
};

export default function ArticleList({ articles, isLoading, onEdit, onDelete, onNewArticle }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-heading text-xl font-semibold mb-2">Keine Artikel</h3>
        <p className="text-muted-foreground mb-6">Füge deinen ersten Artikel hinzu</p>
        <Button
          onClick={onNewArticle}
          className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ersten Artikel erstellen
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {articles.map((article) => (
        <div
          key={article.id}
          className="group bg-card border border-border rounded-xl p-4 sm:p-5 flex items-start gap-4 hover:shadow-md transition-all"
        >
          {article.image_url ? (
            <img
              src={article.image_url}
              alt=""
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shrink-0"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Image className="w-6 h-6 text-muted-foreground" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-bold text-base sm:text-lg line-clamp-1">
              {article.headline}
            </h3>
            {article.subtitle && (
              <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{article.subtitle}</p>
            )}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                {CATEGORY_LABELS[article.category] || article.category}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {SIZE_LABELS[article.layout_size] || article.layout_size}
              </Badge>
              {article.author && (
                <span className="text-xs text-muted-foreground">von {article.author}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(article)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(article.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
