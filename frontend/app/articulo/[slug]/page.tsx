import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ArticleImage from "@/components/ArticleImage";
import CommentSection from "@/components/CommentSection";
import { Parallax, ReadingProgress, Reveal } from "@/components/EditorialMotion";
import ArticleCard from "@/components/ArticleCard";
import { SectionHeading } from "@/components/EditorialUI";
import { articleHref, authorHref, slugify } from "@/lib/editorial";
import { findRelatedArticles, getArticle, getArticles, getComments } from "@/lib/server-data";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Nota no encontrada" };
  return { title: article.titulo, description: article.excerpt ?? article.contenido.slice(0, 155), openGraph: { title: article.titulo, description: article.excerpt ?? article.contenido.slice(0, 155), images: article.imagenUrl ? [article.imagenUrl] : [] } };
}

function RichText({ content }: { content: string }) {
  return <div className="article-content">{content.split(/\n+/).map((line, index) => {
    const text = line.trim();
    if (!text) return null;
    if (text.startsWith("> ")) return <blockquote key={index}>{text.slice(2)}</blockquote>;
    if (text.startsWith("## ")) return <h2 key={index}>{text.slice(3)}</h2>;
    return <p key={index}>{text}</p>;
  })}</div>;
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();
  const [comments, allArticles] = await Promise.all([getComments(article.id), getArticles()]);
  const related = findRelatedArticles(allArticles, article.id);
  const date = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(article.fechaPublicacion));
  const excerpt = (article as typeof article & { excerpt?: string }).excerpt ?? article.contenido.split(/\n+/)[0];

  return <>
    <ReadingProgress />
    <article className="article-page">
      <header className="article-header">
        <Link href={`/categoria/${slugify(article.categoria)}`} className="category-label">{article.categoria}</Link>
        <h1>{article.titulo}</h1>
        <p className="article-deck">{excerpt}</p>
        <div className="article-meta"><span>Por <Link href={authorHref(article)}>{article.autorNombre}</Link></span><time dateTime={article.fechaPublicacion}>{date}</time><span>{article.tiempoLectura} min de lectura</span></div>
      </header>
      <Reveal><Parallax className="article-cover-parallax"><figure className="article-cover"><ArticleImage src={article.imagenUrl} alt={`Imagen de portada: ${article.titulo}`} priority /></figure></Parallax></Reveal>
      <RichText content={article.contenido} />
      <div className="article-actions"><Link href={`/categoria/${slugify(article.categoria)}`} className="button button-outline">Más de {article.categoria}</Link><a href="#comentarios" className="button button-dark">Ir a comentarios <span aria-hidden="true">↓</span></a></div>
    </article>
    <CommentSection postId={article.id} initialComments={comments} />
    {related.length > 0 && <section className="article-related"><div className="shell"><SectionHeading eyebrow="Seguí explorando" title="También puede interesarte" /><div className="article-grid article-grid-three">{related.map((item) => <ArticleCard key={item.id} article={item} />)}</div></div></section>}
  </>;
}
