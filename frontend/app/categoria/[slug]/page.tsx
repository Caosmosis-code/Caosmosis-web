import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import { Reveal } from "@/components/EditorialMotion";
import { slugify } from "@/lib/editorial";
import { getArticles } from "@/lib/server-data";
import { CATEGORIAS } from "@/lib/categorias";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIAS.find((item) => slugify(item) === slug);
  return { title: category ?? "Categoría", description: category ? `Notas de ${category} en Caosmosis.` : "Explorá nuestras categorías." };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = CATEGORIAS.find((item) => slugify(item) === slug);
  if (!category) notFound();
  const articles = (await getArticles()).filter((article) => slugify(article.categoria) === slug);
  return <><header className="shell page-intro"><p className="eyebrow">Explorar por tema</p><h1>{category}</h1><p>Ideas, historias y preguntas para mirar {category.toLowerCase()} desde nuevos ángulos.</p></header><section className="shell listing-grid"><div className="article-grid article-grid-three">{articles.map((article) => <Reveal key={article.id}><ArticleCard article={article} /></Reveal>)}</div>{!articles.length && <p className="empty-state">Todavía no hay notas publicadas en esta categoría.</p>}</section></>;
}
