import React, { useState } from "react";
import { db } from "@/api/db";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Plus, FileText, LogOut, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";
import NewspaperCard from "@/components/newspaper/NewspaperCard";
import { useAuth } from "@/lib/AuthContext";

export default function Dashboard() {
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  const { data: newspapers = [], isLoading } = useQuery({
    queryKey: ["newspapers"],
    queryFn: () => db.entities.Newspaper.list("-created_date"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => db.entities.Newspaper.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newspapers"] });
      setShowCreate(false);
      setNewTitle("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => db.entities.Newspaper.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["newspapers"] }),
  });

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    createMutation.mutate({
      title: newTitle,
      edition_date: format(new Date(), "yyyy-MM-dd"),
      publish_id: crypto.randomUUID().slice(0, 12),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Newspaper className="w-7 h-7 text-foreground" />
            <h1 className="text-2xl font-heading font-bold tracking-tight">Presse Editor</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground">
            <LogOut className="w-4 h-4 mr-2" />
            Abmelden
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-heading font-bold">Meine Zeitungen</h2>
            <p className="text-muted-foreground mt-1">Erstelle und verwalte deine Zeitungsausgaben</p>
          </div>
          <Button
            onClick={() => setShowCreate(true)}
            className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6"
          >
            <Plus className="w-4 h-4 mr-2" />
            Neue Ausgabe
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : newspapers.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2">Noch keine Zeitungen</h3>
            <p className="text-muted-foreground mb-8">Erstelle deine erste Zeitungsausgabe</p>
            <Button
              onClick={() => setShowCreate(true)}
              className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8"
            >
              <Plus className="w-4 h-4 mr-2" />
              Erste Ausgabe erstellen
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newspapers.map((paper) => (
              <NewspaperCard
                key={paper.id}
                newspaper={paper}
                onDelete={() => deleteMutation.mutate(paper.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">Neue Zeitungsausgabe</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Titel der Zeitung..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="text-lg"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleCreate} disabled={!newTitle.trim() || createMutation.isPending}>
              Erstellen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
