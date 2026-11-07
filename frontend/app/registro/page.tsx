"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { registroSchema, RegistroFormData } from "@/lib/validaciones";
import { ApiError, apiFetch } from "@/lib/api";

export default function RegistroPage() {
  const { registrar } = useAuth();
  const [errorServidor, setErrorServidor] = useState<string | null>(null);
  const [mensajeServidor, setMensajeServidor] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [pasoCodigo, setPasoCodigo] = useState(false);
  const [datosRegistro, setDatosRegistro] = useState<RegistroFormData | null>(null);
  const [codigoVerificacion, setCodigoVerificacion] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistroFormData>({
    resolver: zodResolver(registroSchema),
  });

  async function onSubmit(data: RegistroFormData) {
    setErrorServidor(null);
    setMensajeServidor(null);
    setEnviando(true);
    try {
      await apiFetch<void>("/api/auth/solicitar-codigo", {
        method: "POST",
        body: JSON.stringify({ email: data.email }),
        skipAuth: true,
      });
      setDatosRegistro(data);
      setPasoCodigo(true);
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

  async function confirmarRegistro() {
    if (!datosRegistro) return;
    setErrorServidor(null);
    setMensajeServidor(null);
    setEnviando(true);
    try {
      await registrar({ ...datosRegistro, codigoVerificacion });
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

  async function reenviarCodigo() {
    if (!datosRegistro) return;
    setErrorServidor(null);
    setMensajeServidor(null);
    setEnviando(true);
    try {
      await apiFetch<void>("/api/auth/solicitar-codigo", {
        method: "POST",
        body: JSON.stringify({ email: datosRegistro.email }),
        skipAuth: true,
      });
      setMensajeServidor("Te enviamos un nuevo código.");
    } catch (err) {
      setErrorServidor(err instanceof ApiError ? err.message : "No se pudo reenviar el código.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-semibold text-center">{pasoCodigo ? "Verificá tu correo" : "Crear cuenta"}</h1>

        {!pasoCodigo ? <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            {enviando ? "Enviando código..." : "Enviar código de verificación"}
          </button>
        </form> : <form onSubmit={(event) => { event.preventDefault(); void confirmarRegistro(); }} className="space-y-4">
          <p className="text-sm text-center text-gray-600">Enviamos un código de 6 dígitos a {datosRegistro?.email}.</p>
          <div>
            <label htmlFor="codigoVerificacion" className="block text-sm font-medium mb-1">Código de verificación</label>
            <input
              id="codigoVerificacion"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={codigoVerificacion}
              onChange={(event) => setCodigoVerificacion(event.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full border rounded-md px-3 py-2 text-center tracking-[0.3em]"
              required
            />
          </div>
          {errorServidor && <p className="text-red-600 text-sm" role="alert">{errorServidor}</p>}
          {mensajeServidor && <p className="text-sm text-green-700" role="status">{mensajeServidor}</p>}
          <button type="submit" disabled={enviando || codigoVerificacion.length !== 6} className="w-full bg-black text-white rounded-md py-2 disabled:opacity-50">
            {enviando ? "Verificando..." : "Verificar y crear cuenta"}
          </button>
          <div className="flex justify-between gap-4 text-sm">
            <button type="button" className="underline" onClick={() => { setPasoCodigo(false); setErrorServidor(null); }}>Cambiar datos</button>
            <button type="button" className="underline" disabled={enviando} onClick={() => void reenviarCodigo()}>Reenviar código</button>
          </div>
        </form>}

        {!pasoCodigo && errorServidor && <p className="text-red-600 text-sm" role="alert">{errorServidor}</p>}

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