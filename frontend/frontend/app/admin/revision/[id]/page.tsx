"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, ApiError } from "@/lib/api";
import { Articulo } from "@/lib/tipos";

export default function RevisionDetallePage() {
  const params = useParams();
  const router = useRouter();
  const { usuario, cargando: cargandoAuth } = useAuth();
  const [articulo, setArticulo] = useState<Articulo | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mostrarRechazo, setMostrarRechazo] = useState(false);
  const [mostrarProgramar, setMostrarProgramar] = useState(false);
  const [comentario, setComentario] = useState("");
  const [fechaProgramada, setFechaProgramada] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cargandoAuth && (!usuario || usuario.rol !== "ADMIN")) {
      router.push("/");
    }
  }, [usuario, cargandoAuth, router]);

  useEffect(() => {
    if (!usuario || usuario.rol !== "ADMIN") return;
    apiFetch<Articulo>(`/api/articulos/${params.id}`)
      .then(setArticulo)
      .finally(() => setCargando(false));
  }, [params.id, usuario]);

  async function aprobar(fecha?: string) {
    setEnviando(true);
    setError(null);
    try {
      await apiFetch(`/api/articulos/${params.id}/aprobar`, {
        method: "PUT",
        body: JSON.stringify({
          fechaPublicacionProgramada: fecha || null,
        }),
      });
      router.push("/admin/revision");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo publicar el artículo.");
      setEnviando(false);
    }
  }

  async function rechazar() {
    if (!comentario.trim()) return;
    setEnviando(true);
    setError(null);
    try {
      await apiFetch(`/api/articulos/${params.id}/rechazar`, {
        method: "PUT",
        body: JSON.stringify({ comentario }),
      });
      router.push("/admin/revision");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo enviar a reescritura.");
      setEnviando(false);
    }
  }

  if (cargandoAuth || !usuario || usuario.rol !== "ADMIN") return null;
  if (cargando) return <p className="text-center py-8 font-mono text-sm">Cargando…</p>;
  if (!articulo) return <p className="text-center py-8 font-mono text-sm">No encontrado.</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <span className="font-mono text-brass text-xs uppercase tracking-wide">{articulo.categoria}</span>
      <h1 className="font-display text-3xl mt-1 mb-1">{articulo.titulo}</h1>
      <p className="font-mono text-xs text-graphite/50 mb-6">Por {articulo.autorNombre}</p>

      <div className="whitespace-pre-wrap leading-relaxed mb-8">{articulo.contenido}</div>

      {error && <p className="text-rust text-sm mb-4">{error}</p>}

      {!mostrarRechazo && !mostrarProgramar && (
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => aprobar()}
            disabled={enviando}
            className="bg-ink text-chalk rounded-full px-5 py-2 font-mono text-xs uppercase tracking-wide disabled:opacity-50"
          >
            Publicar ahora
          </button>
          <button
            onClick={() => setMostrarProgramar(true)}
            disabled={enviando}
            className="border border-brass text-brass rounded-full px-5 py-2 font-mono text-xs uppercase tracking-wide disabled:opacity-50"
          >
            Programar publicación
          </button>
          <button
            onClick={() => setMostrarRechazo(true)}
            disabled={enviando}
            className="border border-rust text-rust rounded-full px-5 py-2 font-mono text-xs uppercase tracking-wide disabled:opacity-50"
          >
            Enviar a reescribir
          </button>
          <Link
            href={`/admin/articulos/${articulo.id}/editar`}
            className="border border-graphite/30 rounded-full px-5 py-2 font-mono text-xs uppercase tracking-wide"
          >
            Editar antes de publicar
          </Link>
        </div>
      )}

      {mostrarProgramar && (
        <div className="border border-brass/30 rounded-lg p-4">
          <label className="font-mono text-xs uppercase tracking-wide text-brass block mb-2">
            ¿Cuándo se publica?
          </label>
          <input
            type="datetime-local"
            value={fechaProgramada}
            onChange={(e) => setFechaProgramada(e.target.value)}
            className="border rounded-md px-3 py-2 mb-3"
          />
          <div className="flex gap-3">
            <button
              onClick={() => aprobar(fechaProgramada)}
              disabled={enviando || !fechaProgramada}
              className="bg-brass text-chalk rounded-full px-5 py-2 font-mono text-xs uppercase tracking-wide disabled:opacity-50"
            >
              Confirmar
            </button>
            <button
              onClick={() => setMostrarProgramar(false)}
              className="font-mono text-xs uppercase tracking-wide text-graphite/50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {mostrarRechazo && (
        <div className="border border-rust/30 rounded-lg p-4">
          <label className="font-mono text-xs uppercase tracking-wide text-rust block mb-2">
            ¿Qué hay que cambiar?
          </label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={4}
            className="w-full border rounded-md px-3 py-2 mb-3"
            placeholder="Explicale al escritor qué corregir o repensar…"
          />
          <div className="flex gap-3">
            <button
              onClick={rechazar}
              disabled={enviando || !comentario.trim()}
              className="bg-rust text-chalk rounded-full px-5 py-2 font-mono text-xs uppercase tracking-wide disabled:opacity-50"
            >
              Enviar
            </button>
            <button
              onClick={() => setMostrarRechazo(false)}
              className="font-mono text-xs uppercase tracking-wide text-graphite/50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}