<<<<<<< HEAD
package com.mecanosfera.nomos.dto;

import com.mecanosfera.nomos.model.Rol;
import com.mecanosfera.nomos.model.Usuario;

import lombok.Data;

@Data
public class UsuarioResponse {
    private Long id;
    private String nombre;
    private String email;
    private Rol rol;

    public static UsuarioResponse desde(Usuario usuario) {
        UsuarioResponse dto = new UsuarioResponse();
        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setEmail(usuario.getEmail());
        dto.setRol(usuario.getRol());
        return dto;
    }
=======
package com.mecanosfera.nomos.dto;

import com.mecanosfera.nomos.model.Rol;
import com.mecanosfera.nomos.model.Usuario;

import lombok.Data;

@Data
public class UsuarioResponse {
    private Long id;
    private String nombre;
    private String email;
    private Rol rol;

    public static UsuarioResponse desde(Usuario usuario) {
        UsuarioResponse dto = new UsuarioResponse();
        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setEmail(usuario.getEmail());
        dto.setRol(usuario.getRol());
        return dto;
    }
>>>>>>> 40ba4cc8b7a8079df02ef3c3c0534468ff47d7b9
}