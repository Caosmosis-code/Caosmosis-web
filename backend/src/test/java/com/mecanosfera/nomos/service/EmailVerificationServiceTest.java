package com.mecanosfera.nomos.service;

import java.time.LocalDateTime;

import org.junit.jupiter.api.AfterEach;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import com.mecanosfera.nomos.MecanosferaApplication;
import com.mecanosfera.nomos.exception.EmailVerificationException;
import com.mecanosfera.nomos.model.EmailVerification;
import com.mecanosfera.nomos.model.Usuario;
import com.mecanosfera.nomos.repository.EmailVerificationRepository;
import com.mecanosfera.nomos.repository.UsuarioRepository;

@SpringBootTest(classes = MecanosferaApplication.class)
@ActiveProfiles("test")
class EmailVerificationServiceTest {

    @Autowired
    private EmailVerificationRepository verificationRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private EmailVerificationService service;

    @AfterEach
    void limpiarDatos() {
        verificationRepository.deleteAll();
        usuarioRepository.deleteAll();
    }

    @Test
    void rechazaSolicitudesParaCorreosRegistrados() {
        Usuario usuario = new Usuario();
        usuario.setNombre("Lector");
        usuario.setEmail("lector@example.com");
        usuario.setPasswordHash(passwordEncoder.encode("clave-segura"));
        usuarioRepository.save(usuario);

        EmailVerificationException exception = assertThrows(
            EmailVerificationException.class,
            () -> service.solicitarCodigo("LECTOR@example.com"));

        assertEquals(HttpStatus.CONFLICT, exception.getStatus());
    }

    @Test
    void codigoIncorrectoSumaUnIntento() {
        EmailVerification verification = verificacionPendiente();
        verificationRepository.save(verification);

        assertFalse(service.confirmarCodigo("lector@example.com", "123456"));

        assertEquals(1, verificationRepository.findByEmailIgnoreCase("lector@example.com").orElseThrow().getIntentos());
    }

    @Test
    void codigoCorrectoConsumeLaVerificacion() {
        EmailVerification verification = verificacionPendiente();
        verification.setCodigoHash(passwordEncoder.encode("123456"));
        verificationRepository.save(verification);

        assertTrue(service.confirmarCodigo("lector@example.com", "123456"));

        assertTrue(verificationRepository.findByEmailIgnoreCase("lector@example.com").isEmpty());
    }

    private EmailVerification verificacionPendiente() {
        EmailVerification verification = new EmailVerification();
        verification.setEmail("lector@example.com");
        verification.setCodigoHash(passwordEncoder.encode("654321"));
        verification.setExpiraEn(LocalDateTime.now().plusMinutes(5));
        verification.setSolicitadoEn(LocalDateTime.now().minusMinutes(1));
        return verification;
    }

}