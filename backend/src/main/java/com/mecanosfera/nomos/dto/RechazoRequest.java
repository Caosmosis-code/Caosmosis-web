<<<<<<< HEAD
package com.mecanosfera.nomos.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RechazoRequest {
    @NotBlank(message = "Tenés que indicar qué hay que cambiar")
    private String comentario;
=======
package com.mecanosfera.nomos.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RechazoRequest {
    @NotBlank(message = "Tenés que indicar qué hay que cambiar")
    private String comentario;
>>>>>>> 40ba4cc8b7a8079df02ef3c3c0534468ff47d7b9
}