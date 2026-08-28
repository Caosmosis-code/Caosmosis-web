export default function Footer() {
  return (
    <footer className="bg-ink text-chalk mt-16">
      <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="font-display text-lg">Caosmosis</p>
          <p className="font-mono text-xs text-chalk/50 mt-1">
            Notas, análisis y discusión.
          </p>
        </div>
        <p className="font-mono text-xs text-chalk/40">
          © {new Date().getFullYear()} Caosmosis
        </p>
      </div>
    </footer>
  );
}