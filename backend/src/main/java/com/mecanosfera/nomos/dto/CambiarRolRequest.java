<<<<<<< HEAD
package com.mecanosfera.nomos.dto;

import com.mecanosfera.nomos.model.Rol;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CambiarRolRequest {
    @NotNull(message = "El rol es obligatorio")
    private Rol rol;
=======
package com.mecanosfera.nomos.dto;

import com.mecanosfera.nomos.model.Rol;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CambiarRolRequest {
    @NotNull(message = "El rol es obligatorio")
    private Rol rol;
>>>>>>> 40ba4cc8b7a8079df02ef3c3c0534468ff47d7b9
}