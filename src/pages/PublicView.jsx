import React from "react";
import { db } from "@/api/db";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import PublicArticle from "@/components/newspaper/PublicArticle";

export default function PublicView() {
  const { publishId } = useParams();

  const { data: newspaper, isLoading: loadingPaper } = useQuery({
    queryKey: ["public-newspaper", publishId],
    queryFn: async () => {
      const papers = await db.entities.Newspaper.filter({ publish_id: publishId, published: true });
      return papers[0] || null;
    },
  });

  const { data: articles = [] } = useQuery({
    queryKey: ["public-articles", newspaper?.id],
    queryFn: () => db.entities.Article.filter({ newspaper_id: newspaper.id }, "order_index"),
    enabled: !!newspaper?.id,
  });

  if (loadingPaper) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-muted border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!newspaper) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold mb-2">Nicht gefunden</h1>
          <p className="text-muted-foreground">
            Diese Zeitung existiert nicht oder wurde nicht veröffentlicht.
          </p>
        </div>
      </div>
    );
  }

  const fullArticles = articles.filter((a) => a.layout_size === "full");
  const halfArticles = articles.filter((a) => a.layout_size === "half");
  const thirdArticles = articles.filter((a) => a.layout_size === "third");

  return (
    <div className="min-h-screen bg-background">
      {/* Newspaper Header */}
      <header className="border-b-4 border-double border-foreground py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="border-b border-border pb-3 mb-3">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
              {newspaper.edition_date
                ? format(new Date(newspaper.edition_date), "EEEE, d. MMMM yyyy", { locale: de })
                : ""}
            </p>
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none">
            {newspaper.title}
          </h1>
          {newspaper.subtitle && (
            <p className="text-lg text-muted-foreground mt-3 font-body italic">{newspaper.subtitle}</p>
          )}
          <div className="border-t border-border mt-4 pt-2" />
        </div>
      </header>

      {/* Articles */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {articles.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">Keine Artikel vorhanden.</p>
        ) : (
          <div className="space-y-10">
            {fullArticles.map((article) => (
              <PublicArticle key={article.id} article={article} size="full" />
            ))}
            {halfArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border pt-8">
                {halfArticles.map((article) => (
                  <PublicArticle key={article.id} article={article} size="half" />
                ))}
              </div>
            )}
            {thirdArticles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 border-t border-border pt-8">
                {thirdArticles.map((article) => (
                  <PublicArticle key={article.id} article={article} size="third" />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-border py-6 text-center">
        <p className="text-xs text-muted-foreground tracking-wider">Erstellt mit Presse Editor</p>
      </footer>
    </div>
  );
}
