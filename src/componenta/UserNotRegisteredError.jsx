import React from 'react';

export default function UserNotRegisteredError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-sm">
        <h1 className="font-heading text-2xl font-bold mb-2">Nicht registriert</h1>
        <p className="text-muted-foreground">
          Dein Konto ist nicht für diese App registriert.
        </p>
      </div>
    </div>
  );
}
