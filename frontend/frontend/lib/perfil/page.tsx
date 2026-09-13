"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";

interface Perfil {
  nombre: string;
  email: string;
  bio: string | null;
  instagram: string | null;
  twitter: string | null;
}

export default function PerfilPage() {
  const { usuario, cargando: cargandoAuth } = useAuth();
  const router = useRouter();
  const [bio, setBio] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cargandoAuth && !usuario) router.push("/login");
  }, [usuario, cargandoAuth, router]);

  useEffect(() => {
    if (!usuario) return;
    apiFetch<Perfil>("/api/usuarios/me")
      .then((p) => {
        setBio(p.bio || "");
        setInstagram(p.instagram || "");
        setTwitter(p.twitter || "");
      })
      .finally(() => setCargando(false));
  }, [usuario]);

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setError(null);
    setMensaje(null);
    try {
      await apiFetch("/api/usuarios/me", {
        method: "PUT",
        body: JSON.stringify({ bio, instagram, twitter }),
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
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="font-display text-2xl mb-6">Mi perfil</h1>

      <form onSubmit={guardar} className="space-y-4">
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
    </div>
  );
}