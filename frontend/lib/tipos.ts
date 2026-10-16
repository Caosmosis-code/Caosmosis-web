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
}
export interface Comentario {
  id: number;
  contenido: string;
  usuarioNombre: string;
  usuarioId: number | null;
  fecha: string;
  comentarioPadreId: number | null;
  cantidadLikes: number;
  likeadoPorMi: boolean;
  estado?: "PENDIENTE" | "APROBADO" | "RECHAZADO";
  articuloId?: number;
}
