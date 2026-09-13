"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import Comentarios from "@/components/Comentarios";
import BarraProgreso from "@/components/BarraProgreso";
import BotonCompartir from "@/components/BotonCompartir";

interface Articulo {
  id: number;
  titulo: string;
  contenido: string;
  categoria: string;
  autorNombre: string;
  autorId: number;
  autorEmail: string | null;
  autorInstagram: string | null;
  autorTwitter: string | null;
  fechaPublicacion: string;
  tiempoLectura: number;
  imagenUrl: string | null;
}

export default function ArticuloDetallePage() {
  const params = useParams();
  const router = useRouter();
  const { usuario } = useAuth();
  const [articulo, setArticulo] = useState<Articulo | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    apiFetch<Articulo>(`/api/articulos/${params.id}`, { skipAuth: true })
      .then(setArticulo)
      .catch(() => setError(true))
      .finally(() => setCargando(false));
  }, [params.id]);

  async function handleEliminar() {
    if (!confirm("¿Seguro que querés eliminar este artículo? Esta acción no se puede deshacer.")) {
      return;
    }

    setEliminando(true);
    try {
      await apiFetch(`/api/articulos/${params.id}`, { method: "DELETE" });
      router.push("/");
    } catch {
      alert("No se pudo eliminar el artículo.");
      setEliminando(false);
    }
  }

  if (cargando) return <p className="text-center py-8">Cargando...</p>;

  if (error || !articulo) {
    return <p className="text-center py-8 text-gray-500">Artículo no encontrado.</p>;
  }

  const fecha = new Date(articulo.fechaPublicacion).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const puedeEditar = usuario && (usuario.id === articulo.autorId || usuario.rol === "ADMIN");

  return (
    <>
      <BarraProgreso />
      <article className="max-w-2xl mx-auto px-4 py-8">
        <span className="text-xs text-gray-500">{articulo.categoria}</span>
        <h1 className="text-3xl font-semibold mt-1 mb-2">{articulo.titulo}</h1>
        <p className="text-sm text-gray-500 mb-6">
          Por{" "}
          <Link href={`/autor/${articulo.autorId}`} className="hover:text-brass transition-colors">
            {articulo.autorNombre}
          </Link> · {fecha} · {articulo.tiempoLectura} min de lectura
        </p>

        {(articulo.autorEmail || articulo.autorInstagram || articulo.autorTwitter) && (
          <div className="flex gap-4 mb-6 font-mono text-xs uppercase tracking-wide text-graphite/60">
            {articulo.autorEmail && (
              <a href={`mailto:${articulo.autorEmail}`} className="hover:text-brass transition-colors">
                Mail
              </a>
            )}
            {articulo.autorInstagram && (
              
                href={`https://instagram.com/${articulo.autorInstagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brass transition-colors"
              >
                Instagram
              </a>
            )}
            {articulo.autorTwitter && (
              
                href={`https://x.com/${articulo.autorTwitter.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brass transition-colors"
              >
                X
              </a>
            )}
          </div>
        )}

        <div className="flex gap-3 mb-6 items-center flex-wrap">
          {puedeEditar && (
            <>
              <Link
                href={`/admin/articulos/${articulo.id}/editar`}
                className="text-sm border rounded-md px-3 py-1 hover:bg-gray-50"
              >
                Editar
              </Link>
              <button
                onClick={handleEliminar}
                disabled={eliminando}
                className="text-sm border rounded-md px-3 py-1 text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {eliminando ? "Eliminando..." : "Eliminar"}
              </button>
            </>
          )}
          <BotonCompartir titulo={articulo.titulo} />
        </div>

        {articulo.imagenUrl && (
          <img src={articulo.imagenUrl} alt={articulo.titulo} className="w-full rounded-lg mb-6" />
        )}

        <div className="bg-paper border border-graphite/15 rounded-sm shadow-sm px-5 py-8 md:px-14 md:py-16">
          <div className="max-w-[65ch] mx-auto overflow-hidden">
            {articulo.contenido
              .split(/\n+/)
              .map((p) => p.trim())
              .filter(Boolean)
              .map((parrafo, i) => (
                <p
                  key={i}
                  className="font-display text-[17px] md:text-[19px] leading-[1.9] mb-6 last:mb-0"
                >
                  {parrafo}
                </p>
              ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <BotonCompartir titulo={articulo.titulo} />
        </div>
      </article>

      <Comentarios articuloId={articulo.id} />
    </>
  );
}