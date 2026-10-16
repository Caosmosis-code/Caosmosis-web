import Link from "next/link";
import ArticleImage from "@/components/ArticleImage";
import ArticleCard from "@/components/ArticleCard";
import { NewsletterForm, SectionHeading } from "@/components/EditorialUI";
import { Parallax, Reveal } from "@/components/EditorialMotion";
import { articleHref, authorHref, slugify } from "@/lib/editorial";
import { getArticles } from "@/lib/server-data";
import { CATEGORIAS } from "@/lib/categorias";

export default async function HomePage() {
  const articles = await getArticles();
  const [lead, ...rest] = articles;
  const latest = lead ? rest : [];

  return (
    <>
      <section className="masthead-wrap">
        <div className="masthead shell">
          <p className="eyebrow">Ideas para entender lo que nos pasa</p>
          <h1>Una revista para <em>pensar en voz alta.</em></h1>
          <p className="masthead-deck">Cultura, ciencia y tecnología contadas con tiempo, contexto y curiosidad.</p>
          <div className="masthead-meta"><span>Lectura abierta</span><span>·</span><span>Hecha en Argentina</span></div>
        </div>
      </section>

      {lead && <section className="shell lead-story" aria-labelledby="lead-title">
        <Reveal className="lead-image-wrap">
          <Parallax className="lead-image-parallax"><Link href={articleHref(lead)} className="lead-image-link" aria-label={`Leer ${lead.titulo}`}>
            <ArticleImage src={lead.imagenUrl} alt="" priority />
            <span className="lead-image-label">La historia de hoy</span>
          </Link></Parallax>
        </Reveal>
        <Reveal className="lead-copy" delay={0.08}>
          <Link href={`/categoria/${slugify(lead.categoria)}`} className="category-label">{lead.categoria}</Link>
          <h2 id="lead-title"><Link href={articleHref(lead)}>{lead.titulo}</Link></h2>
          <p className="lead-excerpt">{lead.excerpt ?? lead.contenido.split(/\n+/)[0]}</p>
          <div className="byline"><span>Por <Link href={authorHref(lead)}>{lead.autorNombre}</Link></span><span>{lead.tiempoLectura} min de lectura</span></div>
          <Link className="text-link" href={articleHref(lead)}>Leer la nota <span aria-hidden="true">↗</span></Link>
        </Reveal>
      </section>}

      <section className="shell latest-section">
        <SectionHeading eyebrow="En la revista" title="Lo último" href="/buscar" linkLabel="Explorar notas" />
        {latest.length ? <div className="article-grid article-grid-three">
          {latest.slice(0, 3).map((article, index) => <Reveal key={article.id} delay={index * 0.06}><ArticleCard article={article} /></Reveal>)}
        </div> : <p className="empty-state">Todavía no hay más notas. Volvé pronto.</p>}
      </section>

      <section className="subscribe-band" id="newsletter">
        <div className="shell subscribe-inner">
          <div><p className="eyebrow">Una pausa en tu inbox</p><h2>Buenas ideas, sin ruido.</h2><p>Recibí nuestra selección editorial y novedades de la comunidad.</p></div>
          <NewsletterForm />
        </div>
      </section>

      {CATEGORIAS.map((category) => {
        const categoryItems = articles.filter((article) => article.categoria.toLowerCase() === category.toLowerCase()).slice(0, 2);
        if (!categoryItems.length) return null;
        return <section className="shell category-section" key={category}>
          <SectionHeading eyebrow="Una mirada más de cerca" title={category} href={`/categoria/${slugify(category)}`} />
          <div className="article-grid article-grid-two">
            {categoryItems.map((article) => <Reveal key={article.id}><ArticleCard article={article} /></Reveal>)}
          </div>
        </section>;
      })}

      {lead && <section className="shell editors-note">
        <div><p className="eyebrow">La comunidad Caosmosis</p><h2>Leer es el comienzo de la conversación.</h2><p>Las notas están abiertas. Sumate a comentar, compartir una pregunta o proponer una idea.</p></div>
        <Link href={articleHref(lead)} className="button button-outline">Entrar a la conversación <span aria-hidden="true">↗</span></Link>
      </section>}
    </>
  );
}
