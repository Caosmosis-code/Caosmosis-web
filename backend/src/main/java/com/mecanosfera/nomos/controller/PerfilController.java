package com.mecanosfera.nomos.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mecanosfera.nomos.dto.PerfilResponse;
import com.mecanosfera.nomos.dto.PerfilUpdateRequest;
import com.mecanosfera.nomos.model.Usuario;
import com.mecanosfera.nomos.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/usuarios/me")
public class PerfilController {

    private final UsuarioRepository usuarioRepository;

    public PerfilController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PerfilResponse> obtener(Authentication authentication) {
        Usuario usuario = usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return ResponseEntity.ok(PerfilResponse.desde(usuario));
    }

    @PutMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PerfilResponse> actualizar(@RequestBody PerfilUpdateRequest request,
            Authentication authentication) {
        Usuario usuario = usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setBio(request.getBio());
        usuario.setInstagram(request.getInstagram());
        usuario.setTwitter(request.getTwitter());

        Usuario actualizado = usuarioRepository.save(usuario);
        return ResponseEntity.ok(PerfilResponse.desde(actualizado));
    }
}