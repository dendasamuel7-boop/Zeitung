import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Newspaper } from "lucide-react";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center mx-auto mb-4">
          <Newspaper className="w-7 h-7" />
        </div>
        <h1 className="font-heading text-3xl font-bold mb-2">Registrieren</h1>
        <p className="text-muted-foreground mb-6">
          Im lokalen Modus ist die Registrierung nicht verfügbar.
          <br />
          Nutze die Demo-Zugangsdaten auf der Anmeldeseite.
        </p>
        <Link to="/login">
          <Button className="w-full">Zur Anmeldung</Button>
        </Link>
      </div>
    </div>
  );
}
