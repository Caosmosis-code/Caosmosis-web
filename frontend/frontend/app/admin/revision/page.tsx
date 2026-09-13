"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Articulo } from "@/lib/tipos";

export default function RevisionPage() {
  const { usuario, cargando: cargandoAuth } = useAuth();
  const router = useRouter();
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!cargandoAuth && (!usuario || usuario.rol !== "ADMIN")) {
      router.push("/");
    }
  }, [usuario, cargandoAuth, router]);

  useEffect(() => {
    if (!usuario || usuario.rol !== "ADMIN") return;
    apiFetch<Articulo[]>("/api/articulos/pendientes")
      .then(setArticulos)
      .finally(() => setCargando(false));
  }, [usuario]);

  if (cargandoAuth || !usuario || usuario.rol !== "ADMIN") return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl mb-1">Revisión</h1>
      <p className="font-mono text-xs text-graphite/50 uppercase tracking-wide mb-6">
        Artículos esperando aprobación
      </p>

      {cargando ? (
        <p className="font-mono text-sm text-graphite/50">Cargando…</p>
      ) : articulos.length === 0 ? (
        <p className="font-mono text-sm text-graphite/50">No hay nada pendiente. Al día.</p>
      ) : (
        <div className="space-y-3">
          {articulos.map((articulo) => (
            <Link
              key={articulo.id}
              href={`/admin/revision/${articulo.id}`}
              className="block border border-graphite/15 rounded-lg p-4 hover:border-brass transition-colors"
            >
              <span className="font-mono text-brass text-[11px] uppercase tracking-wide">
                {articulo.categoria}
              </span>
              <h2 className="font-display text-lg mt-1">{articulo.titulo}</h2>
              <p className="font-mono text-xs text-graphite/50 mt-1">Por {articulo.autorNombre}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}