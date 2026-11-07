"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, ApiError } from "@/lib/api";
import type { Comentario } from "@/lib/tipos";

interface CommentNode extends Comentario { replies: CommentNode[] }

function buildTree(comments: Comentario[]): CommentNode[] {
  const nodes = new Map(comments.map((comment) => [comment.id, { ...comment, replies: [] as CommentNode[] }]));
  const roots: CommentNode[] = [];
  nodes.forEach((node) => {
    if (node.comentarioPadreId && nodes.has(node.comentarioPadreId)) nodes.get(node.comentarioPadreId)!.replies.push(node);
    else roots.push(node);
  });
  return roots;
}

function visitorId(): string {
  const key = "caosmosis-visitor-id";
  let id = window.localStorage.getItem(key);
  if (!id) { id = crypto.randomUUID(); window.localStorage.setItem(key, id); }
  return id;
}

function CommentItem({ comment, postId, visitor, onRefresh, signedInName, depth = 0 }: { comment: CommentNode; postId: number; visitor: string; onRefresh: () => void; signedInName?: string; depth?: number }) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const headers = { "X-Visitor-Id": visitor };

  async function reply(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const authorName = signedInName ?? String(form.get("name") ?? "").trim();
    const authorEmail = String(form.get("email") ?? "").trim();
    if (!content.trim()) return;
    setBusy(true); setMessage("");
    try {
      await apiFetch(`/api/articulos/${postId}/comentarios`, { method: "POST", headers, body: JSON.stringify({ contenido: content, comentarioPadreId: comment.id, autorNombre: authorName, autorEmail: authorEmail }) });
      setContent(""); setReplyOpen(false); setMessage("Tu respuesta quedó pendiente de moderación."); formElement.reset(); onRefresh();
    } catch (error) { setMessage(error instanceof ApiError ? error.message : "No se pudo enviar la respuesta."); }
    finally { setBusy(false); }
  }

  async function like() {
    setBusy(true);
    try { await apiFetch(`/api/articulos/${postId}/comentarios/${comment.id}/like`, { method: "POST", headers }); onRefresh(); }
    catch (error) { setMessage(error instanceof ApiError ? error.message : "No se pudo guardar la reacción."); }
    finally { setBusy(false); }
  }

  return <article className={`comment-item ${depth ? "comment-item-reply" : ""}`}>
    <div className="comment-author-row"><strong>{comment.usuarioNombre || "Lector/a"}</strong><time dateTime={comment.fecha}>{new Intl.DateTimeFormat("es-AR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(comment.fecha))}</time></div>
    <p>{comment.contenido}</p>
    <div className="comment-actions"><button type="button" onClick={like} disabled={busy || !visitor} aria-pressed={comment.likeadoPorMi} aria-label={`Me gusta este comentario. ${comment.cantidadLikes} reacciones`}>{comment.likeadoPorMi ? "♥" : "♡"} {comment.cantidadLikes}</button>{depth < 3 && <button type="button" onClick={() => setReplyOpen((open) => !open)}>{replyOpen ? "Cancelar" : "Responder"}</button>}</div>
    {message && <p className="comment-pending" role="status">{message}</p>}
    {replyOpen && <form className="inline-reply" onSubmit={reply}>
      <label className="sr-only" htmlFor={`reply-${comment.id}`}>Tu respuesta</label><textarea id={`reply-${comment.id}`} rows={3} value={content} onChange={(event) => setContent(event.target.value)} required placeholder="Sumá tu mirada…" />
      {!signedInName && <div className="comment-form comment-reply-fields"><label>Nombre<input name="name" required placeholder="Cómo te llamamos" /></label><label>Email <span>(opcional)</span><input name="email" type="email" placeholder="nombre@ejemplo.com" /></label></div>}
      <button className="button button-dark" disabled={busy || !content.trim()}>{busy ? "Enviando…" : "Enviar respuesta"}</button>
    </form>}
    {comment.replies.map((reply) => <CommentItem key={reply.id} comment={reply} postId={postId} visitor={visitor} onRefresh={onRefresh} signedInName={signedInName} depth={depth + 1} />)}
  </article>;
}

export default function CommentSection({ postId, initialComments = [] }: { postId: number; initialComments?: Comentario[] }) {
  const { usuario } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [visitor, setVisitor] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const tree = useMemo(() => buildTree(comments), [comments]);

  useEffect(() => { setVisitor(visitorId()); }, []);
  async function refresh() {
    try { setComments(await apiFetch<Comentario[]>(`/api/articulos/${postId}/comentarios`, { skipAuth: !usuario, headers: visitor ? { "X-Visitor-Id": visitor } : {} })); }
    catch { /* Keep the server-rendered comments if the API is temporarily unavailable. */ }
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const content = String(form.get("content") ?? "").trim();
    setBusy(true); setError(""); setStatus("");
    try {
      await apiFetch(`/api/articulos/${postId}/comentarios`, {
        method: "POST", headers: visitor ? { "X-Visitor-Id": visitor } : {},
        body: JSON.stringify({ contenido: content, autorNombre: usuario ? usuario.nombre : String(form.get("name") ?? "").trim(), autorEmail: String(form.get("email") ?? "").trim() }),
      });
      formElement.reset(); setStatus("¡Gracias! Tu comentario quedó pendiente de moderación.");
    } catch (cause) { setError(cause instanceof ApiError ? cause.message : "No pudimos enviar tu comentario. Intentá de nuevo."); }
    finally { setBusy(false); }
  }

  return <section id="comentarios" className="comment-section" aria-labelledby="comments-heading">
    <p className="eyebrow">Conversación abierta</p><h2 id="comments-heading">Comentarios {comments.length > 0 && <span>({comments.length})</span>}</h2><p className="comment-section-intro">Las respuestas se publican después de una revisión editorial breve.</p>
    <form className="comment-form" onSubmit={submit}>
      {!usuario && <><label>Nombre<input name="name" required maxLength={80} placeholder="Cómo te llamamos" /></label><label>Email <span>(opcional)</span><input name="email" type="email" maxLength={180} placeholder="No se mostrará públicamente" /></label></>}
      {usuario && <p className="comment-form-note full">Comentás como <strong>{usuario.nombre}</strong>.</p>}
      <label className="full">Tu comentario<textarea name="content" required minLength={2} maxLength={5000} rows={5} placeholder="¿Qué te dejó esta nota?" /></label>
      <div className="comment-form-footer"><span className="comment-form-note">Se aceptan comentarios con nombre o de forma anónima.</span><button className="button button-dark" disabled={busy || !visitor}>{busy ? "Enviando…" : "Publicar comentario"}</button></div>
      {error && <p className="form-error full" role="alert">{error}</p>}{status && <p className="comment-pending full" role="status">{status}</p>}
    </form>
    <div className="comment-list" aria-live="polite">{tree.length ? tree.map((comment) => <CommentItem key={comment.id} comment={comment} postId={postId} visitor={visitor} onRefresh={refresh} signedInName={usuario?.nombre} />) : <p className="empty-state">Todavía no hay comentarios. Abrí la conversación.</p>}</div>
  </section>;
}
