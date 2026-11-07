<<<<<<< HEAD
package com.mecanosfera.nomos.dto;

import com.mecanosfera.nomos.model.Usuario;

import lombok.Data;

@Data
public class AutorResponse {
    private Long id;
    private String nombre;
    private String bio;
    private String instagram;
    private String twitter;

    public static AutorResponse desde(Usuario usuario) {
        AutorResponse dto = new AutorResponse();
        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setBio(usuario.getBio());
        dto.setInstagram(usuario.getInstagram());
        dto.setTwitter(usuario.getTwitter());
        return dto;
    }
=======
package com.mecanosfera.nomos.dto;

import com.mecanosfera.nomos.model.Usuario;

import lombok.Data;

@Data
public class AutorResponse {
    private Long id;
    private String nombre;
    private String bio;
    private String instagram;
    private String twitter;

    public static AutorResponse desde(Usuario usuario) {
        AutorResponse dto = new AutorResponse();
        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setBio(usuario.getBio());
        dto.setInstagram(usuario.getInstagram());
        dto.setTwitter(usuario.getTwitter());
        return dto;
    }
>>>>>>> 40ba4cc8b7a8079df02ef3c3c0534468ff47d7b9
}