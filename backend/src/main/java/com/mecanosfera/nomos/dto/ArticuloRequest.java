package com.mecanosfera.nomos.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ArticuloRequest {

    @NotBlank(message = "El título es obligatorio")
    private String titulo;

    @NotBlank(message = "El contenido es obligatorio")
    private String contenido;

    @NotBlank(message = "La categoría es obligatoria")
    private String categoria;

    private String imagenUrl;
}