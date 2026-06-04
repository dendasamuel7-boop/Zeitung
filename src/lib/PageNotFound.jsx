import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="font-heading text-6xl font-black mb-4">404</h1>
        <p className="text-muted-foreground mb-8">Seite nicht gefunden</p>
        <Link to="/">
          <Button>Zur Startseite</Button>
        </Link>
      </div>
    </div>
  );
}
