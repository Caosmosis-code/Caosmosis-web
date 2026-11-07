"use client";

import { useState } from "react";
import ArticleCard from "@/components/ArticleCard";
import type { Articulo } from "@/lib/tipos";

export default function LatestArticles({ articles }: { articles: Articulo[] }) {
  const [visibleCount, setVisibleCount] = useState(4);
  const visibleArticles = articles.slice(0, visibleCount);

  if (!articles.length) {
    return <p className="empty-state">Todavía no hay notas publicadas.</p>;
  }

  return (
    <>
      <div className="article-grid article-grid-four">
        {visibleArticles.map((article) => <ArticleCard key={article.id} article={article} />)}
      </div>
      {visibleCount < articles.length && (
        <div className="load-more-wrap">
          <button className="button button-dark" onClick={() => setVisibleCount((count) => count + 4)}>
            Cargar Más
          </button>
        </div>
      )}
    </>
  );
}