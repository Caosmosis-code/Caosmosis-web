"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { articuloSchema, ArticuloFormData } from "@/lib/validaciones";
import { apiFetch, ApiError } from "@/lib/api";
import Cookies from "js-cookie";
import { CATEGORIAS } from "@/lib/categorias";


export default function NuevoArticuloPage() {
  const { usuario, cargando } = useAuth();
  const router = useRouter();
  const [errorServidor, setErrorServidor] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [subiendoArchivo, setSubiendoArchivo] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ArticuloFormData>({
    resolver: zodResolver(articuloSchema),
  });

  // Protección de ruta: solo ADMIN o ESCRITOR
  useEffect(() => {
    if (!cargando && (!usuario || (usuario.rol !== "ADMIN" && usuario.rol !== "ESCRITOR"))) {
      router.push("/");
    }
  }, [usuario, cargando, router]);

  async function handleArchivoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    setSubiendoArchivo(true);
    setErrorServidor(null);

    try {
      const formData = new FormData();
      formData.append("archivo", archivo);

      const token = Cookies.get("token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

      const response = await fetch(`${API_URL}/api/archivos/extraer-texto`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error("No se pudo procesar el archivo");

      const data = await response.json();
      setValue("contenido", data.contenido);
    } catch {
      setErrorServidor("No se pudo leer el archivo. Probá con .txt o .docx");
    } finally {
      setSubiendoArchivo(false);
    }
  }

  async function onSubmit(data: ArticuloFormData) {
    setErrorServidor(null);
    setEnviando(true);
    try {
      await apiFetch("/api/articulos", {
        method: "POST",
        body: JSON.stringify(data),
      });
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorServidor(err.message);
      } else {
        setErrorServidor("Ocurrió un error inesperado. Intentá de nuevo.");
      }
    } finally {
      setEnviando(false);
    }
  }

  if (cargando || !usuario) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Nuevo artículo</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <input
            {...register("titulo")}
            className="w-full border rounded-md px-3 py-2"
          />
          {errors.titulo && <p className="text-red-600 text-sm mt-1">{errors.titulo.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Categoría</label>
          <select {...register("categoria")} className="w-full border rounded-md px-3 py-2">
            <option value="">Seleccioná una categoría</option>
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.categoria && <p className="text-red-600 text-sm mt-1">{errors.categoria.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Imagen (URL, opcional)</label>
          <input
            {...register("imagenUrl")}
            className="w-full border rounded-md px-3 py-2"
            placeholder="https://..."
          />
        </div>

        <div className="border rounded-md p-4 bg-gray-50">
          <label className="block text-sm font-medium mb-2">
            Subir artículo desde archivo (.txt o .docx) — opcional
          </label>
          <input
            type="file"
            accept=".txt,.docx"
            onChange={handleArchivoChange}
            className="text-sm"
          />
          {subiendoArchivo && <p className="text-sm text-gray-500 mt-1">Procesando archivo...</p>}
          <p className="text-xs text-gray-500 mt-1">
            El contenido del archivo se carga abajo — podés revisarlo y editarlo antes de publicar.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contenido</label>
          <textarea
            {...register("contenido")}
            rows={12}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Escribí el artículo acá, o subí un archivo arriba para autocompletar..."
          />
          {errors.contenido && <p className="text-red-600 text-sm mt-1">{errors.contenido.message}</p>}
        </div>

        {errorServidor && <p className="text-red-600 text-sm">{errorServidor}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="bg-black text-white rounded-md px-4 py-2 disabled:opacity-50"
        >
          {enviando ? "Publicando..." : "Publicar artículo"}
        </button>
      </form>
    </div>
  );
}