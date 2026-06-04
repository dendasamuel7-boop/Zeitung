import React from "react";

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

export default function PublicArticle({ article, size }) {
  return (
    <article className="border-b border-border pb-8 last:border-0 last:pb-0">
      {/* Category */}
      {article.category && (
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          {CATEGORY_LABELS[article.category] || article.category}
        </p>
      )}

      {/* Image */}
      {article.image_url && (
        <figure className="mb-4">
          <img
            src={article.image_url}
            alt={article.headline}
            className={`w-full object-cover rounded-sm ${
              size === "full" ? "h-72 sm:h-96" : "h-48"
            }`}
          />
          {article.image_caption && (
            <figcaption className="text-xs text-muted-foreground mt-1 italic">
              {article.image_caption}
            </figcaption>
          )}
        </figure>
      )}

      {/* Headline */}
      <h2
        className={`font-heading font-black leading-tight mb-2 ${
          size === "full"
            ? "text-3xl sm:text-4xl"
            : size === "half"
            ? "text-2xl"
            : "text-xl"
        }`}
      >
        {article.headline}
      </h2>

      {/* Subtitle */}
      {article.subtitle && (
        <p className="text-lg text-muted-foreground mb-3 font-body italic leading-snug">
          {article.subtitle}
        </p>
      )}

      {/* Byline */}
      {article.author && (
        <p className="text-sm text-muted-foreground mb-4 font-medium">
          Von {article.author}
        </p>
      )}

      {/* Content */}
      {article.content && (
        <div
          className="prose prose-sm max-w-none text-foreground/90 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      )}
    </article>
  );
}
