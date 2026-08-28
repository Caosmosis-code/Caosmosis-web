package com.mecanosfera.nomos.exception;

public class ArticuloNoEncontradoException extends RuntimeException {
    public ArticuloNoEncontradoException() {
        super("Artículo no encontrado");
    }
}