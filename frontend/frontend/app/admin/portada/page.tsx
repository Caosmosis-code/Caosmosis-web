"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, ApiError } from "@/lib/api";
import { Articulo } from "@/lib/tipos";

export default function PortadaPage() {
  const { usuario, cargando: cargandoAuth } = useAuth();
  const router = useRouter();
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cargandoAuth && (!usuario || usuario.rol !== "ADMIN")) {
      router.push("/");
    }
  }, [usuario, cargandoAuth, router]);

  function cargar() {
    setCargando(true);
    apiFetch<Articulo[]>("/api/articulos", { skipAuth: true })
      .then(setArticulos)
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    if (usuario?.rol === "ADMIN") cargar();
  }, [usuario]);

  async function elegir(id: number) {
    setActualizando(id);
    setError(null);
    try {
      await apiFetch(`/api/articulos/${id}/portada`, { method: "PUT" });
      cargar();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo actualizar la portada.");
    } finally {
      setActualizando(null);
    }
  }

  if (cargandoAuth || !usuario || usuario.rol !== "ADMIN") return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl mb-1">Portada</h1>
      <p className="font-mono text-xs text-graphite/50 uppercase tracking-wide mb-6">
        Elegí qué artículo se destaca en el inicio
      </p>

      {error && <p className="text-rust text-sm mb-4">{error}</p>}

      {cargando ? (
        <p className="font-mono text-sm text-graphite/50">Cargando…</p>
      ) : (
        <div className="space-y-3">
          {articulos.map((articulo) => (
            <div
              key={articulo.id}
              className={`flex items-center justify-between border rounded-lg p-4 ${
                articulo.esPortada ? "border-brass bg-brass/5" : "border-graphite/15"
              }`}
            >
              <div>
                <span className="font-mono text-brass text-[11px] uppercase tracking-wide">
                  {articulo.categoria}
                </span>
                <h2 className="font-display text-lg mt-1">{articulo.titulo}</h2>
              </div>

              {articulo.esPortada ? (
                <span className="font-mono text-xs uppercase text-brass whitespace-nowrap ml-4">
                  Portada actual
                </span>
              ) : (
                <button
                  onClick={() => elegir(articulo.id)}
                  disabled={actualizando === articulo.id}
                  className="font-mono text-xs uppercase tracking-wide border border-graphite/30 rounded-full px-4 py-1.5 hover:border-brass hover:text-brass transition-colors whitespace-nowrap ml-4 disabled:opacity-50"
                >
                  {actualizando === articulo.id ? "..." : "Elegir"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}