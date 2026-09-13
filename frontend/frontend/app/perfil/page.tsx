"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { ArticuloEstadistica } from "@/lib/tipos";

interface Perfil {
  nombre: string;
  email: string;
  bio: string | null;
  instagram: string | null;
  twitter: string | null;
  contactoPublico: boolean;
}

const ESTADO_LABEL: Record<string, string> = {
  PENDIENTE: "En revisión",
  PROGRAMADO: "Programado",
  PUBLICADO: "Publicado",
  RECHAZADO: "A reescribir",
};

export default function PerfilPage() {
  const { usuario, cargando: cargandoAuth } = useAuth();
  const router = useRouter();
  const [bio, setBio] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [contactoPublico, setContactoPublico] = useState(true);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [estadisticas, setEstadisticas] = useState<ArticuloEstadistica[]>([]);
  const [cargandoStats, setCargandoStats] = useState(false);

  const esGestor = usuario && (usuario.rol === "ADMIN" || usuario.rol === "ESCRITOR");

  useEffect(() => {
    if (!cargandoAuth && !usuario) router.push("/login");
  }, [usuario, cargandoAuth, router]);

  useEffect(() => {
    if (!usuario) return;
    apiFetch<Perfil>("/api/usuarios/me")
      .then((p) => {
        setNombre(p.nombre);
        setEmail(p.email);
        setBio(p.bio || "");
        setInstagram(p.instagram || "");
        setTwitter(p.twitter || "");
        setContactoPublico(p.contactoPublico);
      })
      .finally(() => setCargando(false));
  }, [usuario]);

  useEffect(() => {
    if (!esGestor) return;
    setCargandoStats(true);
    apiFetch<ArticuloEstadistica[]>("/api/articulos/mios/estadisticas")
      .then(setEstadisticas)
      .finally(() => setCargandoStats(false));
  }, [esGestor]);

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setError(null);
    setMensaje(null);
    try {
      await apiFetch("/api/usuarios/me", {
        method: "PUT",
        body: JSON.stringify({ bio, instagram, twitter, contactoPublico }),
      });
      setMensaje("Perfil actualizado.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo guardar.");
    } finally {
      setGuardando(false);
    }
  }

  if (cargandoAuth || cargando || !usuario) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl mb-6">Mi perfil</h1>

      {/* Datos personales */}
      <div className="mb-10 border border-graphite/15 rounded-lg p-5">
        <p className="font-mono text-[11px] uppercase tracking-wide text-graphite/50 mb-3">
          Datos personales
        </p>
        <p className="text-sm mb-1"><span className="text-graphite/50">Nombre:</span> {nombre}</p>
        <p className="text-sm"><span className="text-graphite/50">Email:</span> {email}</p>
      </div>

      {/* Contacto y privacidad */}
      <form onSubmit={guardar} className="space-y-4 mb-10">
        <p className="font-mono text-[11px] uppercase tracking-wide text-graphite/50">
          Contacto público
        </p>

        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Contá algo sobre vos…"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Instagram (usuario, sin @)</label>
          <input
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            placeholder="tuusuario"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">X / Twitter (usuario, sin @)</label>
          <input
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            placeholder="tuusuario"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={contactoPublico}
            onChange={(e) => setContactoPublico(e.target.checked)}
          />
          Mostrar mi contacto públicamente en mis artículos
        </label>

        {mensaje && <p className="text-brass text-sm">{mensaje}</p>}
        {error && <p className="text-rust text-sm">{error}</p>}

        <button
          type="submit"
          disabled={guardando}
          className="bg-ink text-chalk rounded-full px-5 py-2 font-mono text-xs uppercase tracking-wide disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>

      {/* Estadísticas de artículos */}
      {esGestor && (
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wide text-graphite/50 mb-3">
            Mis artículos — estadísticas
          </p>

          {cargandoStats ? (
            <p className="font-mono text-sm text-graphite/50">Cargando…</p>
          ) : estadisticas.length === 0 ? (
            <p className="font-mono text-sm text-graphite/50">Todavía no publicaste nada.</p>
          ) : (
            <div className="space-y-2">
              {estadisticas.map((a) => (
                <div key={a.id} className="border border-graphite/15 rounded-lg p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="font-mono text-brass text-[11px] uppercase tracking-wide">
                        {a.categoria}
                      </span>
                      <h3 className="font-display text-base mt-0.5">{a.titulo}</h3>
                    </div>
                    <span className="font-mono text-[11px] uppercase tracking-wide text-graphite/50 whitespace-nowrap">
                      {ESTADO_LABEL[a.estado] || a.estado}
                    </span>
                  </div>
                  <div className="flex gap-5 mt-2 font-mono text-xs text-graphite/60">
                    <span>💬 {a.cantidadComentarios}</span>
                    <span>♥ {a.cantidadLikes}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}