"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { SearchBox } from "@/components/EditorialUI";
import { slugify } from "@/lib/editorial";
import { CATEGORIAS } from "@/lib/categorias";

export default function Navbar() {
  const { usuario, cargando, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const managementUser = usuario && (usuario.rol === "ADMIN" || usuario.rol === "ESCRITOR");

  const categoryLinks = CATEGORIAS.slice(0, 4).map((category) => (
    <Link key={category} href={`/categoria/${slugify(category)}`} onClick={() => setMenuOpen(false)}>{category}</Link>
  ));

  return (
    <header className="site-header">
      {managementUser && <div className="management-bar"><div className="shell management-links">
        <Link href="/admin/articulos/nuevo">Nueva nota</Link><Link href="/mis-articulos">Mis notas</Link>
        {usuario?.rol === "ADMIN" && <><Link href="/admin/revision">Revisión editorial</Link><Link href="/admin/comentarios">Comentarios</Link><Link href="/admin/portada">Portada</Link><Link href="/admin/usuarios">Usuarios</Link></>}
      </div></div>}
      <nav className="nav-shell shell" aria-label="Navegación principal">
        <Link href="/" className="brand" aria-label="Caosmosis, inicio"><span className="brand-mark">c.</span><span>caosmosis</span></Link>
        <div className="desktop-nav"><Link href="/">Inicio</Link>{categoryLinks}</div>
        <div className="nav-actions"><SearchBox compact /><Link href="#newsletter" className="button button-small">Suscribirme <span aria-hidden="true">↗</span></Link>
          {!cargando && (usuario ? <button className="nav-user" onClick={logout} aria-label={`Cerrar sesión de ${usuario.nombre}`}>{usuario.nombre.split(" ")[0]} · Salir</button> : <Link href="/login" className="login-link">Ingresar</Link>)}
        </div>
        <button className="menu-toggle" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} onClick={() => setMenuOpen((open) => !open)}><span /><span /></button>
      </nav>
      {menuOpen && <div id="mobile-navigation" className="mobile-nav shell">
        <Link href="/" onClick={() => setMenuOpen(false)}>Inicio</Link>{categoryLinks}<Link href="/buscar" onClick={() => setMenuOpen(false)}>Buscar artículos</Link><Link href="#newsletter" onClick={() => setMenuOpen(false)}>Suscribirme al boletín</Link>
        {!cargando && usuario && <><span className="mobile-greeting">Hola, {usuario.nombre}</span><button onClick={() => { logout(); setMenuOpen(false); }}>Cerrar sesión</button></>}
        {!cargando && !usuario && <Link href="/login" onClick={() => setMenuOpen(false)}>Ingresar</Link>}
        {managementUser && <><Link href="/admin/articulos/nuevo" onClick={() => setMenuOpen(false)}>Escribir una nota</Link>{usuario?.rol === "ADMIN" && <Link href="/admin/comentarios" onClick={() => setMenuOpen(false)}>Moderar comentarios</Link>}</>}
      </div>}
    </header>
  );
}
