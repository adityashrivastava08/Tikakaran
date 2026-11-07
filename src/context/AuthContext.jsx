import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('tikakaran_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Validate token and fetch current user profile
   */
  const checkAuth = useCallback(async (currentToken) => {
    const activeToken = currentToken || token || localStorage.getItem('tikakaran_token');
    if (!activeToken) {
      setUser(null);
      setIsLoading(false);
      return null;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await res.json();

      if (res.ok && result.success && result.data) {
        const u = result.data;
        const mappedUser = {
          id: u.id,
          email: u.email,
          role: u.role,
          fullName: u.anmProfile?.fullName || 'Health Worker',
          designation: u.anmProfile?.designation || u.role,
          mobile: u.anmProfile?.mobile || '',
          subCentre: u.anmProfile?.healthCentre?.name || 'Sub-Centre Pipariya',
          subCentreCode: u.anmProfile?.healthCentre?.code || 'SC-49201',
          phc: u.anmProfile?.healthCentre?.phcName || 'Rampur PHC',
          block: u.anmProfile?.healthCentre?.block || 'Rampur Block',
          district: u.anmProfile?.healthCentre?.district || 'Jabalpur',
          hmisPortalId: u.anmProfile?.hmisPortalId || 'MP-JBL-RMP-SC49201',
          rchPortalId: u.anmProfile?.rchPortalId || '',
          anmProfileId: u.anmProfile?.id,
          healthCentreId: u.anmProfile?.healthCentreId,
          avatar: 'https://images.unsplash.com/photo-1594824813511-209a807955c4?auto=format&fit=crop&q=80&w=200'
        };
        setUser(mappedUser);
        setError(null);
        return mappedUser;
      } else {
        // Token expired or invalid
        localStorage.removeItem('tikakaran_token');
        setToken(null);
        setUser(null);
        return null;
      }
    } catch (err) {
      console.warn('[AuthContext] Backend offline or unreachable:', err.message);
      // In offline/dev environment without server, keep stored session if any or reset
      localStorage.removeItem('tikakaran_token');
      setToken(null);
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * Real Backend Login
   * POST /api/auth/login
   */
  const login = async (email, password) => {
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        const errorMsg = result.message || 'Login failed. Please verify your health worker credentials.';
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      const receivedToken = result.data.token;
      const returnedUser = result.data.user;

      localStorage.setItem('tikakaran_token', receivedToken);
      setToken(receivedToken);

      const loggedUser = {
        id: returnedUser.id,
        email: returnedUser.email,
        role: returnedUser.role,
        fullName: returnedUser.fullName,
        designation: returnedUser.designation,
        mobile: returnedUser.mobile,
        subCentre: returnedUser.subCentre,
        subCentreCode: returnedUser.subCentreCode,
        phc: returnedUser.phcName || 'Rampur PHC',
        block: 'Rampur Block',
        district: 'Jabalpur',
        hmisPortalId: returnedUser.hmisPortalId || 'MP-JBL-RMP-SC49201',
        anmProfileId: returnedUser.anmId,
        avatar: 'https://images.unsplash.com/photo-1594824813511-209a807955c4?auto=format&fit=crop&q=80&w=200'
      };

      setUser(loggedUser);
      setIsLoading(false);
      return loggedUser;
    } catch (err) {
      setIsLoading(false);
      const friendlyMessage = (err.name === 'TypeError' || err.message?.includes('fetch'))
        ? 'Backend API server unreachable. Please make sure the Node.js backend server is running on port 5000 (npm run server).'
        : (err.message || 'Login failed. Please verify your health worker credentials.');
      setError(friendlyMessage);
      const customErr = new Error(friendlyMessage);
      throw customErr;
    }
  };

  /**
   * Real Backend Logout
   * POST /api/auth/logout
   */
  const logout = async () => {
    const activeToken = token || localStorage.getItem('tikakaran_token');
    try {
      if (activeToken) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${activeToken}`,
            'Content-Type': 'application/json'
          }
        }).catch(() => {});
      }
    } finally {
      localStorage.removeItem('tikakaran_token');
      setToken(null);
      setUser(null);
      setError(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user && !!token,
      isLoading,
      error,
      login,
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

