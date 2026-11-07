package com.mecanosfera.nomos.service;

import java.util.List;
import java.util.Map;

import com.mecanosfera.nomos.exception.EmailVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Component
public class ResendEmailSender implements EmailSender {

    private final String apiKey;
    private final String from;
    private final RestClient restClient;

    public ResendEmailSender(@Value("${resend.api-key:}") String apiKey,
                             @Value("${resend.from:}") String from) {
        this.apiKey = apiKey;
        this.from = from;
        this.restClient = RestClient.create("https://api.resend.com");
    }

    @Override
    public void enviarCodigo(String destinatario, String codigo) {
        if (apiKey.isBlank() || from.isBlank()) {
            throw new EmailVerificationException(HttpStatus.SERVICE_UNAVAILABLE,
                    "El envío de códigos no está configurado en el servidor.");
        }

        Map<String, Object> email = Map.of(
                "from", from,
                "to", List.of(destinatario),
                "subject", "Tu código para crear una cuenta en Caosmosis",
                "text", "Tu código de verificación es " + codigo + ". Vence en 10 minutos.",
                "html", "<p>Tu código para crear una cuenta en Caosmosis:</p>"
                        + "<p style=\"font-size:28px;font-weight:bold;letter-spacing:6px\">" + codigo + "</p>"
                        + "<p>Vence en 10 minutos. Si no solicitaste este código, ignorá este correo.</p>"
        );

        try {
            restClient.post()
                    .uri("/emails")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(email)
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientException exception) {
            throw new EmailVerificationException(HttpStatus.SERVICE_UNAVAILABLE,
                    "No se pudo enviar el código. Intentá nuevamente más tarde.", exception);
        }
    }
}