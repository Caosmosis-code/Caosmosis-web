"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { loginSchema, LoginFormData } from "@/lib/validaciones";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const { login } = useAuth();
  const [errorServidor, setErrorServidor] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setErrorServidor(null);
    setEnviando(true);
    try {
      await login(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorServidor("Email o contraseña incorrectos");
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
        <h1 className="text-2xl font-semibold text-center">Iniciar sesión</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            {enviando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="text-sm text-center">
          ¿No tenés cuenta?{" "}
          <Link href="/registro" className="underline">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}