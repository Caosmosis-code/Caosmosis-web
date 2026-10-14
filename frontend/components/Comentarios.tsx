"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, ApiError } from "@/lib/api";
import { Comentario } from "@/lib/tipos";

interface ComentarioConHijos extends Comentario {
  hijos: ComentarioConHijos[];
}

function armarArbol(comentarios: Comentario[]): ComentarioConHijos[] {
  const mapa = new Map<number, ComentarioConHijos>();
  comentarios.forEach((c) => mapa.set(c.id, { ...c, hijos: [] }));

  const raiz: ComentarioConHijos[] = [];

  mapa.forEach((c) => {
    if (c.comentarioPadreId && mapa.has(c.comentarioPadreId)) {
      mapa.get(c.comentarioPadreId)!.hijos.push(c);
    } else {
      raiz.push(c);
    }
  });

  return raiz;
}

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ComentarioItem({
  comentario,
  articuloId,
  usuarioLogueado,
  onRespondido,
  onLikeToggle,
  nivel = 0,
}: {
  comentario: ComentarioConHijos;
  articuloId: number;
  usuarioLogueado: boolean;
  onRespondido: () => void;
  onLikeToggle: (id: number) => void;
  nivel?: number;
}) {
  const [respondiendo, setRespondiendo] = useState(false);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [likeEnviando, setLikeEnviando] = useState(false);

  async function enviarRespuesta(e: React.FormEvent) {
    e.preventDefault();
    if (!texto.trim()) return;

    setEnviando(true);
    try {
      await apiFetch(`/api/articulos/${articuloId}/comentarios`, {
        method: "POST",
        body: JSON.stringify({ contenido: texto, comentarioPadreId: comentario.id }),
      });
      setTexto("");
      setRespondiendo(false);
      onRespondido();
    } catch {
      // silencioso, el form queda visible para reintentar
    } finally {
      setEnviando(false);
    }
  }

  async function toggleLike() {
    setLikeEnviando(true);
    try {
      await apiFetch(`/api/articulos/${articuloId}/comentarios/${comentario.id}/like`, {
        method: "POST",
      });
      onLikeToggle(comentario.id);
    } catch {
      // silencioso
    } finally {
      setLikeEnviando(false);
    }
  }

  return (
    <div className={nivel > 0 ? "ml-6 pl-4 border-l border-graphite/15" : ""}>
      <div className="pb-4">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-medium text-sm">{comentario.usuarioNombre}</span>
          <span className="font-mono text-[11px] text-graphite/40">
            {formatearFecha(comentario.fecha)}
          </span>
        </div>
        <p className="text-sm leading-relaxed mb-2">{comentario.contenido}</p>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleLike}
            disabled={!usuarioLogueado || likeEnviando}
            className={`font-mono text-xs flex items-center gap-1 transition-colors ${
              comentario.likeadoPorMi ? "text-brass" : "text-graphite/50 hover:text-brass"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <span>{comentario.likeadoPorMi ? "♥" : "♡"}</span>
            <span>{comentario.cantidadLikes}</span>
          </button>

          {usuarioLogueado && nivel < 2 && (
            <button
              onClick={() => setRespondiendo((v) => !v)}
              className="font-mono text-xs text-graphite/50 hover:text-brass transition-colors"
            >
              {respondiendo ? "Cancelar" : "Responder"}
            </button>
          )}
        </div>

        {respondiendo && (
          <form onSubmit={enviarRespuesta} className="mt-3">
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={2}
              placeholder={`Responder a ${comentario.usuarioNombre}…`}
              className="w-full border rounded-md px-3 py-2 mb-2 text-sm"
            />
            <button
              type="submit"
              disabled={enviando || !texto.trim()}
              className="bg-ink text-chalk rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-wide disabled:opacity-50"
            >
              {enviando ? "Enviando..." : "Responder"}
            </button>
          </form>
        )}
      </div>

      {comentario.hijos.length > 0 && (
        <div>
          {comentario.hijos.map((hijo) => (
            <ComentarioItem
              key={hijo.id}
              comentario={hijo}
              articuloId={articuloId}
              usuarioLogueado={usuarioLogueado}
              onRespondido={onRespondido}
              onLikeToggle={onLikeToggle}
              nivel={nivel + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Comentarios({ articuloId }: { articuloId: number }) {
  const { usuario, cargando: cargandoAuth } = useAuth();
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function cargar() {
    apiFetch<Comentario[]>(`/api/articulos/${articuloId}/comentarios`, { skipAuth: !usuario })
      .then(setComentarios)
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    cargar();
  }, [articuloId, usuario]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!texto.trim()) return;

    setEnviando(true);
    setError(null);
    try {
      await apiFetch(`/api/articulos/${articuloId}/comentarios`, {
        method: "POST",
        body: JSON.stringify({ contenido: texto }),
      });
      setTexto("");
      cargar();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo publicar el comentario.");
    } finally {
      setEnviando(false);
    }
  }

  function handleLikeToggle(comentarioId: number) {
    setComentarios((prev) =>
      prev.map((c) =>
        c.id === comentarioId
          ? {
              ...c,
              likeadoPorMi: !c.likeadoPorMi,
              cantidadLikes: c.likeadoPorMi ? c.cantidadLikes - 1 : c.cantidadLikes + 1,
            }
          : c
      )
    );
  }

  const arbol = armarArbol(comentarios);
  const totalComentarios = comentarios.length;

  return (
    <section className="max-w-2xl mx-auto px-4 pb-16">
      <h2 className="font-display text-xl mb-4 border-t border-graphite/15 pt-8">
        Comentarios {totalComentarios > 0 && `(${totalComentarios})`}
      </h2>

      {!cargandoAuth && usuario ? (
        <form onSubmit={enviar} className="mb-8">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={3}
            placeholder="Escribí un comentario…"
            className="w-full border rounded-md px-3 py-2 mb-2"
          />
          {error && <p className="text-rust text-sm mb-2">{error}</p>}
          <button
            type="submit"
            disabled={enviando || !texto.trim()}
            className="bg-ink text-chalk rounded-full px-5 py-2 font-mono text-xs uppercase tracking-wide disabled:opacity-50"
          >
            {enviando ? "Publicando..." : "Comentar"}
          </button>
        </form>
      ) : !cargandoAuth ? (
        <div className="mb-8 border border-graphite/15 rounded-lg p-4 text-center">
          <p className="font-mono text-sm text-graphite/60">
            <Link href="/login" className="text-brass underline">Iniciá sesión</Link> para dejar un comentario.
          </p>
        </div>
      ) : null}

      {cargando ? (
        <p className="font-mono text-sm text-graphite/50">Cargando comentarios…</p>
      ) : arbol.length === 0 ? (
        <p className="font-mono text-sm text-graphite/50">Sé el primero en comentar.</p>
      ) : (
        <div className="space-y-1">
          {arbol.map((c) => (
            <ComentarioItem
              key={c.id}
              comentario={c}
              articuloId={articuloId}
              usuarioLogueado={!!usuario}
              onRespondido={cargar}
              onLikeToggle={handleLikeToggle}
            />
          ))}
        </div>
      )}
    </section>
  );
}