package com.mecanosfera.nomos.dto;

import com.mecanosfera.nomos.model.Usuario;

import lombok.Data;

@Data
public class PerfilResponse {
    private Long id;
    private String nombre;
    private String email;
    private String bio;
    private String instagram;
    private String twitter;
    private boolean contactoPublico;

    public static PerfilResponse desde(Usuario usuario) {
        PerfilResponse dto = new PerfilResponse();
        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setEmail(usuario.getEmail());
        dto.setBio(usuario.getBio());
        dto.setInstagram(usuario.getInstagram());
        dto.setTwitter(usuario.getTwitter());
        dto.setContactoPublico(usuario.isContactoPublico());
        return dto;
    }
}