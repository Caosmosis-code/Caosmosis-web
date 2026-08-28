"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { apiFetch, ApiError } from "@/lib/api";
import { Usuario, LoginResponse, LoginPayload, RegistroPayload } from "@/types/auth";

interface AuthContextType {
  usuario: Usuario | null;
  cargando: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  registrar: (payload: RegistroPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const usuarioGuardado = Cookies.get("usuario");
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
    setCargando(false);
  }, []);

  async function login(payload: LoginPayload) {
    const data = await apiFetch<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
      skipAuth: true,
    });

    Cookies.set("token", data.token, { expires: 1 });
    Cookies.set("usuario", JSON.stringify(data.usuario), { expires: 1 });
    setUsuario(data.usuario);
    router.push("/");
  }

  async function registrar(payload: RegistroPayload) {
    await apiFetch<Usuario>("/api/auth/registro", {
      method: "POST",
      body: JSON.stringify(payload),
      skipAuth: true,
    });

    await login({ email: payload.email, password: payload.password });
  }

  function logout() {
    Cookies.remove("token");
    Cookies.remove("usuario");
    setUsuario(null);
    router.push("/");
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, registrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}