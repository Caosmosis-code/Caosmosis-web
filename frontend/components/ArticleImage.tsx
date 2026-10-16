import Image from "next/image";

export default function ArticleImage({ src, alt, className = "", priority = false }: { src: string | null; alt: string; className?: string; priority?: boolean }) {
  if (!src) {
    return <div aria-label="Imagen no disponible" role="img" className={`image-placeholder ${className}`}><span>Caosmosis</span></div>;
  }
  let optimized = false;
  try { optimized = new URL(src).hostname === "images.unsplash.com"; } catch { /* Relative uploads use the native source unchanged. */ }
  return <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 1200px" priority={priority} unoptimized={!optimized} className={`object-cover ${className}`} />;
}
