package com.mecanosfera.nomos.dto;

import java.time.LocalDateTime;

import com.mecanosfera.nomos.model.Rol;
import com.mecanosfera.nomos.model.Usuario;

import lombok.Data;

@Data
public class UsuarioAdminResponse {
    private Long id;
    private String nombre;
    private String email;
    private Rol rol;
    private LocalDateTime fechaCreacion;

    public static UsuarioAdminResponse desde(Usuario usuario) {
        UsuarioAdminResponse dto = new UsuarioAdminResponse();
        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setEmail(usuario.getEmail());
        dto.setRol(usuario.getRol());
        dto.setFechaCreacion(usuario.getFechaCreacion());
        return dto;
    }
}