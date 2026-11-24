import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthUser {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  //LOGIN FUNCTION!!!
  // Everytime we get the token from backend we store that token into localstorage.
  function login(token: string, user: AuthUser) {
    localStorage.setItem("token", token);
    // We can only store strings in localstorage
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  }

  //LOGOUT FUNCTION!!
  // for the logout we can just remove user and token from the localstorage..
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

//Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}
