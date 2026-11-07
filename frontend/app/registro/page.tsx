"use client";

import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ApiError, apiFetch } from "@/lib/api";
import { RegistroFormData, RegistroFormInput, registroSchema } from "@/lib/validaciones";
import { useAuth } from "@/context/AuthContext";

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
  } = useForm<RegistroFormInput, unknown, RegistroFormData>({
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
    } catch (error) {
      setErrorServidor(error instanceof ApiError ? error.message : "Ocurrió un error inesperado. Intentá de nuevo.");
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
    } catch (error) {
      setErrorServidor(error instanceof ApiError ? error.message : "Ocurrió un error inesperado. Intentá de nuevo.");
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
    } catch (error) {
      setErrorServidor(error instanceof ApiError ? error.message : "No se pudo reenviar el código.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-center text-2xl font-semibold">
          {pasoCodigo ? "Verificá tu correo" : "Crear cuenta"}
        </h1>

        {!pasoCodigo ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="nombre" className="mb-1 block text-sm font-medium">Nombre</label>
              <input id="nombre" type="text" {...register("nombre")} className="w-full rounded-md border px-3 py-2" />
              {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
              <input id="email" type="email" {...register("email")} className="w-full rounded-md border px-3 py-2" />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium">Contraseña</label>
              <input id="password" type="password" {...register("password")} className="w-full rounded-md border px-3 py-2" />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <label className="flex items-start gap-3 text-sm leading-5">
              <input type="checkbox" {...register("recibirNovedades")} className="mt-1" />
              <span>Quiero recibir avisos por correo cuando se publiquen nuevos artículos. Puedo darme de baja desde mi perfil.</span>
            </label>

            {errorServidor && <p className="text-sm text-red-600" role="alert">{errorServidor}</p>}
            <button type="submit" disabled={enviando} className="w-full rounded-md bg-black py-2 text-white disabled:opacity-50">
              {enviando ? "Enviando código..." : "Enviar código de verificación"}
            </button>
          </form>
        ) : (
          <form onSubmit={(event) => { event.preventDefault(); void confirmarRegistro(); }} className="space-y-4">
            <p className="text-center text-sm text-gray-600">Enviamos un código de 6 dígitos a {datosRegistro?.email}.</p>
            <div>
              <label htmlFor="codigoVerificacion" className="mb-1 block text-sm font-medium">Código de verificación</label>
              <input
                id="codigoVerificacion"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={codigoVerificacion}
                onChange={(event) => setCodigoVerificacion(event.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full rounded-md border px-3 py-2 text-center tracking-[0.3em]"
                required
              />
            </div>
            {errorServidor && <p className="text-sm text-red-600" role="alert">{errorServidor}</p>}
            {mensajeServidor && <p className="text-sm text-green-700" role="status">{mensajeServidor}</p>}
            <button type="submit" disabled={enviando || codigoVerificacion.length !== 6} className="w-full rounded-md bg-black py-2 text-white disabled:opacity-50">
              {enviando ? "Verificando..." : "Verificar y crear cuenta"}
            </button>
            <div className="flex justify-between gap-4 text-sm">
              <button type="button" className="underline" onClick={() => { setPasoCodigo(false); setErrorServidor(null); }}>Cambiar datos</button>
              <button type="button" className="underline" disabled={enviando} onClick={() => void reenviarCodigo()}>Reenviar código</button>
            </div>
          </form>
        )}

        <p className="text-center text-sm">
          ¿Ya tenés cuenta? <Link href="/login" className="underline">Iniciá sesión</Link>
        </p>
      </div>
    </div>
  );
}