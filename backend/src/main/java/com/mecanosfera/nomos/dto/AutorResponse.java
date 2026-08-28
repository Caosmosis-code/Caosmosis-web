package com.mecanosfera.nomos.dto;

import com.mecanosfera.nomos.model.Usuario;

import lombok.Data;

@Data
public class AutorResponse {
    private Long id;
    private String nombre;
    private String bio;

    public static AutorResponse desde(Usuario usuario) {
        AutorResponse dto = new AutorResponse();
        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setBio(usuario.getBio());
        return dto;
    }
}