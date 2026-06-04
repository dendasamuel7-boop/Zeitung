import React, { useState, useRef } from "react";
import { db } from "@/api/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save, ImagePlus, Loader2 } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CATEGORIES = [
  { value: "nachrichten", label: "Nachrichten" },
  { value: "politik", label: "Politik" },
  { value: "wirtschaft", label: "Wirtschaft" },
  { value: "sport", label: "Sport" },
  { value: "kultur", label: "Kultur" },
  { value: "wissenschaft", label: "Wissenschaft" },
  { value: "meinung", label: "Meinung" },
  { value: "unterhaltung", label: "Unterhaltung" },
];

const SIZES = [
  { value: "full", label: "Volle Breite" },
  { value: "half", label: "Halbe Breite" },
  { value: "third", label: "Drittel Breite" },
];

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote"],
    ["clean"],
  ],
};

export default function ArticleEditor({ article, onSave, onCancel, isSaving }) {
  const [form, setForm] = useState({ ...article });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await db.integrations.Core.UploadFile({ file });
      setForm((prev) => ({ ...prev, image_url: file_url }));
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    if (!form.headline.trim()) return;
    onSave(form);
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="border-b border-border p-4 sm:p-6 flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold">
          {article.id ? "Artikel bearbeiten" : "Neuer Artikel"}
        </h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Headline */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Überschrift</Label>
          <Input
            value={form.headline}
            onChange={(e) => setForm({ ...form, headline: e.target.value })}
            placeholder="Artikelüberschrift eingeben..."
            className="font-heading text-xl font-bold h-12"
          />
        </div>

        {/* Subtitle */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Untertitel</Label>
          <Input
            value={form.subtitle || ""}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            placeholder="Optional: Untertitel..."
          />
        </div>

        {/* Meta Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Autor</Label>
            <Input
              value={form.author || ""}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              placeholder="Autorenname..."
            />
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Kategorie</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Layout-Größe</Label>
            <Select value={form.layout_size} onValueChange={(v) => setForm({ ...form, layout_size: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SIZES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Image */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Bild</Label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          {form.image_url ? (
            <div className="relative rounded-lg overflow-hidden border border-border">
              <img src={form.image_url} alt="" className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                  Ändern
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setForm({ ...form, image_url: "" })}
                >
                  Entfernen
                </Button>
              </div>
              <div className="p-3">
                <Input
                  value={form.image_caption || ""}
                  onChange={(e) => setForm({ ...form, image_caption: e.target.value })}
                  placeholder="Bildunterschrift..."
                  className="text-sm"
                />
              </div>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full h-40 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-foreground/30 hover:text-foreground/60 transition-colors"
            >
              {uploading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <ImagePlus className="w-8 h-8" />
                  <span className="text-sm">Bild hochladen</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Content */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Inhalt</Label>
          <ReactQuill
            value={form.content || ""}
            onChange={(value) => setForm({ ...form, content: value })}
            modules={quillModules}
            placeholder="Schreibe deinen Artikel hier..."
            className="bg-background rounded-lg"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-border p-4 sm:p-6 flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>Abbrechen</Button>
        <Button onClick={handleSave} disabled={isSaving || !form.headline.trim()}>
          {isSaving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Speichern
        </Button>
      </div>
    </div>
  );
}
