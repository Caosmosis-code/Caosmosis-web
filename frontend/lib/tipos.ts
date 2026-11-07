<<<<<<< HEAD
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
=======
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
>>>>>>> 40ba4cc8b7a8079df02ef3c3c0534468ff47d7b9
