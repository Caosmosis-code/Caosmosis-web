import type { Articulo, Comentario } from "@/lib/tipos";

export type EditorialArticle = Articulo & { excerpt?: string };

export const sampleArticles: EditorialArticle[] = [
  {
    id: 901,
    titulo: "La ciudad también piensa: caminar como forma de leer el mundo",
    categoria: "Cultura",
    autorNombre: "Lucía Ferreyra",
    autorId: 31,
    fechaPublicacion: "2026-10-10T12:00:00",
    tiempoLectura: 8,
    imagenUrl: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1800&q=85",
    contenido: "Caminar sin apuro cambia la escala de las cosas. Una avenida deja de ser una línea en el mapa y vuelve a ser una sucesión de fachadas, conversaciones, árboles y decisiones pequeñas.\n\nEn esa atención aparece una forma de conocimiento que no necesita separar al observador de lo observado. La ciudad se entiende con los pies: por sus ritmos, por las distancias que habilita y por los lugares donde invita a quedarse.\n\nQuizás por eso volver a caminarla sea también una manera de reclamarla. No como un decorado que atravesamos, sino como un espacio compartido que podemos cuidar, discutir y transformar.",
    estado: "PUBLICADO",
    esPortada: true,
    comentarioRevision: null,
    excerpt: "Una invitación a mirar las calles como un texto colectivo: sus ritmos, sus pausas y las formas de vida que hacen posibles.",
  },
  {
    id: 902,
    titulo: "Inteligencia artificial y trabajo: más allá del reemplazo",
    categoria: "Tecnología",
    autorNombre: "Tomás Ríos",
    autorId: 32,
    fechaPublicacion: "2026-10-09T09:30:00",
    tiempoLectura: 11,
    imagenUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=85",
    contenido: "La conversación sobre inteligencia artificial suele empezar por una pregunta binaria: qué tareas desaparecerán y cuáles sobrevivirán. Pero el trabajo no es una lista de tareas. También es una relación entre personas, instituciones y expectativas.\n\nCuando una herramienta automatiza una parte del proceso, reorganiza el tiempo y el poder alrededor de esa tarea. Entender ese cambio exige preguntar quién define el objetivo, quién conserva el conocimiento y quién recibe los beneficios de la productividad.",
    estado: "PUBLICADO",
    esPortada: false,
    comentarioRevision: null,
    excerpt: "Las herramientas cambian tareas, pero también redistribuyen tiempo, conocimiento y poder.",
  },
  {
    id: 903,
    titulo: "El cielo nocturno como patrimonio común",
    categoria: "Ciencia",
    autorNombre: "Malena Sosa",
    autorId: 33,
    fechaPublicacion: "2026-10-07T15:00:00",
    tiempoLectura: 6,
    imagenUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=85",
    contenido: "Durante siglos, mirar el cielo fue una experiencia cotidiana y compartida. Hoy, la contaminación lumínica borra lentamente esa posibilidad para millones de personas.\n\nProteger la oscuridad no significa renunciar a la ciudad iluminada: significa usar la luz con intención. Una lámpara bien dirigida mejora la seguridad sin tapar las estrellas.",
    estado: "PUBLICADO",
    esPortada: false,
    comentarioRevision: null,
    excerpt: "La oscuridad también es un bien público: cuidar el cielo empieza por decidir cómo iluminamos nuestras ciudades.",
  },
  {
    id: 904,
    titulo: "Leer en comunidad en tiempos de pantallas infinitas",
    categoria: "Opinión",
    autorNombre: "Lucía Ferreyra",
    autorId: 31,
    fechaPublicacion: "2026-10-05T11:00:00",
    tiempoLectura: 7,
    imagenUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=85",
    contenido: "La lectura parece una actividad solitaria, pero casi siempre llega acompañada: alguien recomendó el libro, lo editó, lo tradujo, lo prestó o dejó una nota en el margen.\n\nLas comunidades lectoras hacen visible esa trama y abren un espacio para pensar con otras personas, sin reducir cada conversación a una reacción inmediata.",
    estado: "PUBLICADO",
    esPortada: false,
    comentarioRevision: null,
    excerpt: "Cada libro circula dentro de una comunidad. Recuperar esa dimensión cambia la forma de leer y conversar.",
  },
  {
    id: 905,
    titulo: "Pequeñas tecnologías para una vida más lenta",
    categoria: "Actualidad",
    autorNombre: "Tomás Ríos",
    autorId: 32,
    fechaPublicacion: "2026-10-02T10:00:00",
    tiempoLectura: 9,
    imagenUrl: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=85",
    contenido: "No toda innovación acelera. Algunas herramientas están diseñadas para quitar pasos, reducir interrupciones y devolvernos un poco de atención.\n\nLa pregunta útil quizá no sea si una tecnología es nueva, sino qué tipo de vida vuelve más fácil. Esa respuesta depende menos de la promesa del producto que del uso que construimos alrededor.",
    estado: "PUBLICADO",
    esPortada: false,
    comentarioRevision: null,
    excerpt: "Una tecnología puede ser valiosa cuando nos devuelve tiempo y atención, en lugar de pedir más de ambos.",
  },
];

export const sampleComments: Comentario[] = [];

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function articleHref(article: Pick<Articulo, "id" | "titulo">): string {
  return `/articulo/${slugify(article.titulo)}-${article.id}`;
}

export function authorHref(author: Pick<Articulo, "autorId" | "autorNombre">): string {
  return `/autor/${slugify(author.autorNombre)}-${author.autorId}`;
}
