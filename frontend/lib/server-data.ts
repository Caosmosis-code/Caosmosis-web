import "server-only";

import type { Articulo, Comentario } from "@/lib/tipos";
import { sampleArticles, slugify, type EditorialArticle } from "@/lib/editorial";

export interface Author {
  id: number;
  nombre: string;
  bio: string | null;
  instagram?: string | null;
  twitter?: string | null;
}

function apiBase(): string | null {
  const configured = process.env.NEXT_PUBLIC_API_URL;
  if (configured) return configured.replace(/\/$/, "");
  return process.env.NODE_ENV === "development" ? "http://localhost:8080" : null;
}

async function readApi<T>(path: string, revalidate = 60): Promise<T | null> {
  const base = apiBase();
  if (!base) return null;
  try {
    const response = await fetch(`${base}${path}`, { next: { revalidate } });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getArticles(): Promise<EditorialArticle[]> {
  const articles = await readApi<Articulo[]>("/api/articulos");
  return articles ?? sampleArticles;
}

function idFromSlug(slug: string): number | null {
  const match = slug.match(/(?:^|-)(\d+)$/);
  return match ? Number(match[1]) : /^\d+$/.test(slug) ? Number(slug) : null;
}

export async function getArticle(slug: string): Promise<EditorialArticle | null> {
  const id = idFromSlug(slug);
  if (id !== null) {
    const article = await readApi<Articulo>(`/api/articulos/${id}`, 0);
    if (article) return article;
    return sampleArticles.find((item) => item.id === id || slugify(item.titulo) === slug) ?? null;
  }
  const articles = await getArticles();
  return articles.find((article) => slugify(article.titulo) === slug) ?? null;
}

export async function getAuthor(slug: string): Promise<{ author: Author; articles: Articulo[] } | null> {
  const id = idFromSlug(slug);
  if (id !== null) {
    const [author, articles] = await Promise.all([
      readApi<Author>(`/api/autores/${id}`),
      readApi<Articulo[]>(`/api/autores/${id}/articulos`),
    ]);
    if (author && articles) return { author, articles };
    const sample = sampleArticles.filter((article) => article.autorId === id);
    if (sample.length) {
      return {
        author: { id, nombre: sample[0].autorNombre, bio: "Escribimos para conectar ideas, cultura y vida cotidiana." },
        articles: sample,
      };
    }
  }
  const articles = await getArticles();
  const matching = articles.filter((article) => slugify(article.autorNombre) === slug);
  if (!matching.length) return null;
  return {
    author: { id: matching[0].autorId, nombre: matching[0].autorNombre, bio: "Escribimos para conectar ideas, cultura y vida cotidiana." },
    articles: matching,
  };
}

export async function getComments(postId: number): Promise<Comentario[]> {
  return (await readApi<Comentario[]>(`/api/articulos/${postId}/comentarios`, 0)) ?? [];
}

export function categoryArticles(articles: Articulo[], categorySlug: string): Articulo[] {
  return articles.filter((article) => slugify(article.categoria) === categorySlug);
}

export function findRelatedArticles(articles: Articulo[], currentId: number): Articulo[] {
  return articles.filter((article) => article.id !== currentId).slice(0, 3);
}
