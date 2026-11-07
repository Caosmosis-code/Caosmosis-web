import Link from "next/link";
import { CATEGORIAS } from "@/lib/categorias";
import { slugify } from "@/lib/editorial";
import { NewsletterForm } from "@/components/EditorialUI";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div className="footer-about"><Link href="/" className="brand brand-footer"><span className="brand-mark">c.</span><span>caosmosis</span></Link><p>Una revista independiente para mirar el presente desde más de un lugar.</p><div className="social-links"><a href="https://www.instagram.com/" aria-label="Instagram de Caosmosis">Instagram ↗</a><a href="https://x.com/" aria-label="X de Caosmosis">X ↗</a></div></div>
        <div className="footer-column"><h2>Explorar</h2><Link href="/">Inicio</Link><Link href="/buscar">Buscar</Link><Link href="/quienes-somos">Quiénes somos</Link>{CATEGORIAS.slice(0, 3).map((category) => <Link key={category} href={`/categoria/${slugify(category)}`}>{category}</Link>)}</div>
        <div className="footer-newsletter"><p className="eyebrow">Boletín</p><h2>Una lectura para llevar.</h2><p>Recibí las nuevas notas directamente en tu correo.</p><NewsletterForm compact /></div>
      </div>
      <div className="shell footer-bottom"><span>© {new Date().getFullYear()} Caosmosis</span><span>Hecha con curiosidad en Argentina</span><Link href="/quienes-somos">Contacto y equipo</Link></div>
    </footer>
  );
}
