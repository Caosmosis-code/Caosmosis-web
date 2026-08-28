"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import Comentarios from "@/components/Comentarios";

interface Articulo {
  id: number;
  titulo: string;
  contenido: string;
  categoria: string;
  autorNombre: string;
  autorId: number;
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
      <article className="max-w-2xl mx-auto px-4 py-8">
        <span className="text-xs text-gray-500">{articulo.categoria}</span>
        <h1 className="text-3xl font-semibold mt-1 mb-2">{articulo.titulo}</h1>
        <p className="text-sm text-gray-500 mb-4">
          <Link href={`/autor/${articulo.autorId}`} className="hover:text-brass transition-colors">
            {articulo.autorNombre}
          </Link> · {fecha} · {articulo.tiempoLectura} min de lectura
        </p>

        {puedeEditar && (
          <div className="flex gap-3 mb-6">
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
          </div>
        )}

        {articulo.imagenUrl && (
          <img src={articulo.imagenUrl} alt={articulo.titulo} className="w-full rounded-lg mb-6" />
        )}

        <div className="bg-paper border border-graphite/15 rounded-sm shadow-sm px-6 py-10 md:px-12 md:py-14">
          {articulo.contenido
            .split(/\n\s*\n/)
            .filter((p) => p.trim())
            .map((parrafo, i) => (
              <p
                key={i}
                className={`font-display text-[19px] leading-[1.85] text-justify mb-6 last:mb-0 ${i === 0 ? "drop-cap" : ""
                  }`}
              >
                {parrafo.trim()}
              </p>
            ))}
        </div>
      </article>

      <Comentarios articuloId={articulo.id} />
    </>
  );
}