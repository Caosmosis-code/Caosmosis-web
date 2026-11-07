import { notFound, redirect } from "next/navigation";
import { articleHref } from "@/lib/editorial";
import { getArticle } from "@/lib/server-data";

type Props = { params: Promise<{ id: string }> };

export default async function LegacyArticleRedirect({ params }: Props) {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) notFound();
  redirect(articleHref(article));
}
