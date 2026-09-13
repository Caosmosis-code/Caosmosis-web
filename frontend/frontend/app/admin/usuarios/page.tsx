"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, ApiError } from "@/lib/api";

interface UsuarioAdmin {
  id: number;
  nombre: string;
  email: string;
  rol: "ADMIN" | "ESCRITOR" | "LECTOR";
  fechaCreacion: string;
}

const ROLES: UsuarioAdmin["rol"][] = ["LECTOR", "ESCRITOR", "ADMIN"];

export default function GestionUsuariosPage() {
  const { usuario, cargando: cargandoAuth } = useAuth();
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cargandoAuth && (!usuario || usuario.rol !== "ADMIN")) {
      router.push("/");
    }
  }, [usuario, cargandoAuth, router]);

  function cargar(termino: string) {
    setCargando(true);
    const query = termino ? `?busqueda=${encodeURIComponent(termino)}` : "";
    apiFetch<UsuarioAdmin[]>(`/api/usuarios${query}`)
      .then(setUsuarios)
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    if (usuario?.rol === "ADMIN") cargar("");
  }, [usuario]);

  useEffect(() => {
    if (usuario?.rol !== "ADMIN") return;
    const timeout = setTimeout(() => cargar(busqueda), 300);
    return () => clearTimeout(timeout);
  }, [busqueda, usuario]);

  async function cambiarRol(id: number, nuevoRol: UsuarioAdmin["rol"]) {
    setActualizando(id);
    setError(null);
    try {
      await apiFetch(`/api/usuarios/${id}/rol`, {
        method: "PUT",
        body: JSON.stringify({ rol: nuevoRol }),
      });
      setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, rol: nuevoRol } : u)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo cambiar el rol.");
    } finally {
      setActualizando(null);
    }
  }

  if (cargandoAuth || !usuario || usuario.rol !== "ADMIN") return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl mb-1">Gestión de usuarios</h1>
      <p className="font-mono text-xs text-graphite/50 uppercase tracking-wide mb-6">
        Buscá y modificá roles
      </p>

      <input
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar por nombre o email…"
        className="w-full border rounded-md px-3 py-2 mb-6"
      />

      {error && <p className="text-rust text-sm mb-4">{error}</p>}

      {cargando ? (
        <p className="font-mono text-sm text-graphite/50">Cargando…</p>
      ) : usuarios.length === 0 ? (
        <p className="font-mono text-sm text-graphite/50">Sin resultados.</p>
      ) : (
        <div className="space-y-2">
          {usuarios.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between border border-graphite/15 rounded-lg p-4"
            >
              <div>
                <p className="font-medium">{u.nombre}</p>
                <p className="font-mono text-xs text-graphite/50">{u.email}</p>
              </div>

              <select
                value={u.rol}
                onChange={(e) => cambiarRol(u.id, e.target.value as UsuarioAdmin["rol"])}
                disabled={actualizando === u.id || u.email === usuario.email}
                className="border rounded-md px-3 py-1.5 font-mono text-xs uppercase disabled:opacity-50"
              >
                {ROLES.map((rol) => (
                  <option key={rol} value={rol}>{rol}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}