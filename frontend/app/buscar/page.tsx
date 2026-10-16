import type { Metadata } from "next";
import ArticleCard from "@/components/ArticleCard";
import { Reveal } from "@/components/EditorialMotion";
import { SearchBox } from "@/components/EditorialUI";
import { getArticles } from "@/lib/server-data";

export const metadata: Metadata = { title: "Buscar", description: "Buscá notas y temas en el archivo de Caosmosis." };
type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLocaleLowerCase("es-AR");
  const articles = await getArticles();
  const results = query ? articles.filter((article) => [article.titulo, article.categoria, article.autorNombre, article.contenido].some((field) => field.toLocaleLowerCase("es-AR").includes(query))) : [];
  return <div className="shell search-page"><header className="page-intro"><p className="eyebrow">Archivo Caosmosis</p><h1>Buscar una idea.</h1><p>Encontrá una nota por tema, título o autor.</p><SearchBox /></header>{query && <section className="search-results"><p className="eyebrow">{results.length} {results.length === 1 ? "resultado" : "resultados"} para “{q}”</p>{results.length ? <div className="article-grid article-grid-three">{results.map((article) => <Reveal key={article.id}><ArticleCard article={article} /></Reveal>)}</div> : <p className="empty-state">No encontramos notas con esa búsqueda. Probá con otra palabra.</p>}</section>}</div>;
}
