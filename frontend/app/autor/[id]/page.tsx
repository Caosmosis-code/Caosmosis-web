import type { Metadata } from "next";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import { Reveal } from "@/components/EditorialMotion";
import { SectionHeading } from "@/components/EditorialUI";
import { articleHref } from "@/lib/editorial";
import { getAuthor } from "@/lib/server-data";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getAuthor(id);
  return { title: data?.author.nombre ?? "Autor no encontrado", description: data?.author.bio ?? "Perfil de autor en Caosmosis." };
}

export default async function PerfilAutorPage({ params }: Props) {
  const { id: slug } = await params;
  const data = await getAuthor(slug);
  if (!data) return <div className="shell page-intro"><p className="eyebrow">Caosmosis</p><h1>Autor no encontrado</h1><Link className="text-link" href="/">Volver a la portada</Link></div>;
  const { author, articles } = data;
  const initials = author.nombre.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();

  return <>
    <section className="shell author-profile"><div className="author-avatar" aria-hidden="true">{initials}</div><div><p className="eyebrow">Voces de la revista</p><h1>{author.nombre}</h1><p>{author.bio || "Colaborador/a de Caosmosis."}</p></div></section>
    <section className="shell listing-grid"><SectionHeading eyebrow="Archivo personal" title={`${articles.length} ${articles.length === 1 ? "nota publicada" : "notas publicadas"}`} />{articles.length ? <div className="article-grid article-grid-three">{articles.map((article) => <Reveal key={article.id}><ArticleCard article={article} /></Reveal>)}</div> : <p className="empty-state">Todavía no hay notas publicadas de esta persona.</p>}</section>
  </>;
}
