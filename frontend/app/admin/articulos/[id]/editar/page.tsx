"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { articuloSchema, ArticuloFormData } from "@/lib/validaciones";
import { apiFetch, ApiError } from "@/lib/api";
import { CATEGORIAS } from "@/lib/categorias";
import { Articulo } from "@/lib/tipos";

export default function EditarArticuloPage() {
  const params = useParams();
  const router = useRouter();
  const { usuario, cargando: cargandoAuth } = useAuth();
  const [cargandoArticulo, setCargandoArticulo] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [errorServidor, setErrorServidor] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [mostrarPreview, setMostrarPreview] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ArticuloFormData>({
    resolver: zodResolver(articuloSchema),
  });

  const valores = watch();

  useEffect(() => {
    if (cargandoAuth || !usuario) return;

    apiFetch<Articulo>(`/api/articulos/${params.id}`)
      .then((articulo) => {
        reset({
          titulo: articulo.titulo,
          contenido: articulo.contenido,
          categoria: articulo.categoria,
          imagenUrl: articulo.imagenUrl || "",
        });
      })
      .catch((err) => {
        setErrorCarga(
          err instanceof ApiError
            ? err.message
            : "No se pudo cargar el artículo. Puede que no tengas permiso para verlo."
        );
      })
      .finally(() => setCargandoArticulo(false));
  }, [params.id, reset, usuario, cargandoAuth]);

  async function onSubmit(data: ArticuloFormData) {
    setErrorServidor(null);
    setEnviando(true);
    try {
      await apiFetch(`/api/articulos/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      router.push(`/articulos/${params.id}`);
    } catch (err) {
      setErrorServidor(err instanceof ApiError ? err.message : "Ocurrió un error inesperado.");
    } finally {
      setEnviando(false);
    }
  }

  if (cargandoAuth || cargandoArticulo) {
    return <p className="text-center py-8 font-mono text-sm">Cargando…</p>;
  }
  if (!usuario) {
    router.push("/login");
    return null;
  }
  if (errorCarga) {
    return <p className="text-center py-8 font-mono text-sm text-rust">{errorCarga}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">Editar artículo</h1>
        <button
          type="button"
          onClick={() => setMostrarPreview((v) => !v)}
          className="font-mono text-xs uppercase tracking-wide border border-graphite/30 rounded-full px-4 py-1.5 hover:border-brass hover:text-brass transition-colors"
        >
          {mostrarPreview ? "Ocultar vista previa" : "Ver vista previa"}
        </button>
      </div>

      <div className={mostrarPreview ? "grid md:grid-cols-2 gap-8" : ""}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input {...register("titulo")} className="w-full border rounded-md px-3 py-2" />
            {errors.titulo && <p className="text-rust text-sm mt-1">{errors.titulo.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Categoría</label>
            <select {...register("categoria")} className="w-full border rounded-md px-3 py-2">
              <option value="">Seleccioná una categoría</option>
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.categoria && <p className="text-rust text-sm mt-1">{errors.categoria.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Imagen (URL, opcional)</label>
            <input {...register("imagenUrl")} className="w-full border rounded-md px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contenido</label>
            <textarea
              {...register("contenido")}
              rows={16}
              className="w-full border rounded-md px-3 py-2"
            />
            {errors.contenido && <p className="text-rust text-sm mt-1">{errors.contenido.message}</p>}
          </div>

          {errorServidor && <p className="text-rust text-sm">{errorServidor}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="bg-ink text-chalk rounded-full px-5 py-2 font-mono text-xs uppercase tracking-wide disabled:opacity-50"
          >
            {enviando ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>

        {mostrarPreview && (
          <div className="border border-graphite/15 rounded-lg p-6 bg-paper sticky top-20 h-fit">
            <span className="font-mono text-brass text-xs uppercase tracking-wide">
              {valores.categoria || "Sin categoría"}
            </span>
            <h2 className="font-display text-2xl mt-1 mb-4 leading-tight">
              {valores.titulo || "Título del artículo"}
            </h2>
            {valores.imagenUrl && (
              <img src={valores.imagenUrl} alt="" className="w-full rounded-md mb-4" />
            )}
            <div className="whitespace-pre-wrap leading-relaxed text-sm">
              {valores.contenido || "El contenido aparece acá a medida que escribís…"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}