"use client";

import { useEffect, useState } from "react";

export default function BarraProgreso() {
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    function calcular() {
      const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
      const scrollActual = window.scrollY;
      const porcentaje = alturaTotal > 0 ? (scrollActual / alturaTotal) * 100 : 0;
      setProgreso(Math.min(100, Math.max(0, porcentaje)));
    }

    calcular();
    window.addEventListener("scroll", calcular, { passive: true });
    window.addEventListener("resize", calcular);
    return () => {
      window.removeEventListener("scroll", calcular);
      window.removeEventListener("resize", calcular);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-graphite/10">
      <div
        className="h-full bg-brass transition-[width] duration-150 ease-out"
        style={{ width: `${progreso}%` }}
      />
    </div>
  );
}