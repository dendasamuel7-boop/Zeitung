/**
 * AuthContext LOCAL — reemplaza base44.auth
 *
 * Credenciales por defecto:
 *   Email:    admin@presse.local
 *   Passwort: admin123
 *
 * Para añadir más usuarios o conectar Supabase Auth,
 * reemplaza las funciones login/logout/me en este archivo.
 */

import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

const STORAGE_KEY = 'presse_auth_user';

// ── Usuarios locales ──────────────────────────────────────────
// Puedes añadir más entradas aquí o reemplazar por Supabase Auth
const LOCAL_USERS = [
  {
    id: 'local-user-1',
    email: 'admin@presse.local',
    password: 'admin123',
    full_name: 'Admin',
  },
];

const fakeAuthApi = {
  async loginViaEmailPassword(email, password) {
    const user = LOCAL_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) throw new Error('E-Mail oder Passwort falsch');
    const { password: _pw, ...safeUser } = user;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
    return safeUser;
  },

  async me() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) throw new Error('Not authenticated');
    return JSON.parse(stored);
  },

  logout() {
    localStorage.removeItem(STORAGE_KEY);
    window.location.href = '/login';
  },

  // stub — Google login requiere OAuth real; ignorado en modo local
  loginWithProvider() {
    alert('Google Login no disponible en modo local.\nUsa: admin@presse.local / admin123');
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    setIsLoadingAuth(true);
    try {
      const currentUser = await fakeAuthApi.me();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  const logout = () => {
    fakeAuthApi.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        authChecked,
        logout,
        navigateToLogin,
        checkUserAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// Exportamos fakeAuthApi para usarlo en Login.jsx
export { fakeAuthApi as localAuth };
