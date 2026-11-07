<<<<<<< HEAD
package com.mecanosfera.nomos.exception;

import org.springframework.http.HttpStatus;

public class EmailVerificationException extends RuntimeException {

    private final HttpStatus status;

    public EmailVerificationException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public EmailVerificationException(HttpStatus status, String message, Throwable cause) {
        super(message, cause);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
=======
package com.mecanosfera.nomos.exception;

import org.springframework.http.HttpStatus;

public class EmailVerificationException extends RuntimeException {

    private final HttpStatus status;

    public EmailVerificationException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public EmailVerificationException(HttpStatus status, String message, Throwable cause) {
        super(message, cause);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
>>>>>>> 40ba4cc8b7a8079df02ef3c3c0534468ff47d7b9
}