package com.mecanosfera.nomos.controller;

import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mecanosfera.nomos.dto.LoginRequest;
import com.mecanosfera.nomos.dto.LoginResponse;
import com.mecanosfera.nomos.dto.RegistroRequest;
import com.mecanosfera.nomos.dto.SolicitarCodigoRequest;
import com.mecanosfera.nomos.dto.UsuarioResponse;
import com.mecanosfera.nomos.exception.EmailVerificationException;
import com.mecanosfera.nomos.exception.EmailYaRegistradoException;
import com.mecanosfera.nomos.model.Usuario;
import com.mecanosfera.nomos.repository.UsuarioRepository;
import com.mecanosfera.nomos.security.JwtService;
import com.mecanosfera.nomos.service.EmailVerificationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailVerificationService emailVerificationService;

    public AuthController(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder,
                           JwtService jwtService, AuthenticationManager authenticationManager,
                           EmailVerificationService emailVerificationService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.emailVerificationService = emailVerificationService;
    }

    @PostMapping("/solicitar-codigo")
    public ResponseEntity<Void> solicitarCodigo(@Valid @RequestBody SolicitarCodigoRequest request) {
        emailVerificationService.solicitarCodigo(request.getEmail());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/registro")
    @Transactional
    public ResponseEntity<UsuarioResponse> registrar(@Valid @RequestBody RegistroRequest request) {
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        if (usuarioRepository.existsByEmailIgnoreCase(email)) {
            throw new EmailYaRegistradoException(email);
        }
        if (!emailVerificationService.confirmarCodigo(email, request.getCodigoVerificacion())) {
            throw new EmailVerificationException(HttpStatus.BAD_REQUEST,
                    "El código es incorrecto, venció o superó el límite de intentos.");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setEmail(email);
        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        Usuario guardado = usuarioRepository.save(usuario);

        return ResponseEntity.status(201).body(UsuarioResponse.desde(guardado));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Email o contraseña incorrectos");
        }

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Email o contraseña incorrectos"));

        String token = jwtService.generarToken(usuario.getEmail(), usuario.getRol().name());

        return ResponseEntity.ok(new LoginResponse(token, UsuarioResponse.desde(usuario)));
    }
}