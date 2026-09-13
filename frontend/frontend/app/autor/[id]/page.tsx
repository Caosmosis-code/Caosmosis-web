"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { Articulo } from "@/lib/tipos";

interface Autor {
  id: number;
  nombre: string;
  bio: string | null;
}

export default function PerfilAutorPage() {
  const params = useParams();
  const [autor, setAutor] = useState<Autor | null>(null);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch<Autor>(`/api/autores/${params.id}`, { skipAuth: true }),
      apiFetch<Articulo[]>(`/api/autores/${params.id}/articulos`, { skipAuth: true }),
    ])
      .then(([a, arts]) => {
        setAutor(a);
        setArticulos(arts);
      })
      .finally(() => setCargando(false));
  }, [params.id]);

  if (cargando) return <p className="text-center py-8 font-mono text-sm">Cargando…</p>;
  if (!autor) return <p className="text-center py-8 font-mono text-sm">Autor no encontrado.</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl mb-2">{autor.nombre}</h1>
      {autor.bio ? (
        <p className="font-body text-graphite/70 max-w-lg mb-8">{autor.bio}</p>
      ) : (
        <p className="font-mono text-xs text-graphite/40 uppercase tracking-wide mb-8">Sin biografía</p>
      )}

      <h2 className="font-mono text-xs uppercase tracking-wide text-graphite/50 mb-4">
        Artículos publicados ({articulos.length})
      </h2>

      {articulos.length === 0 ? (
        <p className="font-mono text-sm text-graphite/50">Todavía no publicó nada.</p>
      ) : (
        <div className="space-y-4">
          {articulos.map((a) => (
            <Link key={a.id} href={`/articulos/${a.id}`} className="block border-b border-graphite/10 pb-4">
              <span className="font-mono text-brass text-[11px] uppercase tracking-wide">{a.categoria}</span>
              <h3 className="font-display text-lg mt-1">{a.titulo}</h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}