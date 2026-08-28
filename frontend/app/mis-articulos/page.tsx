"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Articulo } from "@/lib/tipos";

const TABS: { label: string; estado: Articulo["estado"] }[] = [
  { label: "Publicados", estado: "PUBLICADO" },
  { label: "Revisión", estado: "PENDIENTE" },
  { label: "Reescribir", estado: "RECHAZADO" },
];

export default function MisArticulosPage() {
  const { usuario, cargando: cargandoAuth } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Articulo["estado"]>("PUBLICADO");
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!cargandoAuth && (!usuario || (usuario.rol !== "ADMIN" && usuario.rol !== "ESCRITOR"))) {
      router.push("/");
    }
  }, [usuario, cargandoAuth, router]);

  useEffect(() => {
    if (!usuario) return;
    setCargando(true);
    apiFetch<Articulo[]>(`/api/articulos/mios?estado=${tab}`)
      .then(setArticulos)
      .finally(() => setCargando(false));
  }, [tab, usuario]);

  if (cargandoAuth || !usuario) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl mb-6">Mis artículos</h1>

      <div className="flex gap-2 mb-8 border-b border-graphite/15">
        {TABS.map((t) => (
          <button
            key={t.estado}
            onClick={() => setTab(t.estado)}
            className={`font-mono text-xs uppercase tracking-wide px-4 py-2 border-b-2 -mb-px transition-colors ${
              tab === t.estado
                ? "border-brass text-brass"
                : "border-transparent text-graphite/50 hover:text-graphite"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {cargando ? (
        <p className="font-mono text-sm text-graphite/50">Cargando…</p>
      ) : articulos.length === 0 ? (
        <p className="font-mono text-sm text-graphite/50">No hay artículos acá.</p>
      ) : (
        <div className="space-y-4">
          {articulos.map((articulo) => (
            <div key={articulo.id} className="border border-graphite/15 rounded-lg p-4">
              <span className="font-mono text-brass text-[11px] uppercase tracking-wide">
                {articulo.categoria}
              </span>
              <h2 className="font-display text-lg mt-1">{articulo.titulo}</h2>

              {articulo.estado === "RECHAZADO" && articulo.comentarioRevision && (
                <div className="mt-3 bg-rust/10 border border-rust/30 rounded-md p-3">
                  <p className="font-mono text-[11px] uppercase tracking-wide text-rust mb-1">
                    Comentario del admin
                  </p>
                  <p className="text-sm">{articulo.comentarioRevision}</p>
                </div>
              )}

              <div className="flex gap-3 mt-3">
                {articulo.estado === "PUBLICADO" && (
                  <Link href={`/articulos/${articulo.id}`} className="font-mono text-xs uppercase underline">
                    Ver
                  </Link>
                )}
                {(articulo.estado === "RECHAZADO" || articulo.estado === "PENDIENTE") && (
                  <Link
                    href={`/admin/articulos/${articulo.id}/editar`}
                    className="font-mono text-xs uppercase underline"
                  >
                    {articulo.estado === "RECHAZADO" ? "Reescribir" : "Editar"}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}