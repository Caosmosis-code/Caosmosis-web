package com.mecanosfera.nomos.dto;

import com.mecanosfera.nomos.model.Rol;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CambiarRolRequest {
    @NotNull(message = "El rol es obligatorio")
    private Rol rol;
}