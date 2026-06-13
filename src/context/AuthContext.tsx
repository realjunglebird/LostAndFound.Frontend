import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export interface JwtPayLoad {
  sub: string;
  role: "User" | "Admin";
  exp: number;
}

interface AuthContextType {
  token: string | null;
  user: JwtPayLoad | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (newToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [user, setUser] = useState<JwtPayLoad | null>(null);

  // Декодирование токена и сохранение профиля при изменении токена
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayLoad>(token);

        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser(decoded);
          localStorage.setItem("token", token);
        }
      } catch (error) {
        console.error("Ошибка чтения токена:", error);
        logout();
      }
    } else {
      setUser(null);
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = (newToken: string) => setToken(newToken);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        isAdmin: user?.role === "Admin",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth должен использоваться внутри AuthProvider!");
  }
  return context;
};
