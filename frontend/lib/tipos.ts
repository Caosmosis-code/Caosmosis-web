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