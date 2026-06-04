import React from "react";
import { Link } from "react-router-dom";
import { Globe, Trash2, Edit, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { de } from "date-fns/locale";

export default function NewspaperCard({ newspaper, onDelete }) {
  return (
    <div className="group relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Cover Image */}
      <div className="h-40 bg-gradient-to-br from-muted to-secondary flex items-center justify-center relative overflow-hidden">
        {newspaper.cover_image ? (
          <img src={newspaper.cover_image} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center">
            <p className="font-heading text-3xl font-bold text-foreground/20 tracking-wider uppercase">
              {newspaper.title?.slice(0, 2)}
            </p>
          </div>
        )}
        {newspaper.published && (
          <Badge className="absolute top-3 right-3 bg-green-600 text-white border-0">
            <Globe className="w-3 h-3 mr-1" />
            Veröffentlicht
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-heading text-lg font-bold mb-1 line-clamp-1">{newspaper.title}</h3>
        {newspaper.edition_date && (
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {format(new Date(newspaper.edition_date), "d. MMMM yyyy", { locale: de })}
          </p>
        )}

        <div className="flex items-center gap-2 mt-4">
          <Link to={`/editor/${newspaper.id}`} className="flex-1">
            <Button className="w-full" variant="default" size="sm">
              <Edit className="w-3.5 h-3.5 mr-1.5" />
              Bearbeiten
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
