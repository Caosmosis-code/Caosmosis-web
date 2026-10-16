package com.mecanosfera.nomos.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ComentarioRequest {
    @NotBlank(message = "El comentario no puede estar vacío")
    @Size(max = 5000, message = "El comentario es demasiado largo")
    private String contenido;

    private Long comentarioPadreId;

    @Size(max = 80)
    private String autorNombre;

    @Email
    @Size(max = 180)
    private String autorEmail;
}
