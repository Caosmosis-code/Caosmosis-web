export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: "ADMIN" | "LECTOR" | "ESCRITOR";
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export interface RegistroPayload {
  nombre: string;
  email: string;
  password: string;
  codigoVerificacion: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}