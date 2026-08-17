import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest, fetchProfile } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('pitstop_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('pitstop_token');
    if (!token) {
      setLoading(false);
      return;
    }

    fetchProfile()
      .then((profile) => {
        setUser(profile);
        localStorage.setItem('pitstop_user', JSON.stringify(profile));
      })
      .catch(() => {
        localStorage.removeItem('pitstop_token');
        localStorage.removeItem('pitstop_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const { token, user: loggedInUser } = await loginRequest(email, password);
    localStorage.setItem('pitstop_token', token);
    localStorage.setItem('pitstop_user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  }

  function logout() {
    localStorage.removeItem('pitstop_token');
    localStorage.removeItem('pitstop_user');
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
