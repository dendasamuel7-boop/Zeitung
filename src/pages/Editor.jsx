import React, { useState } from "react";
import { db } from "@/api/db";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import EditorToolbar from "@/components/editor/EditorToolbar";
import ArticleEditor from "@/components/editor/ArticleEditor";
import ArticleList from "@/components/editor/ArticleList";

export default function Editor() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [editingArticle, setEditingArticle] = useState(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const { data: newspaper, isLoading: loadingPaper } = useQuery({
    queryKey: ["newspaper", id],
    queryFn: async () => {
      const papers = await db.entities.Newspaper.filter({ id });
      return papers[0];
    },
  });

  const { data: articles = [], isLoading: loadingArticles } = useQuery({
    queryKey: ["articles", id],
    queryFn: () => db.entities.Article.filter({ newspaper_id: id }, "order_index"),
  });

  const updatePaperMutation = useMutation({
    mutationFn: (data) => db.entities.Newspaper.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["newspaper", id] }),
  });

  const createArticleMutation = useMutation({
    mutationFn: (data) => db.entities.Article.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles", id] });
      setEditingArticle(null);
    },
  });

  const updateArticleMutation = useMutation({
    mutationFn: ({ articleId, data }) => db.entities.Article.update(articleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles", id] });
      setEditingArticle(null);
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: (articleId) => db.entities.Article.delete(articleId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["articles", id] }),
  });

  const handleNewArticle = () => {
    setEditingArticle({
      newspaper_id: id,
      headline: "",
      content: "",
      author: "",
      category: "nachrichten",
      layout_size: "full",
      order_index: articles.length,
    });
  };

  const handleSaveArticle = (articleData) => {
    if (articleData.id) {
      updateArticleMutation.mutate({ articleId: articleData.id, data: articleData });
    } else {
      createArticleMutation.mutate(articleData);
    }
  };

  const handleTogglePublish = () => {
    const newState = !newspaper.published;
    updatePaperMutation.mutate({ published: newState });
    toast.success(newState ? "Zeitung veröffentlicht!" : "Veröffentlichung aufgehoben");
  };

  const handleTitleChange = (newTitle) => {
    updatePaperMutation.mutate({ title: newTitle });
    setIsEditingTitle(false);
  };

  if (loadingPaper) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-muted border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!newspaper) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Zeitung nicht gefunden</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <EditorToolbar
        newspaper={newspaper}
        isEditingTitle={isEditingTitle}
        setIsEditingTitle={setIsEditingTitle}
        onTitleChange={handleTitleChange}
        onTogglePublish={handleTogglePublish}
        onNewArticle={handleNewArticle}
      />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {editingArticle ? (
          <ArticleEditor
            article={editingArticle}
            onSave={handleSaveArticle}
            onCancel={() => setEditingArticle(null)}
            isSaving={createArticleMutation.isPending || updateArticleMutation.isPending}
          />
        ) : (
          <ArticleList
            articles={articles}
            isLoading={loadingArticles}
            onEdit={setEditingArticle}
            onDelete={(articleId) => deleteArticleMutation.mutate(articleId)}
            onNewArticle={handleNewArticle}
          />
        )}
      </main>
    </div>
  );
}
