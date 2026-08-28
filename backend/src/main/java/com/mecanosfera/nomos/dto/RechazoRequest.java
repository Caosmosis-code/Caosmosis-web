package com.mecanosfera.nomos.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RechazoRequest {
    @NotBlank(message = "Tenés que indicar qué hay que cambiar")
    private String comentario;
}