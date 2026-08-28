import { z } from "zod";

export const registroSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().min(1, "El email es obligatorio").email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type RegistroFormData = z.infer<typeof registroSchema>;

export const loginSchema = z.object({
  email: z.string().min(1, "El email es obligatorio").email("Email inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export const articuloSchema = z.object({
  titulo: z.string().min(1, "El título es obligatorio"),
  categoria: z.string().min(1, "La categoría es obligatoria"),
  contenido: z.string().min(1, "El contenido es obligatorio"),
  imagenUrl: z.string().optional(),
});

export type ArticuloFormData = z.infer<typeof articuloSchema>;

export type LoginFormData = z.infer<typeof loginSchema>;