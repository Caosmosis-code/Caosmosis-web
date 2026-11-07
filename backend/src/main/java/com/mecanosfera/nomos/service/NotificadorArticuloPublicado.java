package com.mecanosfera.nomos.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.mecanosfera.nomos.repository.UsuarioRepository;

@Component
public class NotificadorArticuloPublicado {

    private static final Logger log = LoggerFactory.getLogger(NotificadorArticuloPublicado.class);

    private final UsuarioRepository usuarioRepository;
    private final EmailSender emailSender;
    private final PlantillaArticuloPublicado plantilla;
    private final String frontendUrl;

    public NotificadorArticuloPublicado(UsuarioRepository usuarioRepository,
                                        EmailSender emailSender,
                                        PlantillaArticuloPublicado plantilla,
                                        @Value("${app.frontend-url:http://localhost:3000}") String frontendUrl) {
        this.usuarioRepository = usuarioRepository;
        this.emailSender = emailSender;
        this.plantilla = plantilla;
        this.frontendUrl = frontendUrl;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void notificar(ArticuloPublicadoEvent event) {
        MensajeEmail mensaje = plantilla.crear(event, frontendUrl);
        usuarioRepository.findByRecibirNovedadesTrue().forEach(usuario -> {
            try {
                emailSender.enviarNuevoArticulo(usuario.getEmail(), mensaje);
            } catch (RuntimeException exception) {
                log.warn("No se pudo enviar aviso de artículo publicado a usuario id={}", usuario.getId(), exception);
            }
        });
    }
}