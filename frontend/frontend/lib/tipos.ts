export interface Articulo {
  id: number;
  titulo: string;
  contenido: string;
  categoria: string;
  autorNombre: string;
  autorId: number;
  fechaPublicacion: string;
  tiempoLectura: number;
  imagenUrl: string | null;
  estado: "PENDIENTE" | "PUBLICADO" | "RECHAZADO";
  esPortada: boolean;
  comentarioRevision: string | null;
  autorEmail: string | null;
  autorInstagram: string | null;
  autorTwitter: string | null;
}
export interface Comentario {
  id: number;
  contenido: string;
  usuarioNombre: string;
  usuarioId: number;
  fecha: string;
  comentarioPadreId: number | null;
  cantidadLikes: number;
  likeadoPorMi: boolean;
}
export interface ArticuloEstadistica {
  id: number;
  titulo: string;
  categoria: string;
  estado: string;
  fechaPublicacion: string;
  cantidadComentarios: number;
  cantidadLikes: number;
}