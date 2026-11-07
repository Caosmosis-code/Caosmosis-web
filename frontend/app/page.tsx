import Link from "next/link";
import LatestArticles from "@/components/LatestArticles";
import { SectionHeading } from "@/components/EditorialUI";
import { slugify } from "@/lib/editorial";
import { getArticles } from "@/lib/server-data";
import { CATEGORIAS } from "@/lib/categorias";

export default async function HomePage() {
  const articles = (await getArticles()).toSorted((left, right) =>
    new Date(right.fechaPublicacion).getTime() - new Date(left.fechaPublicacion).getTime(),
  );

  return (
    <>
      <section className="masthead-wrap">
        <div className="masthead shell">
          <p className="eyebrow">Caosmosis · Edición abierta</p>
          <h1>Ideas para entender <em>lo que nos pasa.</em></h1>
          <div className="masthead-meta"><span>Historias con contexto</span><span>·</span><span>Hecha en Argentina</span></div>
        </div>
      </section>

      <nav className="topic-strip shell" aria-label="Temas">
        {CATEGORIAS.map((category) => <Link key={category} href={`/categoria/${slugify(category)}`}>{category}</Link>)}
      </nav>

      <section className="shell latest-section">
        <SectionHeading eyebrow="Actualidad" title="Últimas notas" />
        <LatestArticles articles={articles} />
      </section>

      <section className="subscribe-band" id="suscripcion">
        <div className="shell subscribe-inner">
          <div><p className="eyebrow">Próximamente</p><h2>Caosmosis, sin anuncios.</h2><p>Estamos preparando una suscripción con más contenido exclusivo y una experiencia de lectura sin publicidad.</p></div>
        </div>
      </section>

    </>
  );
}
