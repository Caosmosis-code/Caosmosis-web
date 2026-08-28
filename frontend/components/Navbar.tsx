"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { usuario, cargando, logout } = useAuth();

  return (
    <header className="border-b border-graphite/15 bg-paper">
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="font-display text-xl tracking-tight">
          Caosmosis
        </Link>

        <div className="flex items-center gap-5 font-mono text-xs uppercase tracking-wide">
          <Link href="/" className="hover:text-brass transition-colors">Inicio</Link>

          {cargando ? null : usuario ? (
            <>
              {(usuario.rol === "ADMIN" || usuario.rol === "ESCRITOR") && (
                <>
                  <Link href="/admin/articulos/nuevo" className="hover:text-brass transition-colors">Nuevo artículo</Link>
                  <Link href="/mis-articulos" className="hover:text-brass transition-colors">Mis artículos</Link>
                </>
              )}
              {usuario.rol === "ADMIN" && (
                <>
                  <Link href="/admin/revision" className="hover:text-brass transition-colors">Revisión</Link>
                  <Link href="/admin/portada" className="hover:text-brass transition-colors">Portada</Link>
                  <Link href="/admin/usuarios" className="hover:text-brass transition-colors">Usuarios</Link>
                </>
              )}
              <span className="text-graphite/50 normal-case font-body">Hola, {usuario.nombre}</span>
              <button onClick={logout} className="border border-graphite/30 rounded-full px-3 py-1.5 hover:border-brass hover:text-brass transition-colors">
                Salir
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-brass transition-colors">Ingresar</Link>
              <Link
                href="/registro"
                className="border border-graphite/30 rounded-full px-3 py-1.5 hover:border-brass hover:text-brass transition-colors"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}