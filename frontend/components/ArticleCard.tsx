"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Articulo } from "@/lib/tipos";
import { articleHref } from "@/lib/editorial";
import ArticleImage from "@/components/ArticleImage";

export default function ArticleCard({ article, featured = false }: { article: Articulo; featured?: boolean }) {
  return (
    <motion.article whileHover={{ y: -5 }} transition={{ duration: 0.25 }} className={`article-card group ${featured ? "article-card-featured" : ""}`}>
      <Link href={articleHref(article)} className="block" aria-label={`Leer: ${article.titulo}`}>
        <div className="article-card-image">
          <ArticleImage src={article.imagenUrl} alt="" priority={featured} />
          <span className="category-pill">{article.categoria}</span>
        </div>
        <div className="article-card-copy">
          <p className="eyebrow">{article.tiempoLectura} min de lectura</p>
          <h3>{article.titulo}</h3>
          <p className="article-byline">Por <span>{article.autorNombre}</span></p>
        </div>
      </Link>
    </motion.article>
  );
}
