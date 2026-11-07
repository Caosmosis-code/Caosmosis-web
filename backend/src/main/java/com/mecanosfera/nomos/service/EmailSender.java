package com.mecanosfera.nomos.service;

public interface EmailSender {
    void enviarCodigo(String destinatario, String codigo);
}