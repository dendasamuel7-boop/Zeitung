import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="font-heading text-3xl font-bold mb-2">Passwort vergessen</h1>
        <p className="text-muted-foreground mb-6">
          Im lokalen Modus nicht verfügbar. Passwort: <strong>admin123</strong>
        </p>
        <Link to="/login">
          <Button className="w-full">Zurück zur Anmeldung</Button>
        </Link>
      </div>
    </div>
  );
}
