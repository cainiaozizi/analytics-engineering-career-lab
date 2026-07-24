import { createContext, useContext, useEffect, useState } from "react";

interface AuthState {
  isOwner: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthState>({ isOwner: false, isLoading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ isOwner: false, isLoading: true });

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data: { isOwner: boolean }) => {
        setState({ isOwner: Boolean(data.isOwner), isLoading: false });
      })
      .catch(() => {
        setState({ isOwner: false, isLoading: false });
      });
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
