<<<<<<< HEAD
package com.mecanosfera.nomos.service;

public interface EmailSender {
    void enviarCodigo(String destinatario, String codigo);
=======
package com.mecanosfera.nomos.service;

public interface EmailSender {
    void enviarCodigo(String destinatario, String codigo);
    void enviarNuevoArticulo(String destinatario, MensajeEmail mensaje);
>>>>>>> 40ba4cc8b7a8079df02ef3c3c0534468ff47d7b9
}