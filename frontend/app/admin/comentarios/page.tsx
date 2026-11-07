"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Comentario } from "@/lib/tipos";
import { useAuth } from "@/context/AuthContext";

export default function AdminComentariosPage() {
  const { usuario, cargando } = useAuth();
  const [comments, setComments] = useState<Comentario[]>([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  async function load() {
    try { setComments(await apiFetch<Comentario[]>("/api/admin/comentarios/pendientes")); }
    catch { setError("No se pudieron cargar los comentarios pendientes."); }
  }
  useEffect(() => { if (usuario?.rol === "ADMIN") void load(); }, [usuario]);

  async function moderate(id: number, action: "aprobar" | "rechazar") {
    setBusyId(id); setError("");
    try { await apiFetch(`/api/admin/comentarios/${id}/${action}`, { method: "PUT" }); setComments((previous) => previous.filter((comment) => comment.id !== id)); }
    catch { setError("No se pudo actualizar el estado del comentario."); }
    finally { setBusyId(null); }
  }

  if (cargando) return <main className="shell listing-grid"><p>Cargando…</p></main>;
  if (usuario?.rol !== "ADMIN") return <main className="shell listing-grid"><p>Necesitás una cuenta administradora para moderar comentarios.</p></main>;
  return <main className="shell listing-grid"><header className="page-intro"><p className="eyebrow">Herramientas editoriales</p><h1>Moderar comentarios</h1><p>Leé cada aporte antes de publicarlo en la conversación.</p></header>{error && <p className="form-error" role="alert">{error}</p>}{comments.length ? comments.map((comment) => <article className="moderation-card" key={comment.id}><div><p className="eyebrow">{comment.usuarioNombre || "Lector/a"} · {new Date(comment.fecha).toLocaleString("es-AR")}</p><p>{comment.contenido}</p><small>Nota #{comment.articuloId ?? "—"}</small></div><div className="moderation-actions"><button className="button button-dark" onClick={() => moderate(comment.id, "aprobar")} disabled={busyId === comment.id}>Aprobar</button><button className="button button-outline" onClick={() => moderate(comment.id, "rechazar")} disabled={busyId === comment.id}>Rechazar</button></div></article>) : <p className="empty-state">No hay comentarios pendientes.</p>}</main>;
}
