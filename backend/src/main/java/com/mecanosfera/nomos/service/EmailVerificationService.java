package com.mecanosfera.nomos.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Optional;

import com.mecanosfera.nomos.exception.EmailVerificationException;
import com.mecanosfera.nomos.model.EmailVerification;
import com.mecanosfera.nomos.repository.EmailVerificationRepository;
import com.mecanosfera.nomos.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmailVerificationService {

    private static final int CODE_TTL_MINUTES = 10;
    private static final int RESEND_DELAY_SECONDS = 60;
    private static final int MAX_ATTEMPTS = 5;

    private final EmailVerificationRepository verificationRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailSender emailSender;
    private final SecureRandom secureRandom = new SecureRandom();

    public EmailVerificationService(EmailVerificationRepository verificationRepository,
                                    UsuarioRepository usuarioRepository,
                                    PasswordEncoder passwordEncoder,
                                    EmailSender emailSender) {
        this.verificationRepository = verificationRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailSender = emailSender;
    }

    @Transactional
    public void solicitarCodigo(String email) {
        String normalizedEmail = normalizar(email);
        verificationRepository.deleteByExpiraEnBefore(LocalDateTime.now());
        if (usuarioRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new EmailVerificationException(HttpStatus.CONFLICT,
                    "Este correo ya está registrado. Iniciá sesión o usá otro correo.");
        }

        LocalDateTime now = LocalDateTime.now();
        Optional<EmailVerification> previous = verificationRepository.findByEmailIgnoreCase(normalizedEmail);
        if (previous.isPresent()
                && previous.get().getSolicitadoEn().plusSeconds(RESEND_DELAY_SECONDS).isAfter(now)) {
            throw new EmailVerificationException(HttpStatus.TOO_MANY_REQUESTS,
                    "Esperá un minuto antes de solicitar otro código.");
        }

        String code = String.format(Locale.ROOT, "%06d", secureRandom.nextInt(1_000_000));
        EmailVerification verification = previous.orElseGet(EmailVerification::new);
        verification.setEmail(normalizedEmail);
        verification.setCodigoHash(passwordEncoder.encode(code));
        verification.setExpiraEn(now.plusMinutes(CODE_TTL_MINUTES));
        verification.setSolicitadoEn(now);
        verification.setIntentos(0);
        verificationRepository.save(verification);
        emailSender.enviarCodigo(normalizedEmail, code);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public boolean confirmarCodigo(String email, String code) {
        Optional<EmailVerification> result = verificationRepository.findByEmailIgnoreCase(normalizar(email));
        if (result.isEmpty()) return false;

        EmailVerification verification = result.get();
        if (verification.getExpiraEn().isBefore(LocalDateTime.now())
                || verification.getIntentos() >= MAX_ATTEMPTS) {
            verificationRepository.delete(verification);
            return false;
        }

        if (!passwordEncoder.matches(code, verification.getCodigoHash())) {
            verification.setIntentos(verification.getIntentos() + 1);
            if (verification.getIntentos() >= MAX_ATTEMPTS) {
                verificationRepository.delete(verification);
            } else {
                verificationRepository.save(verification);
            }
            return false;
        }

        verificationRepository.delete(verification);
        return true;
    }

    private String normalizar(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}