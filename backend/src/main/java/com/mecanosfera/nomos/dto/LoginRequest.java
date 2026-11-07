<<<<<<< HEAD
package com.mecanosfera.nomos.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank
    private String email;

    @NotBlank
    private String password;
=======
package com.mecanosfera.nomos.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank
    private String email;

    @NotBlank
    private String password;
>>>>>>> 40ba4cc8b7a8079df02ef3c3c0534468ff47d7b9
}