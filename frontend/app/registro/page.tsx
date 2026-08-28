"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { registroSchema, RegistroFormData } from "@/lib/validaciones";
import { ApiError } from "@/lib/api";

export default function RegistroPage() {
  const { registrar } = useAuth();
  const [errorServidor, setErrorServidor] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistroFormData>({
    resolver: zodResolver(registroSchema),
  });

  async function onSubmit(data: RegistroFormData) {
    setErrorServidor(null);
    setEnviando(true);
    try {
      await registrar(data);
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

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-semibold text-center">Crear cuenta</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium mb-1">
              Nombre
            </label>
            <input
              id="nombre"
              type="text"
              {...register("nombre")}
              className="w-full border rounded-md px-3 py-2"
            />
            {errors.nombre && (
              <p className="text-red-600 text-sm mt-1">{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full border rounded-md px-3 py-2"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="w-full border rounded-md px-3 py-2"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {errorServidor && (
            <p className="text-red-600 text-sm">{errorServidor}</p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-black text-white rounded-md py-2 disabled:opacity-50"
          >
            {enviando ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="text-sm text-center">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="underline">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
}