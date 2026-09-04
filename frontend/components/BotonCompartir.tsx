"use client";

import { useState } from "react";

export default function BotonCompartir({ titulo }: { titulo: string }) {
  const [copiado, setCopiado] = useState(false);

  async function compartir() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, url });
      } catch {
        // el usuario canceló el share nativo, no hacemos nada
      }
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <button
      onClick={compartir}
      className="font-mono text-xs uppercase tracking-wide border border-graphite/30 rounded-full px-4 py-1.5 hover:border-brass hover:text-brass transition-colors"
    >
      {copiado ? "Link copiado!" : "Compartir"}
    </button>
  );
}