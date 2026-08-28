"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { usuario, cargando, logout } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);

  function cerrarYLogout() {
    setMenuAbierto(false);
    logout();
  }

  return (
    <header className="border-b border-graphite/15 bg-paper relative">
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="font-display text-xl tracking-tight" onClick={() => setMenuAbierto(false)}>
          Caosmosis
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-5 font-mono text-xs uppercase tracking-wide">
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
              <Link href="/registro" className="border border-graphite/30 rounded-full px-3 py-1.5 hover:border-brass hover:text-brass transition-colors">
                Crear cuenta
              </Link>
            </>
          )}
        </div>

        {/* Botón hamburguesa */}
        <button
          onClick={() => setMenuAbierto((v) => !v)}
          className="md:hidden font-mono text-xs uppercase tracking-wide border border-graphite/30 rounded-full px-3 py-1.5"
        >
          {menuAbierto ? "Cerrar" : "Menú"}
        </button>
      </nav>

      {/* Mobile */}
      {menuAbierto && (
        <div className="md:hidden border-t border-graphite/15 bg-paper px-4 py-4 flex flex-col gap-3 font-mono text-xs uppercase tracking-wide">
          <Link href="/" onClick={() => setMenuAbierto(false)}>Inicio</Link>

          {cargando ? null : usuario ? (
            <>
              {(usuario.rol === "ADMIN" || usuario.rol === "ESCRITOR") && (
                <>
                  <Link href="/admin/articulos/nuevo" onClick={() => setMenuAbierto(false)}>Nuevo artículo</Link>
                  <Link href="/mis-articulos" onClick={() => setMenuAbierto(false)}>Mis artículos</Link>
                </>
              )}
              {usuario.rol === "ADMIN" && (
                <>
                  <Link href="/admin/revision" onClick={() => setMenuAbierto(false)}>Revisión</Link>
                  <Link href="/admin/portada" onClick={() => setMenuAbierto(false)}>Portada</Link>
                  <Link href="/admin/usuarios" onClick={() => setMenuAbierto(false)}>Usuarios</Link>
                </>
              )}
              <span className="text-graphite/50 normal-case font-body">Hola, {usuario.nombre}</span>
              <button onClick={cerrarYLogout} className="text-left border border-graphite/30 rounded-full px-3 py-1.5 w-fit">
                Salir
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuAbierto(false)}>Ingresar</Link>
              <Link href="/registro" onClick={() => setMenuAbierto(false)} className="border border-graphite/30 rounded-full px-3 py-1.5 w-fit">
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}