"use client";

import CommentSection from "@/components/CommentSection";

export default function Comentarios({ articuloId }: { articuloId: number }) {
  return <CommentSection postId={articuloId} />;
}
