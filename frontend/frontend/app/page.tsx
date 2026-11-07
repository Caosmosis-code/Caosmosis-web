"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { CATEGORIAS } from "@/lib/categorias";

interface Articulo {
  id: number;
  titulo: string;
  categoria: string;
  autorNombre: string;
  fechaPublicacion: string;
  tiempoLectura: number;
  imagenUrl: string | null;
}

function Portada({ articulo }: { articulo: Articulo }) {
  return (
    <Link href={`/articulos/${articulo.id}`} className="group block relative">
      {/* marcas de esquina — firma visual */}
      <span className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-brass" />
      <span className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-brass" />
      <span className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-brass" />
      <span className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-brass" />

      <div className="relative overflow-hidden bg-ink aspect-[16/8]">
        {articulo.imagenUrl ? (
          <img
            src={articulo.imagenUrl}
            alt={articulo.titulo}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-mono text-chalk/40 text-xs uppercase tracking-[0.2em]">
              {articulo.categoria}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <span className="font-mono text-brass text-xs uppercase tracking-[0.15em]">
            Portada · {articulo.categoria}
          </span>
          <h2 className="font-display text-chalk text-2xl md:text-3xl mt-1 leading-tight">
            {articulo.titulo}
          </h2>
          <p className="font-mono text-chalk/60 text-xs mt-2">
            {articulo.autorNombre} · {articulo.tiempoLectura} min
          </p>
        </div>
      </div>
    </Link>
  );
}

function ArticuloCard({ articulo }: { articulo: Articulo }) {
  return (
    <Link href={`/articulos/${articulo.id}`} className="group block">
      <div className="relative overflow-hidden bg-ink/90 aspect-[16/10] mb-3">
        {articulo.imagenUrl ? (
          <img
            src={articulo.imagenUrl}
            alt={articulo.titulo}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-mono text-chalk/30 text-[10px] uppercase tracking-[0.2em]">
              {articulo.categoria}
            </span>
          </div>
        )}
      </div>
      <span className="font-mono text-brass text-[11px] uppercase tracking-[0.15em]">
        {articulo.categoria}
      </span>
      <h3 className="font-display text-lg leading-snug mt-1 group-hover:text-brass transition-colors">
        {articulo.titulo}
      </h3>
      <p className="font-mono text-graphite/50 text-xs mt-1.5">
        {articulo.autorNombre} · {articulo.tiempoLectura} min
      </p>
    </Link>
  );
}

function HomeContent() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoriaActiva = searchParams.get("categoria") || "";

  useEffect(() => {
    setCargando(true);
    const query = categoriaActiva ? `?categoria=${encodeURIComponent(categoriaActiva)}` : "";
    apiFetch<Articulo[]>(`/api/articulos${query}`, { skipAuth: true })
      .then(setArticulos)
      .finally(() => setCargando(false));
  }, [categoriaActiva]);

  function seleccionarCategoria(categoria: string) {
    if (categoria === categoriaActiva) {
      router.push("/");
    } else {
      router.push(`/?categoria=${encodeURIComponent(categoria)}`);
    }
  }

  const [portada, ...resto] = articulos;

  return (
    <div>
      {/* Hero */}
      <section
        className="relative bg-ink px-4 py-16 md:py-24"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(237,230,214,0.05) 0 1px, transparent 1px 48px), repeating-linear-gradient(90deg, rgba(237,230,214,0.05) 0 1px, transparent 1px 48px)",
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <span className="font-mono text-brass text-xs uppercase tracking-[0.25em]">
            Archivo de artículos
          </span>
          <h1 className="font-display text-chalk text-4xl md:text-6xl mt-3 leading-[1.05]">
            Caosmosis
          </h1>
          <p className="font-body text-chalk/60 mt-4 text-base md:text-lg max-w-lg mx-auto">
            Notas, análisis y discusión — organizados como piezas de un mismo mecanismo.
          </p>
        </div>
      </section>

      {/* Filtro de categorías */}
      <div className="border-b border-graphite/15 bg-paper sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
          <button
            onClick={() => router.push("/")}
            className={`font-mono text-xs uppercase tracking-wide px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors ${
              !categoriaActiva
                ? "bg-ink text-chalk border-ink"
                : "border-graphite/25 hover:border-brass hover:text-brass"
            }`}
          >
            Todas
          </button>
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => seleccionarCategoria(cat)}
              className={`font-mono text-xs uppercase tracking-wide px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors ${
                categoriaActiva === cat
                  ? "bg-ink text-chalk border-ink"
                  : "border-graphite/25 hover:border-brass hover:text-brass"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        {cargando ? (
          <p className="font-mono text-sm text-graphite/50 text-center py-12">Cargando…</p>
        ) : articulos.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-display text-xl">Todavía no hay artículos acá.</p>
            <p className="font-mono text-xs text-graphite/50 mt-2 uppercase tracking-wide">
              {categoriaActiva ? `Nada en "${categoriaActiva}" por ahora` : "El archivo está vacío"}
            </p>
          </div>
        ) : (
          <>
            {portada && (
              <div className="mb-12">
                <Portada articulo={portada} />
              </div>
            )}
            {resto.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10">
                {resto.map((articulo) => (
                  <ArticuloCard key={articulo.id} articulo={articulo} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<p className="text-center py-12 font-mono text-sm">Cargando…</p>}>
      <HomeContent />
    </Suspense>
  );
}