package com.mecanosfera.nomos.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mecanosfera.nomos.dto.CambiarRolRequest;
import com.mecanosfera.nomos.dto.UsuarioAdminResponse;
import com.mecanosfera.nomos.model.Usuario;
import com.mecanosfera.nomos.repository.UsuarioRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/usuarios")
@PreAuthorize("hasRole('ADMIN')")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioAdminResponse>> listar(
            @RequestParam(required = false) String busqueda) {

        List<Usuario> usuarios = usuarioRepository.findAll();

        if (busqueda != null && !busqueda.isBlank()) {
            String termino = busqueda.toLowerCase();
            usuarios = usuarios.stream()
                    .filter(u -> u.getNombre().toLowerCase().contains(termino)
                            || u.getEmail().toLowerCase().contains(termino))
                    .toList();
        }

        return ResponseEntity.ok(usuarios.stream().map(UsuarioAdminResponse::desde).toList());
    }

    @PutMapping("/{id}/rol")
    public ResponseEntity<UsuarioAdminResponse> cambiarRol(@PathVariable Long id,
            @Valid @RequestBody CambiarRolRequest request,
            Authentication authentication) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getEmail().equals(authentication.getName())) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "No podés cambiar tu propio rol");
        }

        usuario.setRol(request.getRol());
        Usuario actualizado = usuarioRepository.save(usuario);

        return ResponseEntity.ok(UsuarioAdminResponse.desde(actualizado));
    }
}